"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

function Client() {
  return (
    <Button
      onClick={async () => {
        await authClient.signOut();
      }}
    >
      Sign out
    </Button>
  );
}

export default Client;
