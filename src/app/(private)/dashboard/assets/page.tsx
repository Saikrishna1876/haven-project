"use client";

import { IconMail } from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { encryptData, generateAESKey } from "@/lib/encryption";
import { api } from "../../../../../convex/_generated/api";

export default function AssetsPage() {
  const assets = useQuery(api.vault.getAssets);
  const addAsset = useMutation(api.vault.addAsset);
  const deleteAsset = useMutation(api.vault.deleteAsset);

  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "",
    metadata: "",
    encryptedPayload: "",
  });

  const handleAddAsset = async () => {
    // Simulate client-side encryption
    const key = await generateAESKey();
    const encrypted = await encryptData(newAsset.encryptedPayload, key);

    // In a real app, we would encrypt the 'key' with the user's public key here
    // and store the encrypted key alongside the asset.
    // For this MVP, we'll just store the "encrypted" payload.

    await addAsset({
      name: newAsset.name,
      type: newAsset.type,
      metadata: { info: newAsset.metadata },
      encryptedPayload: encrypted,
    });
    setIsOpen(false);
    setNewAsset({ name: "", type: "", metadata: "", encryptedPayload: "" });
  };

  const simulateEmailScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simulate finding an asset
      setNewAsset({
        name: "Coinbase Account",
        type: "Crypto",
        metadata: "Detected from email: noreply@coinbase.com",
        encryptedPayload: "",
      });
      setIsOpen(true);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Digital Vault</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={simulateEmailScan}
            disabled={isScanning}
          >
            <IconMail className="mr-2 h-4 w-4" />
            {isScanning ? "Scanning Inbox..." : "Scan Email for Assets"}
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className={buttonVariants()}>
              Add Asset
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Field>
                  <Label>Asset Name</Label>
                  <Input
                    value={newAsset.name}
                    onChange={(e) =>
                      setNewAsset({ ...newAsset, name: e.target.value })
                    }
                    placeholder="e.g. Coinbase Account"
                  />
                </Field>
                <Field>
                  <Label>Type</Label>
                  <Input
                    value={newAsset.type}
                    onChange={(e) =>
                      setNewAsset({ ...newAsset, type: e.target.value })
                    }
                    placeholder="e.g. Crypto, Cloud, Social"
                  />
                </Field>
                <Field>
                  <Label>Metadata (Public)</Label>
                  <Input
                    value={newAsset.metadata}
                    onChange={(e) =>
                      setNewAsset({ ...newAsset, metadata: e.target.value })
                    }
                    placeholder="Platform name, Account ID"
                  />
                </Field>
                <Field>
                  <Label>Secret Payload (Will be Encrypted)</Label>
                  <Textarea
                    value={newAsset.encryptedPayload}
                    onChange={(e) =>
                      setNewAsset({
                        ...newAsset,
                        encryptedPayload: e.target.value,
                      })
                    }
                    placeholder="Private keys, passwords, recovery codes..."
                  />
                </Field>
                <Button onClick={handleAddAsset} className="w-full">
                  Encrypt & Save
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
                Type: {asset.type}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                ID: {asset._id}
              </p>
              <Button
                variant="destructive"
                size="sm"
                className="mt-4"
                onClick={() => deleteAsset({ id: asset._id })}
              >
                Delete
              </Button>
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
