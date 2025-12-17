type Props = {
  data: any;
};

export default function AssetView({ data }: Props) {
  if (!data)
    return <div className="text-sm text-muted-foreground">No asset data</div>;

  // Support both direct asset documents and an envelope with `assetId` and `updates`.
  const source = data.updates ?? data;

  const id = data.assetId ?? source.id ?? source._id ?? data.id ?? "-";
  const provider = source.provider ?? source.name ?? data.provider ?? "-";
  const providerAccountId = source.providerAccountId ?? "-";
  const name = source.name ?? source.title ?? source.assetName ?? "-";
  const type = source.metadata?.info ?? source.type ?? "-";
  const encryptedPayloadPresent = Boolean(source.encryptedPayload);
  const recovery = source.recoveryMethods ?? null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Asset ID</div>
          <div className="font-mono text-sm wrap-break-word">{id}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Provider</div>
          <div className="text-sm">{provider}</div>
        </div>

        <div>
          <div className="text-xs text-muted-foreground">
            Provider Account ID
          </div>
          <div className="text-sm">{providerAccountId}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Name</div>
          <div className="text-sm">{name}</div>
        </div>

        <div>
          <div className="text-xs text-muted-foreground">Type</div>
          <div className="text-sm">{type}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Encrypted</div>
          <div className="text-sm">
            {encryptedPayloadPresent ? "Yes" : "No"}
          </div>
        </div>
      </div>

      {recovery && (
        <div>
          <div className="text-xs text-muted-foreground mb-1">
            Recovery Methods
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="text-sm">
              <strong>Phone:</strong> {recovery.recoveryPhone ?? "-"}
            </div>
            <div className="text-sm">
              <strong>Email:</strong> {recovery.recoveryEmail ?? "-"}
            </div>
            {recovery.notes && (
              <div className="text-sm">
                <strong>Notes:</strong> {recovery.notes}
              </div>
            )}

            {Array.isArray(recovery.twoFactorBackups) && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  2FA Backups
                </div>
                <div className="space-y-2">
                  {recovery.twoFactorBackups.map((b: any, idx: number) => (
                    <div
                      key={b.id ?? idx}
                      className="p-2 bg-muted rounded w-full"
                    >
                      <div className="text-sm">
                        <strong>Method:</strong>{" "}
                        {typeof b.method === "string"
                          ? b.method
                              .split("-")
                              .map(
                                (w: string) =>
                                  w.charAt(0).toUpperCase() + w.slice(1),
                              )
                              .join(" ")
                          : String(b.method ?? "-")}
                      </div>
                      <div className="text-sm wrap-break-word">
                        <strong>Details:</strong> {b.details ?? "-"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
