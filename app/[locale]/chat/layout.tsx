import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const experimental_ppr = true;

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: any;
}) {
    const cookieStore = await cookies()
    const isCollapsed = cookieStore.get("sidebar:state")?.value !== "true";

    return (
        <SidebarProvider defaultOpen={!isCollapsed}>
            <AppSidebar appName="chat" />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}
