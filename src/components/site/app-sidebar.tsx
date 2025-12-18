"use client";
import {
  IconFiles,
  IconGavel,
  IconHistory,
  IconHome,
  IconUsers,
} from "@tabler/icons-react";
import Image from "next/image";
import { NavMain } from "@/components/site/nav-main";
import { NavUser } from "@/components/site/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { User } from "../../../convex/auth";
import favicon from "../../app/favicon.svg";
import { Separator } from "../ui/separator";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: IconHome,
      isActive: true,
    },
    {
      title: "Assets",
      url: "/dashboard/assets",
      icon: IconFiles,
      isActive: false,
    },
    {
      title: "Trusted Contacts",
      url: "/dashboard/contacts",
      icon: IconUsers,
      isActive: false,
    },
    {
      title: "Rules",
      url: "/dashboard/rules",
      icon: IconGavel,
      isActive: false,
    },
    {
      title: "Audit Logs",
      url: "/dashboard/audit",
      icon: IconHistory,
      isActive: false,
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Image
                  src={favicon}
                  alt="Logo"
                  className="dark:invert"
                  width={40}
                  height={40}
                />
              </div>
              <div
                className={cn(
                  "flex-1 text-left text-sm leading-tight",
                  !open ? "hidden" : "grid"
                )}
              >
                <span className="truncate font-medium">Haven</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
