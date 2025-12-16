"use client";

import { IconFiles, IconHistory, IconUsers } from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "../../../../convex/_generated/api";

export default function Page() {
  const assets = useQuery(api.vault.getAssets);
  const contacts = useQuery(api.contacts.getContacts);
  const logs = useQuery(api.audit.getLogs);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <IconFiles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Secured in your vault
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trusted Contacts
            </CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Verified executors & viewers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <IconHistory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {logs && logs.length > 0
                ? new Date(logs[0].timestamp).toLocaleDateString()
                : "No activity"}
            </div>
            <p className="text-xs text-muted-foreground">
              {logs && logs.length > 0 ? logs[0].action : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
