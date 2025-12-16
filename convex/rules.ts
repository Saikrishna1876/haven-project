import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const checkInactivity = internalMutation({
  args: {},
  handler: async () => {
    // This is where the logic to check for inactive users would go.
    // For a hackathon MVP, we can just log that the check ran.
    // In a real implementation, we would:
    // 1. Query all users/rules
    // 2. Compare last login time (from auth) with inactivityDuration
    // 3. Trigger email/process for those who exceeded the duration
    console.log("Checking for inactive users...");
  },
});

export const setRule = mutation({
  args: {
    inactivityDuration: v.number(),
    approvalRequired: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const existingRule = await ctx.db
      .query("rules")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (existingRule) {
      await ctx.db.patch(existingRule._id, {
        inactivityDuration: args.inactivityDuration,
        approvalRequired: args.approvalRequired,
      });
    } else {
      await ctx.db.insert("rules", {
        userId: user._id,
        inactivityDuration: args.inactivityDuration,
        approvalRequired: args.approvalRequired,
      });
    }

    await ctx.db.insert("audit_logs", {
      userId: user._id,
      action: "Rule Updated",
      timestamp: Date.now(),
      details: args,
    });
  },
});

export const triggerDeadManSwitch = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // 1. Log the trigger
    await ctx.db.insert("audit_logs", {
      userId: user._id,
      action: "Dead Man's Switch TRIGGERED",
      timestamp: Date.now(),
      details: { reason: "Manual Demo Trigger" },
    });

    // 2. Simulate sending package
    await ctx.db.insert("audit_logs", {
      userId: user._id,
      action: "Recovery Package Sent",
      timestamp: Date.now() + 1000,
      details: { recipient: "Executors", method: "Email" },
    });
  },
});

export const getRule = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("rules")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
  },
});
