import React from "react";

type Props = { data: any };

export default function RuleView({ data }: Props) {
  if (!data)
    return <div className="text-sm text-muted-foreground">No rule data</div>;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Rule ID</div>
          <div className="font-mono text-sm">{data.id ?? data._id ?? "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Name</div>
          <div className="text-sm">{data.name ?? data.title ?? "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Type</div>
          <div className="text-sm">{data.type ?? "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Enabled</div>
          <div className="text-sm">{data.enabled ? "Yes" : "No"}</div>
        </div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-1">Definition</div>
        <pre className="max-h-60 overflow-auto bg-muted p-3 rounded text-sm">
          {JSON.stringify(data.definition ?? {}, null, 2)}
        </pre>
      </div>
    </div>
  );
}
