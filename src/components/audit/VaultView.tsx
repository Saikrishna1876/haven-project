type Props = { data: any };

export default function VaultView({ data }: Props) {
  if (!data)
    return <div className="text-sm text-muted-foreground">No vault data</div>;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Vault ID</div>
          <div className="font-mono text-sm">{data.id ?? data._id ?? "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Name</div>
          <div className="text-sm">{data.name ?? data.title ?? "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Owner</div>
          <div className="text-sm">{data.owner ?? "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Visibility</div>
          <div className="text-sm">{data.visibility ?? "-"}</div>
        </div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-1">Config</div>
        <pre className="max-h-60 overflow-auto bg-muted p-3 rounded text-sm">
          {JSON.stringify(data.config ?? data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
