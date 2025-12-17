import type { GenericMutationCtx } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
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
  userId: string,
  action: string,
  details?: object,
) {
  await ctx.db.insert("audit_logs", {
    userId,
    action,
    timestamp: Date.now(),
    details,
  });
}

export const insertAuditLogMutation = mutation({
  args: {
    action: v.string(),
    details: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await insertAuditLog(ctx, user._id, args.action, args.details);
  },
});
