"use client";

import { useRouter, usePathname } from "next/navigation";

import { Logo } from "@/components/shared/icons";
import { SidebarHistory } from "@/components/sidebar-history";
import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { LogIn } from "lucide-react";
import { NavUser } from "@/components/app-nav-user";
import { getModelByPathname } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ModalContext } from "@/components/modals/providers";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SidebarToggle } from "./sidebar-toggle";

export function AppSidebar({ appName }: { appName: string }) {
    const pathname = usePathname();
    const { setOpenMobile } = useSidebar();
    const model = getModelByPathname(pathname);
    const { data: session } = useSession();
    const user: any = session?.user;
    const { setShowSignInModal } = useContext(ModalContext);

    const { isTablet } = useMediaQuery();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isTablet);

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    useEffect(() => {
        setIsSidebarExpanded(!isTablet);
    }, [isTablet]);

    return (
        <Sidebar
            className="group-data-[side=left]:border-r-0"
            collapsible="icon"
        >
            <SidebarHeader>
                <SidebarMenu>
                    <div className="flex flex-row group-data-[collapsible=icon]:flex-col justify-between items-center">
                        {/* Logo */}
                        <a href="/">
                            <SidebarMenuButton
                                size="lg"
                                // size="sm"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:gap-0"
                            >
                                <div className="grid flex-1 text-left text-base leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="truncate font-semibold">
                                        {siteConfig.name}
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </a>

                        <SidebarToggle />
                    </div>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* history */}
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <SidebarHistory user={user} />
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {user ? (
                    <NavUser user={user} />
                ) : (
                    <Button
                        className="group"
                        variant="secondary"
                        onClick={() => setShowSignInModal(true)}
                    >
                        <span className="group-data-[collapsible=icon]:hidden">
                            Login
                        </span>
                        <LogIn
                            className="-me-1 ms-2 group-data-[collapsible=icon]:m-0 opacity-60 transition-transform group-hover:translate-x-1"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </Button>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
