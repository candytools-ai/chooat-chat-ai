import { Attachment } from "ai";

import { LoaderIcon } from "@/components/shared/icons";
import { AnimatePresence, motion } from "framer-motion";
import { FileText } from "lucide-react";

export const PreviewAttachment = ({
    attachment,
    isUploading = false,
}: {
    attachment: Attachment;
    isUploading?: boolean;
}) => {
    const { name, url, contentType, size }: any = attachment;

    return (
        <AnimatePresence>
            <div className="flex flex-col gap-2">
                <div className="bg-muted rounded-md relative flex flex-col items-end justify-center">
                    {contentType ? (
                        contentType.startsWith("image") ? (
                            <motion.img
                                src={url}
                                className="rounded-md w-20 h-auto object-cover"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{
                                    y: -10,
                                    scale: 1.1,
                                    opacity: 0,
                                    transition: { duration: 0.2 },
                                }}
                            />
                        ) : (
                            <div className="border flex items-center py-2 px-4 rounded-lg gap-x-2 bg-background dark:bg-muted">
                                <FileText size={32} />
                                <div className="flex-1 flex flex-col justify-center">
                                    <p className="text-sm font-medium line-clamp-1 overflow-hidden">
                                        {name}
                                    </p>
                                    <p className="mt-2 text-xs text-[#677788]">
                                        {size}
                                    </p>
                                </div>
                            </div>
                        ) // : null
                    ) : (
                        <div className=""></div>
                    )}

                    {isUploading && (
                        <div className="animate-spin absolute text-zinc-500">
                            <LoaderIcon />
                        </div>
                    )}
                </div>
            </div>
        </AnimatePresence>
    );
};
