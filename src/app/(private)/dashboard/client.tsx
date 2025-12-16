"use client";

import { useQuery } from "convex/react";
import { AppSidebar } from "@/components/site/app-sidebar";
import { api } from "../../../../convex/_generated/api";

function SidebarClient() {
  const user = useQuery(api.auth.getCurrentUser);

  if (!user) return null;
  return <AppSidebar user={user} />;
}

export default SidebarClient;
