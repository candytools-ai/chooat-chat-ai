"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import { ChatHeader } from "@/components/chat/chat-header";
import { Messages } from "@/components/chat/messages";
import { message, Vote } from "@/db/schema";
import { fetcher } from "@/lib/utils";

import { MultimodalInput } from "@/components/chat/multimodal-input";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export interface ChatProps {
    id: string;
    initialMessages: Array<Message>;
    selectedModelId: string;
}

export function Chat({ id, initialMessages, selectedModelId }: ChatProps) {
    const { mutate } = useSWRConfig();
    const { data: session } = useSession();
    const user: any = session?.user;

    const {
        messages,
        setMessages,
        handleSubmit,
        error,
        reload,
        input,
        setInput,
        append,
        isLoading,
        stop,
    } = useChat({
        id,
        api: "/api/chat",
        body: { id, modelId: selectedModelId },
        initialMessages,
        experimental_throttle: 60,
        onFinish: () => {
            mutate("/api/history");
        },
    });

    const { data: votes } = useSWR<Array<Vote>>(
        `/api/vote?chatId=${id}`,
        fetcher
    );

    const [attachments, setAttachments] = useState<Array<Attachment>>([]);

    // const handleDelete = (id: string) => {
    //     setMessages(messages.filter((message) => message.id !== id));
    // };

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    return (
        <>
            <div className="flex flex-col min-w-0 h-dvh bg-main-surface">
                <ChatHeader selectedModelId={selectedModelId} />

                <Messages
                    chatId={id}
                    selectedModelId={selectedModelId}
                    isLoading={isLoading}
                    votes={votes}
                    messages={messages}
                    setMessages={setMessages}
                    reload={reload}
                    error={error}
                />

                <form className="flex mx-auto px-4 bg-transparent pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
                    <MultimodalInput
                        chatId={id}
                        selectedModelId={selectedModelId}
                        input={input}
                        setInput={setInput}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        stop={stop}
                        attachments={attachments}
                        setAttachments={setAttachments}
                        messages={messages}
                        setMessages={setMessages}
                        append={append}
                    />
                </form>
            </div>
        </>
    );
}
