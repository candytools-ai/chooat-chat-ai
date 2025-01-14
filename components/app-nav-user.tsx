"use client";

import { useTheme } from "next-themes";
import {
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
    Moon,
    MoonIcon,
    Sun,
    User as UserIcon,
} from "lucide-react";
import { type User } from "next-auth";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavUser({ user, avatar }: { user: User; avatar?: boolean }) {
    const { setTheme, theme } = useTheme();
    const { isMobile } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user.image || ""}
                                    alt={user.name || ""}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {user.name?.substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                className={cn(
                                    "grid flex-1 text-left text-sm leading-tight",
                                    avatar ? "hidden" : ""
                                )}
                            >
                                <span className="truncate font-semibold">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown
                                className={cn(
                                    "ml-auto size-4",
                                    avatar ? "hidden" : ""
                                )}
                            />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user.image || ""}
                                        alt={user.name || ""}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {user.name?.substring(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <a href="#">
                                    <Sparkles />
                                    Upgrade to Pro
                                </a>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                        >
                            {theme === "dark" ? <Moon /> : <Sun />}
                            {`Toggle ${
                                theme === "light" ? "dark" : "light"
                            } mode`}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <a href="#">
                                    <UserIcon />
                                    <p className="text-sm">Account</p>
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a href="#">
                                    <CreditCard />
                                    <p className="text-sm">Billing</p>
                                </a>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem> */}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                signOut({
                                    redirectTo: "/",
                                });
                            }}
                        >
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
