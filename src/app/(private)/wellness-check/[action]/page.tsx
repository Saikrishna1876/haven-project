"use client";

import { useAction, useMutation } from "convex/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../../../convex/_generated/api";

export default function WellnessCheckPage() {
  const { action } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const confirm = useMutation(api.userInactivityChecks.handleConfirm);
  const cancel = useAction(api.userInactivityChecks.handleCancel);
  const [isMounted, setIsMounted] = useState(false);

  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    (async () => {
      if (!action) return;
      if (!token) {
        setStatus("missing_token");
        return;
      }

      setStatus(null);
      try {
        if (action === "confirm") {
          const res = await confirm({ token });
          if (res?.success) setStatus("confirmed");
          else setStatus("not_found");
        } else if (action === "concern") {
          const res = await cancel({ token });
          if (res?.success) setStatus("cancelled");
          else setStatus("not_found");
        } else {
          setStatus("invalid_action");
        }
      } catch (_err) {
        setStatus("error");
      }
    })();
  }, [action, token, confirm, cancel]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-primary/10 shadow rounded p-6 text-center">
        {!status && <p>Processing...</p>}

        {status === "confirmed" && (
          <div>
            <h1 className="text-2xl font-bold">Wellness Confirmed</h1>
            <p className="mt-2">
              Thank you — your wellness check has been recorded.
            </p>
          </div>
        )}

        {status === "cancelled" && (
          <div>
            <h1 className="text-2xl font-bold">Wellness Cancelled</h1>
            <p className="mt-2">
              You will receive the account recovery details soon.
            </p>
          </div>
        )}

        {status === "not_found" && (
          <div>
            <h1 className="text-2xl font-bold">Invalid or Expired Token</h1>
            <p className="mt-2">We couldn't verify this token.</p>
          </div>
        )}

        {status === "missing_token" && (
          <div>
            <h1 className="text-2xl font-bold">Missing Token</h1>
            <p className="mt-2">No token provided.</p>
          </div>
        )}

        {status === "invalid_action" && (
          <div>
            <h1 className="text-2xl font-bold">Invalid Action</h1>
            <p className="mt-2">Unknown action.</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <h1 className="text-2xl font-bold">Error</h1>
            <p className="mt-2">
              An error occurred while processing your request.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
