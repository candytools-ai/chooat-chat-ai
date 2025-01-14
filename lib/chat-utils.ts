import {
    CoreAssistantMessage,
    CoreMessage,
    CoreToolMessage,
    Message,
} from "ai";

export function sanitizeResponseMessages(
    messages: Array<CoreToolMessage | CoreAssistantMessage>
): Array<CoreToolMessage | CoreAssistantMessage> {
    const toolResultIds: Array<string> = [];

    for (const message of messages) {
        if (message.role === "tool") {
            for (const content of message.content) {
                if (content.type === "tool-result") {
                    toolResultIds.push(content.toolCallId);
                }
            }
        }
    }

    const messagesBySanitizedContent = messages.map((message) => {
        if (message.role !== "assistant") return message;

        if (typeof message.content === "string") return message;

        const sanitizedContent = message.content.filter((content) =>
            content.type === "tool-call"
                ? toolResultIds.includes(content.toolCallId)
                : content.type === "text"
                ? content.text.length > 0
                : true
        );

        return {
            ...message,
            content: sanitizedContent,
        };
    });

    return messagesBySanitizedContent.filter(
        (message) => message.content.length > 0
    );
}

export function getRecentUserMessage(messages: Array<CoreMessage>) {
    const userMessages = messages.filter((message) => message.role === 'user');
    return userMessages.at(-1);
}

export function getMostRecentUserMessage(submitMessages: Array<Message>) {
    const userMessages = submitMessages.filter(
        (message) => message.role === "user"
    );
    const userMessage = userMessages.at(-1);
    const { role, content, experimental_attachments }: any = userMessage;
    return {
        role: "user",
        content: experimental_attachments
            ? [
                  { type: "text", text: content },
                  ...experimental_attachments.map((attachment: any) => ({
                      size: attachment.size,
                      url: attachment.uploadUrl,
                      name: attachment.name,
                      type: attachment.contentType,
                  })),
              ]
            : content,
    };
}

export function setLastCoreMessage(coreMessages: any[], prompts: string) {
    coreMessages[coreMessages.length - 1].content = prompts;
}
