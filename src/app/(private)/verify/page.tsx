"use client";

import { useMutation } from "convex/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";

export default function VerifyPage() {
  const [status, setStatus] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";
  const verifyContact = useMutation(api.contacts.verifyContact);

  useEffect(() => {
    (async () => {
      if (!email) {
        setStatus("missing_email");
        return;
      }
      try {
        const res = (await verifyContact({ email })) as {
          success?: boolean;
        } | null;
        if (res?.success) {
          setStatus("verified");
        } else {
          setStatus("not_found");
        }
      } catch (_err) {
        setStatus("error");
      }
    })();
  }, [email, verifyContact]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-primary/10 shadow rounded p-6 text-center">
        {!status && <p>Verifying...</p>}
        {status === "verified" && (
          <div>
            <h1 className="text-2xl font-bold">Email Verified</h1>
            <p className="mt-2">
              Thank you — the trusted contact has been verified.
            </p>
          </div>
        )}
        {status === "not_found" && (
          <div>
            <h1 className="text-2xl font-bold">Not Found</h1>
            <p className="mt-2">
              We couldn't find a pending invite for that email.
            </p>
          </div>
        )}
        {status === "missing_email" && (
          <div>
            <h1 className="text-2xl font-bold">Missing Email</h1>
            <p className="mt-2">No email provided.</p>
          </div>
        )}
        {status === "error" && (
          <div>
            <h1 className="text-2xl font-bold">Error</h1>
            <p className="mt-2">An error occurred while verifying.</p>
          </div>
        )}
      </div>
    </div>
  );
}
