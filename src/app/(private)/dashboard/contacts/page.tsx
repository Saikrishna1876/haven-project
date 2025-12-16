"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "../../../../../convex/_generated/api";
import { IconTrash } from "@tabler/icons-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ContactsPage() {
  const contacts = useQuery(api.contacts.getContacts);
  const addContact = useMutation(api.contacts.addContact);
  const resendInvite = useMutation(api.contacts.resendInvite);
  const deleteContact = useMutation(api.contacts.deleteContact);

  const [email, setEmail] = useState("");

  const handleAddContact = async () => {
    await addContact({ email });
    setEmail("");
  };

  const handleResend = async (email: string) => {
    await resendInvite({ email });
  };
  const handleDelete = async (email: string) => {
    await deleteContact({ email });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Trusted Contacts</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add New Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
              />
            </div>
            <Button onClick={handleAddContact}>Send Invite</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {contacts?.map((contact) => (
          <Card key={contact._id}>
            <CardContent className="flex justify-between items-center p-6">
              <div>
                <p className="font-medium">{contact.contactEmail}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    contact.verificationStatus === "verified"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {contact.verificationStatus}
                </span>
                {contact.verificationStatus !== "verified" && (
                  <Button
                    size="sm"
                    onClick={() => handleResend(contact.contactEmail)}
                  >
                    Resend Invite
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger
                    className={buttonVariants({
                      variant: "destructive",
                      size: "icon",
                    })}
                  >
                    <IconTrash />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this contact.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => handleDelete(contact.contactEmail)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
