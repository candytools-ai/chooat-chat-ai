"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ReactNode } from "react"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: ReactNode
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild className="h-9">
              <a href={item.url}>
                <div className="flex gap-x-3">
                {/* <item.icon size={18} /> */}
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
