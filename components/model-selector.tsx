"use client";

import { useState } from "react";

import { saveModelId } from "@/app/(chat)/actions";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { CheckCirclFillIcon, ChevronDownIcon } from "@/components/shared/icons";
import { AIModelIcon } from "@/components/shared/ai-model-icon";
import type { Model } from "@/ai/models";

export function ModelSelector({
    models,
    model,
    className,
}: {
    models: Model[];
    model: Model;
} & React.ComponentProps<typeof Button>) {
    const [open, setOpen] = useState(false);
    const selectedModel = model;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
                asChild
                className={cn(
                    "w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
                    className
                )}
            >
                <Button
                    variant="ghost"
                    className="md:px-2 md:h-[34px] focus:outline-none focus:border-none focus:ring-0"
                >
                    <div className="flex justify-start items-center size-4 [&_svg]:size-4">
                        <AIModelIcon model={selectedModel} />
                    </div>
                    <span className="text-sm">{selectedModel.label}</span>
                    <ChevronDownIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="min-w-[300px] max-h-[50vh] overflow-y-auto"
            >
                {models.map((model) => {
                    return (
                        <a
                            href={model.path ? `/chat/${model.path}` : "/chat"}
                            key={model.id}
                        >
                            <DropdownMenuItem
                                onSelect={() => {
                                    setOpen(false);
                                    saveModelId(model.id);
                                }}
                                className="gap-4 group/item flex flex-row justify-between items-center cursor-pointer focus:outline-none focus:border-none focus:ring-0"
                                data-active={model.id === selectedModel.id}
                            >
                                <div className="flex items-center py-1 gap-2">
                                    <div className="flex justify-start items-center w-4 h-4">
                                        <AIModelIcon model={model} />
                                    </div>
                                    <span className="text-sm">
                                        {model.label}
                                    </span>
                                </div>
                                <div className="text-primary opacity-0 group-data-[active=true]/item:opacity-100">
                                    <CheckCirclFillIcon />
                                </div>
                            </DropdownMenuItem>
                        </a>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
