"use client";

import { IconMail, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
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
import { Textarea } from "@/components/ui/textarea";
import { encryptData, generateAESKey } from "@/lib/encryption";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

type BackupItem = {
  id: number;
  method: "backup-code" | "authenticator" | "security-key";
  details: string;
};

type NewAsset = {
  name: string;
  type: string;
  metadata: string;
  recoveryPhone: string;
  recoveryEmail: string;
  twoFactorBackupsItems: BackupItem[];
  notes: string;
  encryptedPayload: string;
};

export default function AssetsPage() {
  const assets = useQuery(api.vault.getAssets);
  const addAsset = useMutation(api.vault.addAsset);
  const updateAsset = useMutation(api.vault.updateAsset);
  const deleteAsset = useMutation(api.vault.deleteAsset);

  const [isOpen, setIsOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] =
    useState<Id<"vault_items"> | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [newAsset, setNewAsset] = useState<NewAsset>({
    name: "",
    type: "",
    metadata: "",
    recoveryPhone: "",
    recoveryEmail: "",
    twoFactorBackupsItems: [],
    notes: "",
    encryptedPayload: "",
  });

  const addBackupRow = () =>
    setNewAsset((prev) => ({
      ...prev,
      twoFactorBackupsItems: [
        ...prev.twoFactorBackupsItems,
        { id: Date.now(), method: "backup-code", details: "" },
      ],
    }));

  const updateBackupRow = (
    id: number,
    field: "method" | "details",
    value: string,
  ) =>
    setNewAsset((prev) => ({
      ...prev,
      twoFactorBackupsItems: prev.twoFactorBackupsItems.map((r: any) =>
        r.id === id ? { ...r, [field]: value } : r,
      ),
    }));

  const removeBackupRow = (id: number) =>
    setNewAsset((prev) => ({
      ...prev,
      twoFactorBackupsItems: prev.twoFactorBackupsItems.filter(
        (r: any) => r.id !== id,
      ),
    }));

  const handleAddAsset = async () => {
    // Simulate client-side encryption
    const key = await generateAESKey();
    const encrypted = await encryptData(newAsset.encryptedPayload, key);

    const recoveryMethods =
      newAsset.name === "google"
        ? {
            recoveryPhone: newAsset.recoveryPhone,
            recoveryEmail: newAsset.recoveryEmail,
            twoFactorBackups: newAsset.twoFactorBackupsItems,
            notes: newAsset.notes,
          }
        : undefined;

    const payload = {
      provider: newAsset.name || "custom",
      providerAccountId: undefined,
      name: newAsset.name,
      metadata: { info: newAsset.metadata },
      recoveryMethods,
      encryptedPayload: encrypted,
    };

    if (editingAssetId) {
      // Update existing asset (only allowed fields for updateAsset)
      await updateAsset({
        id: editingAssetId,
        name: payload.name,
        metadata: payload.metadata,
        encryptedPayload: payload.encryptedPayload,
        recoveryMethods: payload.recoveryMethods,
      });
    } else {
      // Create new asset
      await addAsset(payload);
    }

    // Reset dialog/form state
    setIsOpen(false);
    setEditingAssetId(null);
    setNewAsset({
      name: "",
      type: "",
      metadata: "",
      recoveryPhone: "",
      recoveryEmail: "",
      twoFactorBackupsItems: [],
      notes: "",
      encryptedPayload: "",
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // closing dialog -> reset editing state and form
      setEditingAssetId(null);
      setNewAsset({
        name: "",
        type: "",
        metadata: "",
        recoveryPhone: "",
        recoveryEmail: "",
        twoFactorBackupsItems: [],
        notes: "",
        encryptedPayload: "",
      });
    }
  };

  const openEdit = (asset: any) => {
    setEditingAssetId(asset._id);
    setNewAsset({
      name: asset.name ?? "",
      type: asset.type ?? "",
      metadata: asset.metadata?.info ?? "",
      recoveryPhone: asset.recoveryMethods?.recoveryPhone ?? "",
      recoveryEmail: asset.recoveryMethods?.recoveryEmail ?? "",
      twoFactorBackupsItems: asset.recoveryMethods?.twoFactorBackups ?? [],
      notes: asset.recoveryMethods?.notes ?? "",
      encryptedPayload: asset.encryptedPayload ?? "",
    });
    setIsOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Digital Vault</h1>
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger className={buttonVariants()}>
              Add Asset
            </DialogTrigger>
            <DialogContent className="min-w-150">
              <DialogHeader>
                <DialogTitle>
                  {editingAssetId ? "Edit Asset" : "Add New Asset"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Field>
                  <Label htmlFor="asset-name-select">Asset Name</Label>
                  <Select
                    value={newAsset.name}
                    onValueChange={(v) => {
                      if (v) setNewAsset({ ...newAsset, name: v });
                    }}
                    id="asset-name-select"
                  >
                    <SelectTrigger>
                      {newAsset.name.charAt(0).toUpperCase() +
                        newAsset.name.slice(1) || "Select Asset"}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="instagram" disabled>
                        Instagram
                        <Badge className="ml-auto" variant="outline">
                          comming soon
                        </Badge>
                      </SelectItem>
                      <SelectItem value="github" disabled>
                        GitHub
                        <Badge className="ml-auto" variant="outline">
                          comming soon
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                {newAsset.name === "google" && (
                  <>
                    <Field>
                      <Label htmlFor="asset-recovery-phone">
                        Recovery Phone
                      </Label>
                      <Input
                        id="asset-recovery-phone"
                        value={newAsset.recoveryPhone}
                        onChange={(e) =>
                          setNewAsset({
                            ...newAsset,
                            recoveryPhone: e.target.value,
                          })
                        }
                        type="tel"
                        placeholder="e.g. +1 555-555-5555"
                      />
                    </Field>
                    <Field>
                      <Label htmlFor="asset-recovery-email">
                        Recovery Email
                      </Label>
                      <Input
                        id="asset-recovery-email"
                        value={newAsset.recoveryEmail}
                        onChange={(e) =>
                          setNewAsset({
                            ...newAsset,
                            recoveryEmail: e.target.value,
                          })
                        }
                        placeholder="e.g. recovery@example.com"
                      />
                    </Field>
                    <Field>
                      <Label>
                        2-Step Backup Codes / Authenticator / Security Key
                      </Label>
                      <div className="space-y-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Method</TableHead>
                              <TableHead className="w-130">Details</TableHead>
                              <TableHead className="flex justify-end">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {newAsset.twoFactorBackupsItems.map((item: any) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Select
                                    value={item.method}
                                    onValueChange={(v) =>
                                      updateBackupRow(item.id, "method", v)
                                    }
                                  >
                                    <SelectTrigger className="w-full h-7 rounded-md border px-2">
                                      {item.method
                                        .split("-")
                                        .map(
                                          (word: string) =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1),
                                        )
                                        .join(" ")}
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="backup-code">
                                        Backup Code
                                      </SelectItem>
                                      <SelectItem value="authenticator">
                                        Authenticator
                                      </SelectItem>
                                      <SelectItem value="security-key">
                                        Security Key
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Textarea
                                    value={item.details}
                                    onChange={(e) =>
                                      updateBackupRow(
                                        item.id,
                                        "details",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Enter codes or notes (do not store live verification codes)"
                                  />
                                </TableCell>
                                <TableCell className="flex justify-center items-center">
                                  <Button
                                    variant="destructive"
                                    size="icon-sm"
                                    onClick={() => removeBackupRow(item.id)}
                                  >
                                    <IconTrash />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="flex justify-end">
                          <Button size="sm" onClick={addBackupRow}>
                            Add Row
                          </Button>
                        </div>
                      </div>
                    </Field>
                    <Field>
                      <Label htmlFor="asset-google-notes">Recovery Notes</Label>
                      <Textarea
                        id="asset-google-notes"
                        value={newAsset.notes}
                        onChange={(e) =>
                          setNewAsset({ ...newAsset, notes: e.target.value })
                        }
                        placeholder="Notes: previously used devices, approximate account creation date, disabled account appeal links, etc."
                      />
                    </Field>
                    <p className="text-xs text-muted-foreground">
                      See official guidance:
                      accounts.google.com/signin/recovery. Do not store
                      verification codes here.
                    </p>
                  </>
                )}
                <Button onClick={handleAddAsset} className="w-full">
                  {editingAssetId ? "Update Asset" : "Encrypt & Save"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {assets?.map((asset) => (
          <Card key={asset._id}>
            <CardHeader>
              <CardTitle>{asset.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Type: {asset.metadata?.info ?? "N/A"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                ID: {asset._id}
              </p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={() => openEdit(asset)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteAsset({ id: asset._id })}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {assets?.length === 0 && (
          <p className="text-muted-foreground col-span-3 text-center py-10">
            No assets in your vault yet.
          </p>
        )}
      </div>
    </div>
  );
}
