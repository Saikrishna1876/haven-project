"use client";

import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { api } from "../../../../../convex/_generated/api";

export default function RulesPage() {
  const rule = useQuery(api.rules.getRule);
  const setRule = useMutation(api.rules.setRule);
  const triggerSwitch = useMutation(api.rules.triggerDeadManSwitch);

  const [inactivityDuration, setInactivityDuration] = useState(30);
  const [approvalRequired, setApprovalRequired] = useState(true);

  useEffect(() => {
    if (rule) {
      setInactivityDuration(rule.inactivityDuration);
      setApprovalRequired(rule.approvalRequired);
    }
  }, [rule]);

  const handleSave = async () => {
    await setRule({
      inactivityDuration: Number(inactivityDuration),
      approvalRequired,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dead Man's Switch Rules</h1>

      <Card>
        <CardHeader>
          <CardTitle>Inactivity Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Inactivity Duration (Days)</Label>
            <Input
              type="number"
              value={inactivityDuration}
              onChange={(e) => setInactivityDuration(Number(e.target.value))}
              min={1}
            />
            <p className="text-sm text-muted-foreground">
              If you don't log in for this many days, the release process will
              begin.
            </p>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label>Require Executor Approval</Label>
              <p className="text-sm text-muted-foreground">
                An executor must manually confirm before data is released.
              </p>
            </div>
            <Switch
              checked={approvalRequired}
              onCheckedChange={setApprovalRequired}
            />
          </div>

          <Button onClick={handleSave}>Save Rules</Button>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone (Demo)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            For the hackathon demo, you can manually trigger the Dead Man's
            Switch event immediately to see the audit logs and flow.
          </p>
          <Button variant="destructive" onClick={() => triggerSwitch()}>
            Trigger Release Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
