import {
    convertToCoreMessages,
    Message,
    createDataStreamResponse,
    streamText,
    smoothStream,
} from "ai";

import { customModel } from "@/ai";
import { models } from "@/ai/models";
import { systemPrompt } from "@/ai/prompts";
import { auth } from "@/app/(auth)/auth";
import {
    deleteChatById,
    getChatById,
    saveChat,
    saveMessages,
} from "@/db/queries";
import { generateUUID } from "@/lib/utils";
import {
    sanitizeResponseMessages,
    getMostRecentUserMessage,
} from "@/lib/chat-utils";
import { generateTitleFromUserMessage } from "@/app/(chat)/actions";

export const maxDuration = 60;

interface ChatParams {
    id: string; // chatId
    messages: Array<Message>; // messages
    modelId: string; // selectedModelId
}

export async function POST(request: Request) {
    const { id, messages, modelId }: ChatParams = await request.json();

    const session: any = await auth();
    const user = session?.user;
    const currentModel =
        models.find((model) => model.id === modelId) || models[0];

    const coreMessages = convertToCoreMessages(messages);
    const userMessage: any = getMostRecentUserMessage(messages);

    if (!userMessage) {
        return new Response("No user message found", { status: 400 });
    }

    const chat = await getChatById({ id });

    if (!chat) {
        const title = await generateTitleFromUserMessage({
            message: userMessage,
        });
        await saveChat({ id, userId: session.user.id, title, model: modelId });
    }

    const userMessageId = generateUUID();

    await saveMessages({
        messages: [
            {
                ...userMessage,
                id: userMessageId,
                createdAt: new Date(),
                chatId: id,
            },
        ],
    });

    // immediately start streaming (solves RAG issues with status, etc.)
    return createDataStreamResponse({
        execute: (dataStream) => {
            dataStream.writeData({
                type: "user-message-id",
                content: userMessageId,
            });

            const result = streamText({
                model: customModel(currentModel.apiIdentifier),
                system: systemPrompt,
                messages: coreMessages,
                experimental_transform: smoothStream(),
                onFinish: async ({ response, usage }) => {
                    if (user?.id) {
                        try {
                            const responseMessagesWithoutIncompleteToolCalls =
                                sanitizeResponseMessages(response.messages);

                            await saveMessages({
                                messages:
                                    responseMessagesWithoutIncompleteToolCalls.map(
                                        (message) => {
                                            const messageId = generateUUID();

                                            if (message.role === "assistant") {
                                                dataStream.writeMessageAnnotation(
                                                    {
                                                        messageIdFromServer:
                                                            messageId,
                                                    }
                                                );
                                            }

                                            return {
                                                id: messageId,
                                                chatId: id,
                                                role: message.role,
                                                content: message.content,
                                                createdAt: new Date(),
                                            };
                                        }
                                    ),
                            });
                        } catch (error) {
                            console.error("Failed to save chat");
                        }
                    }
                },
                experimental_telemetry: {
                    isEnabled: true,
                    functionId: "stream-text",
                },
            });

            result.mergeIntoDataStream(dataStream);
        },
        onError: (error) => {
            console.error("createDataStreamResponse onError:", error);

            if (error == null) {
                return "unknown error";
            }

            if (typeof error === "string") {
                return error;
            }

            if (error instanceof Error) {
                return error.message;
            }

            return JSON.stringify(error);
        },
    });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return new Response("Not Found", { status: 404 });
    }

    const session = await auth();

    if (!session || !session.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const chat = await getChatById({ id });

        if (chat.userId !== session.user.id) {
            return new Response("Unauthorized", { status: 401 });
        }

        await deleteChatById({ id });

        return new Response("Chat deleted", { status: 200 });
    } catch (error) {
        return new Response("An error occurred while processing your request", {
            status: 500,
        });
    }
}
