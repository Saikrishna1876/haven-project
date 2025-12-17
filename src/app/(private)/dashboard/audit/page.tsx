"use client";

import { IconEye, IconView360, IconViewfinder } from "@tabler/icons-react";
import { useQuery } from "convex/react";
import React, { useMemo, useState } from "react";
import AssetView from "@/components/audit/AssetView";
import ContactView from "@/components/audit/ContactView";
import RuleView from "@/components/audit/RuleView";
import VaultView from "@/components/audit/VaultView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "../../../../../convex/_generated/api";
import type { AuditLog } from "../../../../../convex/types";

export default function AuditPage() {
  const logs: AuditLog[] | undefined = useQuery(api.audit.getLogs);

  // Data table state: search and action filter
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<"all" | string>("all");

  // unique actions for filter select
  const actions = useMemo(() => {
    if (!logs) return [];
    return Array.from(new Set(logs.map((l) => l.action))).sort();
  }, [logs]);

  // filtered logs derived from search + action filter
  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    const q = search.trim().toLowerCase();
    return logs.filter((log) => {
      if (actionFilter !== "all" && log.action !== actionFilter) return false;
      if (!q) return true;
      const hay = `${log.action} ${JSON.stringify(log.details)}`.toLowerCase();
      return hay.includes(q);
    });
  }, [logs, search, actionFilter]);

  // dialog state for viewing a full audit log
  const [open, setOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Audit Logs</h1>

      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters / table toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
            <div className="flex gap-2 w-8/12">
              <Input
                aria-label="Search logs"
                placeholder="Search action or details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-8/12"
              />

              <Select
                value={actionFilter}
                onValueChange={(value) => setActionFilter(value || "all")}
              >
                <SelectTrigger className="w-4/12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {actions.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto text-sm text-muted-foreground flex w-4/12 justify-end">
              {logs ? `${filteredLogs.length} of ${logs.length}` : "Loading..."}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/12">Action</TableHead>
                <TableHead className="w-3/12">Timestamp</TableHead>
                <TableHead className="w-5/12">Details</TableHead>
                <TableHead className="w-1/12 text-center">#</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs?.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate max-w-100">
                    {JSON.stringify(log.details)}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="secondary"
                      size="icon"
                      aria-label={`View log ${log._id}`}
                      onClick={() => {
                        setSelectedLog(log);
                        setOpen(true);
                      }}
                    >
                      <IconEye size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {logs && filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No logs match your filters.
                  </TableCell>
                </TableRow>
              )}

              {!logs && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Dialog for viewing full audit log */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-3xl">
              <DialogHeader>
                <DialogTitle>Audit log details</DialogTitle>
              </DialogHeader>

              <DialogDescription>
                <span className="mb-2">
                  <strong>Action:</strong> {selectedLog?.action}
                </span>
                <span className="mb-2">
                  <strong>Timestamp:</strong>{" "}
                  {selectedLog
                    ? new Date(selectedLog.timestamp).toLocaleString()
                    : ""}
                </span>
              </DialogDescription>

              <div className="mt-4">
                {/* Render domain-specific read-only forms based on action */}
                {selectedLog &&
                  selectedLog.action.toLowerCase().includes("asset") && (
                    <AssetView data={selectedLog.details} />
                  )}

                {selectedLog &&
                  selectedLog.action.toLowerCase().includes("vault") && (
                    <VaultView data={selectedLog.details} />
                  )}

                {selectedLog &&
                  (selectedLog.action.toLowerCase().includes("contact") ||
                    selectedLog.action.toLowerCase().includes("recovery") ||
                    selectedLog.action.toLowerCase().includes("dead")) && (
                    <ContactView
                      data={selectedLog.details}
                      isDeadMan={selectedLog.action
                        .toLowerCase()
                        .includes("dead")}
                      isContact={selectedLog.action
                        .toLowerCase()
                        .includes("contact")}
                    />
                  )}

                {selectedLog &&
                  selectedLog.action.toLowerCase().includes("rule") && (
                    <RuleView data={selectedLog.details} />
                  )}
              </div>

              <DialogFooter>
                <DialogClose>Close</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
