"use client";

import { usePathname, useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";

import { ModelSelector } from "@/components/model-selector";
import { Separator } from "@/components/ui/separator";
import { memo } from "react";
import { models } from "@/ai/models";
import { BetterTooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { getModelByPathname } from "@/lib/utils";
import { EditIcon } from "@/components/shared/icons";
import { Button2 } from "@/components/ui/button2";

function PureChatHeader({ selectedModelId }: { selectedModelId: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const model = getModelByPathname(pathname);
    // const { open } = useSidebar();

    const { width: windowWidth } = useWindowSize();

    return (
        <>
            <header className="flex h-16 shrink-0 sticky top-0 bg-transparent items-centertransition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 gap-2">
                <div className="flex items-center gap-2 px-4 order-1">
                    {/* New chat */}
                    <BetterTooltip content="New Chat" align="start">
                        <Button2
                            variant="ghost"
                            className="p-2 group-data-[collapsible=icon]:mt-2"
                            onClick={() => {
                                router.push(`/chat/${model.path}`);
                            }}
                        >
                            <EditIcon className="size-5 text-muted-foreground" />
                        </Button2>
                    </BetterTooltip>
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <ModelSelector
                        models={models}
                        model={model}
                        className="order-1 md:order-2"
                    />
                </div>
            </header>
        </>
    );
}
export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
    return prevProps.selectedModelId === nextProps.selectedModelId;
});
