import type { GenericMutationCtx } from "convex/server";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getLogs = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("audit_logs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
  },
});

// Helper to create an audit log and reset the user's inactivity counter.
export async function insertAuditLog(
  ctx: GenericMutationCtx<any>,
  userId: any,
  action: string,
  details?: any,
) {
  await ctx.db.insert("audit_logs", {
    userId,
    action,
    timestamp: Date.now(),
    details,
  });

  // Try to reset the user's inactive_for_days field to 0. If the user record
  // does not exist or patch fails, swallow the error (non-fatal).
  try {
    await ctx.db.patch(userId, { inactive_for_days: 0 });
  } catch {
    // ignore
  }
}
