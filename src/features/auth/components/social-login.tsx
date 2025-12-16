"use client";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SocialLogin() {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={async () =>
        await authClient.signIn.social({
          provider: "google",
        })
      }
    >
      <IconBrandGoogleFilled />
      Continue with Google
    </Button>
  );
}
