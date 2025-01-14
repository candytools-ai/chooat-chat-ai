"use client";

import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import cx from "classnames";
import React, {
    useRef,
    useEffect,
    useState,
    useCallback,
    Dispatch,
    SetStateAction,
    ChangeEvent,
    useContext,
    memo,
} from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
import { usePathname } from "next/navigation";

import { formatBytes, sanitizeUIMessages } from "@/lib/utils";

import { PreviewAttachment } from "@/components/chat/preview-attachment";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, Paperclip } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BetterTooltip } from "@/components/ui/tooltip";
import { models } from "@/ai/models";
import { useSession } from "next-auth/react";
import { ModalContext } from "@/components/modals/providers";
import equal from "fast-deep-equal";
import { StopIcon } from "@/components/shared/icons";

export function PureMultimodalInput({
    chatId,
    selectedModelId,
    input,
    setInput,
    isLoading,
    stop,
    attachments,
    setAttachments,
    messages,
    setMessages,
    append,
    handleSubmit,
    className,
}: {
    chatId: string;
    selectedModelId: string;
    input: string;
    setInput: (value: string) => void;
    isLoading: boolean;
    stop: () => void;
    attachments: Array<Attachment>;
    setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
    messages: Array<Message>;
    setMessages: Dispatch<SetStateAction<Array<Message>>>;
    append: (
        message: Message | CreateMessage,
        chatRequestOptions?: ChatRequestOptions
    ) => Promise<string | null | undefined>;
    handleSubmit: (
        event?: {
            preventDefault?: () => void;
        },
        chatRequestOptions?: ChatRequestOptions
    ) => void;
    className?: string;
}) {
    const [composition, setComposition] = useState(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { width } = useWindowSize();
    const model =
        models.find((model) => model.id === selectedModelId) || models[0];
    const { data: session } = useSession();
    const user: any = session?.user;
    const { setShowSignInModal } = useContext(ModalContext);
    const pathname = usePathname();

    useEffect(() => {
        if (textareaRef.current) {
            adjustHeight();
        }
    }, []);

    const adjustHeight = () => {
        if (textareaRef.current) {
            if (textareaRef.current.scrollHeight > 260) {
                // textareaRef.current.style.overflow = "auto"
                return;
            }
            textareaRef.current.style.height = "auto";
            // console.info("textareaRef.current.scrollHeight:", textareaRef.current.scrollHeight)
            textareaRef.current.style.height = `${
                textareaRef.current.scrollHeight + 2
            }px`;
        }
    };

    const [localStorageInput, setLocalStorageInput] = useLocalStorage(
        "input",
        ""
    );

    useEffect(() => {
        if (textareaRef.current) {
            const domValue = textareaRef.current.value;
            // Prefer DOM value over localStorage to handle hydration
            const finalValue = domValue || localStorageInput || "";
            setInput(finalValue);
            adjustHeight();
        }
        // Only run once after hydration
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLocalStorageInput(input);
    }, [input, setLocalStorageInput]);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
        adjustHeight();
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

    // 将文件对象转换为 Data URL 格式
    function fileToDataURL(file: File) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result); // 返回 Data URL
            reader.onerror = reject;
            reader.readAsDataURL(file); // 读取文件为 Data URL
        });
    }

    const submitForm = useCallback(() => {
        // set chatId
        if (pathname.startsWith(`/chat/${model.path}`)) {
            window.history.replaceState({}, "", `/chat/${model.path}/${chatId}`);
        }

        handleSubmit(undefined, {
            experimental_attachments: attachments,
        });

        // 置空附件
        setAttachments([]);
        setLocalStorageInput("");

        if (width && width > 768) {
            textareaRef.current?.focus();
        }
    }, [pathname, model.path, handleSubmit, attachments, setAttachments, setLocalStorageInput, width, chatId]);

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("file_path", "");

        // to Data URL
        const base64DataUrl = await fileToDataURL(file);

        try {
            const response = await fetch(`/api/files/upload`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                const { url, pathname, contentType } = data;

                return {
                    uploadUrl: url,
                    // url,
                    size: formatBytes(file.size),
                    url: base64DataUrl,
                    name: pathname,
                    contentType: contentType,
                };
            } else {
                const { message } = await response.json();
                toast.error(message);
            }
        } catch (error) {
            toast.error("Failed to upload file, please try again!");
        }
    };

    const handleFileChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            const _files = Array.from(event.target.files || []);

            setUploadQueue(_files.map((file) => file.name));

            try {
                const uploadPromises = _files.map((file) => uploadFile(file));
                const uploadedAttachments = await Promise.all(uploadPromises);
                const successfullyUploadedAttachments =
                    uploadedAttachments.filter(
                        (attachment) => attachment !== undefined
                    );

                // @ts-ignore
                setAttachments((currentAttachments) => [
                    ...currentAttachments,
                    ...successfullyUploadedAttachments,
                ]);
            } catch (error) {
                console.error("Error uploading files!", error);
            } finally {
                setUploadQueue([]);
            }
        },
        [setAttachments]
    );

    const handlePaste = async (event: React.ClipboardEvent) => {
        const items = event.clipboardData?.items;

        if (items) {
            const files = Array.from(items)
                .map((item) => item.getAsFile())
                .filter((file): file is File => file !== null);

            if (files.length > 0) {
                setUploadQueue(files.map((file) => file.name));

                try {
                    const uploadPromises = files.map((file) =>
                        uploadFile(file)
                    );
                    const uploadedAttachments = await Promise.all(
                        uploadPromises
                    );
                    const successfullyUploadedAttachments =
                        uploadedAttachments.filter(
                            (attachment) => attachment !== undefined
                        );

                    // @ts-ignore
                    setAttachments((currentAttachments) => [
                        ...currentAttachments,
                        ...successfullyUploadedAttachments,
                    ]);
                } catch (error) {
                    console.error("Error uploading files!", error);
                } finally {
                    setUploadQueue([]);
                }
            }
        }
    };

    return (
        <div className="relative w-full flex flex-col gap-4">
            <input
                type="file"
                className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                tabIndex={-1}
            />

            {(attachments.length > 0 || uploadQueue.length > 0) && (
                <div className="flex flex-row gap-2 items-end pt-1">
                    {attachments.map((attachment) => (
                        <PreviewAttachment
                            key={attachment.url}
                            attachment={attachment}
                        />
                    ))}

                    {uploadQueue.map((filename) => (
                        <PreviewAttachment
                            key={filename}
                            attachment={{
                                url: "",
                                name: filename,
                                contentType: "",
                            }}
                            isUploading={true}
                        />
                    ))}
                </div>
            )}

            <div className="flex flex-col w-full rounded-xl bg-[#f4f4f4] dark:bg-[#2f2f2f] gap-2 py-2.5 disabled:cursor-not-allowed disabled:opacity-50">
                <textarea
                    ref={textareaRef}
                    placeholder="Send a message..."
                    value={input}
                    onChange={handleInput}
                    onPaste={handlePaste}
                    className={cx(
                        "min-h-[24px] max-h-[calc(58dvh)] overflow-auto px-3 resize-none shadow-none border-none text-base bg-transparent focus:outline-none focus:border-none",
                        className
                    )}
                    rows={4}
                    autoFocus
                    onCompositionStart={() => setComposition(false)}
                    onCompositionEnd={() => setComposition(true)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();

                            if (!composition) return;

                            if (isLoading) {
                                toast.error(
                                    "Please wait for the model to finish its response!"
                                );
                            } else {
                                submitForm();
                            }
                        }
                    }}
                />

                {/* Chat Input Toolbar */}
                <div className="flex items-center justify-end gap-2 px-3">
                    {(model.fileAccept) ? (
                        <>
                            <BetterTooltip content={`Supported file formats: ${model.formats}.`} align="center">
                                <Button
                                    className="rounded-full p-2 h-fit hover:bg-black/10"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        fileInputRef.current?.click();
                                    }}
                                    variant="ghost"
                                    disabled={isLoading}
                                >
                                    <Paperclip size={16} />
                                </Button>
                            </BetterTooltip>

                            <Separator orientation="vertical" className="h-6" />
                        </>
                    ) : null}

                    {isLoading ? (
                        <Button
                            className="rounded-full p-1.5 h-fit disabled:opacity-30"
                            onClick={(event) => {
                                event.preventDefault();
                                stop();
                                setMessages((messages) =>
                                    sanitizeUIMessages(messages)
                                );
                            }}
                        >
                            <StopIcon size={14} />
                        </Button>
                    ) : (
                        <Button
                            className="rounded-full p-1.5 h-fit disabled:opacity-30"
                            onClick={(event) => {
                                event.preventDefault();
                                submitForm();
                            }}
                            disabled={
                                input.length === 0 || uploadQueue.length > 0
                            }
                        >
                            <ArrowUpIcon size={14} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export const MultimodalInput = memo(
    PureMultimodalInput,
    (prevProps, nextProps) => {
        if (prevProps.input !== nextProps.input) return false;
        if (prevProps.isLoading !== nextProps.isLoading) return false;
        if (!equal(prevProps.attachments, nextProps.attachments)) return false;

        return true;
    }
);
