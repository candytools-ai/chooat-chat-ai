/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import type { ChatRequestOptions, Message } from "ai";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
// import { memo, useMemo, useState } from "react";
import { memo, useState } from "react";

import type { Vote } from "@/db/schema";

import Markdown from "@/components/markdown-react";
import { MessageActions } from "@/components/chat/message-actions";
import { PreviewAttachment } from "./preview-attachment";
import equal from "fast-deep-equal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AIModelIcon } from "@/components/shared/ai-model-icon";
import { models } from "@/ai/models";

const MessageContainer = ({ message, children }: any) => (
    <AnimatePresence>
        <motion.div
            className="w-full mx-auto max-w-3xl px-4 group/message"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            data-role={message.role}
        >
            <div
                className={cn(
                    "group-data-[role=user]/message:bg-message-surface group-data-[role=user]/message:text-secondary-foreground flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-t-xl rounded-l-xl rounded-br-sm"
                )}
            >
                {children}
            </div>
        </motion.div>
    </AnimatePresence>
);

const PurePreviewMessage = ({
    chatId,
    selectedModelId,
    message,
    vote,
    isLoading,
    setMessages,
    reload,
}: // isReadonly,
{
    chatId: string;
    selectedModelId: string;
    message: Message;
    vote: Vote | undefined;
    isLoading: boolean;
    setMessages: (
        messages: Message[] | ((messages: Message[]) => Message[])
    ) => void;
    reload: (
        chatRequestOptions?: ChatRequestOptions
    ) => Promise<string | null | undefined>;
    // isReadonly: boolean;
}) => {
    const [mode, setMode] = useState<"view" | "edit">("view");
    const currentModel =
        models.find((model) => model.id === selectedModelId) || models[0];

    return (
        <MessageContainer message={message}>
            {message.role === "assistant" && (
                <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
                    <div className="translate-y-px size-5">
                        <AIModelIcon model={currentModel} />
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2 flex-1 shrink-0">
                {message.experimental_attachments &&
                    message.experimental_attachments.length > 0 && (
                        <div className="flex flex-row justify-end gap-2">
                            {message.experimental_attachments.map(
                                (attachment) => (
                                    <PreviewAttachment
                                        key={attachment.url}
                                        attachment={attachment}
                                    />
                                )
                            )}
                        </div>
                    )}

                {message.content && mode === "view" && (
                    <Markdown>{message.content as string}</Markdown>
                )}

                <MessageActions
                    key={`action-${message.id}`}
                    chatId={chatId}
                    message={message}
                    vote={vote}
                    isLoading={isLoading}
                    reload={reload}
                />
            </div>
        </MessageContainer>
    );
};

export const PreviewMessage = memo(
    PurePreviewMessage,
    (prevProps, nextProps) => {
        if (prevProps.isLoading !== nextProps.isLoading) return false;
        if (prevProps.message.content !== nextProps.message.content)
            return false;
        if (
            !equal(
                prevProps.message.toolInvocations,
                nextProps.message.toolInvocations
            )
        )
            return false;
        if (!equal(prevProps.vote, nextProps.vote)) return false;

        return true;
    }
);

export const ThinkingMessage = ({
    selectedModelId,
}: {
    selectedModelId: string;
}) => {
    const role = "assistant";
    const currentModel =
        models.find((model) => model.id === selectedModelId) || models[0];

    return (
        <motion.div
            className="w-full mx-auto max-w-3xl px-4 group/message "
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
            data-role={role}
        >
            <div
                className={cx(
                    "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
                    {
                        "group-data-[role=user]/message:bg-muted": true,
                    }
                )}
            >
                <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
                    <div className="size-5">
                        <AIModelIcon model={currentModel} />
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-col gap-4 text-muted-foreground">
                        Thinking...
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const ErrorMessage = ({
    error,
    reload,
    selectedModelId,
}: {
    error: Error;
    reload: (
        chatRequestOptions?: ChatRequestOptions
    ) => Promise<string | null | undefined>;
    selectedModelId: string;
}) => {
    const role = "assistant";
    const currentModel =
        models.find((model) => model.id === selectedModelId) || models[0];

    return (
        <motion.div
            className="w-full mx-auto max-w-3xl px-4 group/message "
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
            data-role={role}
        >
            <div
                className={cx(
                    "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
                    {
                        "group-data-[role=user]/message:bg-muted": true,
                    }
                )}
            >
                <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
                    <div className="size-5">
                        <AIModelIcon model={currentModel} />
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-col gap-4 font-medium text-destructive">
                        {error.message}
                        {/* An error occurred. */}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-fit w-fit py-1 px-2 text-muted-foreground"
                        onClick={() => reload()}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export const WelcomeMessage = ({
    name,
    image,
    message,
}: {
    name: string;
    image: string;
    message: string;
}) => {
    const role = "assistant";

    return (
        <motion.div
            className="w-full mx-auto max-w-3xl px-4 group/message "
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            data-role={role}
        >
            <div
                className={cx(
                    "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
                    {
                        "group-data-[role=user]/message:bg-muted": true,
                    }
                )}
            >
                <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
                    <div className="size-5">
                        <img src={image} className="size-full object-cover" />
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <div className="mb-1 w-full font-semibold">
                        Chooat
                        <span className="m-2 rounded-full bg-violet-500/10 px-1.5 py-1 text-xs text-violet-500">
                            {name}
                        </span>
                    </div>
                    <div className="markdown-body">{message}</div>
                </div>
            </div>
        </motion.div>
    );
};
