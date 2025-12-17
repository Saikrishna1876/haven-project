import { v } from "convex/values";
import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { insertAuditLog } from "./audit";
import { authComponent } from "./auth";

export const createInactivityCheck = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const existingRecord = await ctx.db
      .query("user_inactivity_checks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!existingRecord) {
      await ctx.db.insert("user_inactivity_checks", {
        userId: user._id,
        lastCheckedAt: 0,
      });
    }
  },
});

export const updateInactivity = mutation({
  args: { lastCheckedAt: v.number() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const record = await ctx.db
      .query("user_inactivity_checks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (record) {
      await ctx.db.patch(record._id, {
        lastCheckedAt: args.lastCheckedAt,
      });
      await insertAuditLog(ctx, user._id, "Inactivity Reset", {});
    }
  },
});

export const resetInactivity = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    await ctx.runMutation(api.userInactivityChecks.updateInactivity, {
      lastCheckedAt: 0,
    });

    await insertAuditLog(ctx, user._id, "Inactivity Reset", {});
  },
});

export const fetchUserInactivityCheck = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const record = await ctx.db
      .query("user_inactivity_checks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    return record;
  },
});
