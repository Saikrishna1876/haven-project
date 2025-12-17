import React from "react";

type Props = { data: any; isDeadMan: boolean; isContact?: boolean };

export default function ContactView({
  data,
  isDeadMan = false,
  isContact = true,
}: Props) {
  if (!data)
    return <div className="text-sm text-muted-foreground">No contact data</div>;

  // Support envelope shapes like { assetId, updates } or direct payloads
  const payload = data.updates ?? data;

  if (isDeadMan) {
    return (
      <div className="space-y-3">
        <div>
          <div className="text-xs text-muted-foreground">Reason</div>
          <div className="text-sm truncate">{String(payload.reason)}</div>
        </div>
      </div>
    );
  } else if (isContact) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Name</div>
            <div className="text-sm truncate">
              {payload.name ?? payload.fullName ?? "-"}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Email</div>
            <div className="text-sm truncate">{payload.email ?? "-"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Phone</div>
            <div className="text-sm truncate">{payload.phone ?? "-"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Organization</div>
            <div className="text-sm truncate">
              {payload.org ?? payload.organization ?? "-"}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Method</div>
            <div className="text-sm truncate">{String(payload.method)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Recipient</div>
            <div className="text-sm truncate">{String(payload.recipient)}</div>
          </div>
        </div>
      </div>
    );
  }

  // ...existing contact view...
}
