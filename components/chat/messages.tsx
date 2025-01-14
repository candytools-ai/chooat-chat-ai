import { ChatRequestOptions, Message } from "ai";
import { PreviewMessage, ThinkingMessage, ErrorMessage } from "@/components/chat/message";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { Overview } from "@/components/chat/overview";
import { memo } from "react";
import { Vote } from "@/db/schema";
import equal from "fast-deep-equal";

interface MessagesProps {
    chatId: string;
    selectedModelId: string;
    isLoading: boolean;
    votes?: Array<Vote> | undefined;
    messages: Array<Message>;
    setMessages: (
        messages: Message[] | ((messages: Message[]) => Message[])
    ) => void;
    reload: (
        chatRequestOptions?: ChatRequestOptions
    ) => Promise<string | null | undefined>;
    error: undefined | Error;
}

function PureMessages({
    chatId,
    selectedModelId,
    isLoading,
    votes,
    messages,
    setMessages,
    reload,
    error,
}:
MessagesProps) {
    const [messagesContainerRef, messagesEndRef] =
        useScrollToBottom<HTMLDivElement>(messages);

    const getVotes = (message: any) => {
        if (!votes) return undefined;
        return votes.find((vote: any) => vote.messageId === message.id);
    };

    return (
        <div
            ref={messagesContainerRef}
            className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
        >
            {messages.length === 0 && <Overview modelId={selectedModelId} />}

            {messages.map((message, index) => (
                <PreviewMessage
                    key={message.id}
                    chatId={chatId}
                    selectedModelId={selectedModelId}
                    message={message}
                    isLoading={isLoading && messages.length - 1 === index}
                    vote={getVotes(message)}
                    setMessages={setMessages}
                    reload={reload}
                    // isReadonly={isReadonly}
                />
            ))}

            {error && (
                <>
                    <ErrorMessage
                        error={error}
                        reload={reload}
                        selectedModelId={selectedModelId}
                    />
                </>
            )}

            {isLoading &&
                messages.length > 0 &&
                messages[messages.length - 1].role === "user" && (
                    <ThinkingMessage selectedModelId={selectedModelId} />
                )}

            <div
                ref={messagesEndRef}
                className="shrink-0 min-w-[24px] min-h-[24px]"
            />
        </div>
    );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.isLoading && nextProps.isLoading) return false;
    if (prevProps.messages.length !== nextProps.messages.length) return false;
    if (!equal(prevProps.votes, nextProps.votes)) return false;

    return true;
});
