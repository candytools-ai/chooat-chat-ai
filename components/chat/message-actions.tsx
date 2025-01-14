import { Message } from "ai";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useCopyToClipboard } from "usehooks-ts";

import { Vote } from "@/db/schema";
import { getMessageIdFromAnnotations } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowClockwise, Copy, ThumbsDown, ThumbsUp } from "@phosphor-icons/react";

export function MessageActions({
    chatId,
    message,
    vote,
    isLoading,
    reload,
}: {
    chatId: string;
    message: Message;
    vote: Vote | undefined;
    isLoading: boolean;
    reload: any;
}) {
    const { mutate } = useSWRConfig();
    const [_, copyToClipboard] = useCopyToClipboard();

    if (isLoading) return null;
    if (message.role === "user") return null;
    if (message.toolInvocations && message.toolInvocations.length > 0)
        return null;

    return (
        <TooltipProvider delayDuration={0}>
            <div className="flex flex-row gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="h-fit p-1 text-muted-foreground"
                            // size="icon"
                            variant="ghost"
                            onClick={async () => {
                                await copyToClipboard(
                                    message.content as string
                                );
                                toast.success("Copied to clipboard!");
                            }}
                        >
                            <Copy />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="h-fit p-1 text-muted-foreground"
                            variant="ghost"
                            onClick={async () => {
                                reload();
                            }}
                        >
                            <ArrowClockwise />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Retry</TooltipContent>
                </Tooltip>

                {vote && <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="h-fit p-1 text-muted-foreground !pointer-events-auto"
                            disabled={vote && vote.isUpvoted}
                            variant="ghost"
                            onClick={async () => {
                                const messageId =
                                    getMessageIdFromAnnotations(message);

                                const upvote = fetch("/api/vote", {
                                    method: "PATCH",
                                    body: JSON.stringify({
                                        chatId,
                                        messageId,
                                        type: "up",
                                    }),
                                });

                                toast.promise(upvote, {
                                    loading: "Upvoting Response...",
                                    success: () => {
                                        mutate<Array<Vote>>(
                                            `/api/vote?chatId=${chatId}`,
                                            (currentVotes) => {
                                                if (!currentVotes) return [];

                                                const votesWithoutCurrent =
                                                    currentVotes.filter(
                                                        (vote) =>
                                                            vote.messageId !==
                                                            message.id
                                                    );

                                                return [
                                                    ...votesWithoutCurrent,
                                                    {
                                                        chatId,
                                                        messageId: message.id,
                                                        isUpvoted: true,
                                                    },
                                                ];
                                            },
                                            { revalidate: false }
                                        );

                                        return "Upvoted Response!";
                                    },
                                    error: "Failed to upvote response.",
                                });
                            }}
                        >
                            <ThumbsUp />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Upvote Response</TooltipContent>
                </Tooltip>}

                {vote && <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="h-fit p-1 text-muted-foreground !pointer-events-auto"
                            variant="ghost"
                            disabled={vote && !vote.isUpvoted}
                            onClick={async () => {
                                const messageId =
                                    getMessageIdFromAnnotations(message);

                                const downvote = fetch("/api/vote", {
                                    method: "PATCH",
                                    body: JSON.stringify({
                                        chatId,
                                        messageId,
                                        type: "down",
                                    }),
                                });

                                toast.promise(downvote, {
                                    loading: "Downvoting Response...",
                                    success: () => {
                                        mutate<Array<Vote>>(
                                            `/api/vote?chatId=${chatId}`,
                                            (currentVotes) => {
                                                if (!currentVotes) return [];

                                                const votesWithoutCurrent =
                                                    currentVotes.filter(
                                                        (vote) =>
                                                            vote.messageId !==
                                                            message.id
                                                    );

                                                return [
                                                    ...votesWithoutCurrent,
                                                    {
                                                        chatId,
                                                        messageId: message.id,
                                                        isUpvoted: false,
                                                    },
                                                ];
                                            },
                                            { revalidate: false }
                                        );

                                        return "Downvoted Response!";
                                    },
                                    error: "Failed to downvote response.",
                                });
                            }}
                        >
                            <ThumbsDown />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Downvote Response</TooltipContent>
                </Tooltip>}
            </div>
        </TooltipProvider>
    );
}
