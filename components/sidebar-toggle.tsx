import { ComponentProps } from "react";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelRightClose } from "lucide-react";

export function SidebarToggle({
    className,
}: ComponentProps<typeof SidebarTrigger>) {
    const { toggleSidebar, open } = useSidebar();

    return (
        <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="ml-auto size-9 lg:size-8"
        >
            {open ? (
                <PanelLeftClose size={18} className="stroke-muted-foreground" />
            ) : (
                <PanelRightClose
                    size={18}
                    className="stroke-muted-foreground"
                />
            )}
        </Button>
    );
}
