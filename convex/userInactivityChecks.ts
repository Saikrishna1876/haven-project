import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";
import { insertAuditLog } from "./audit";
import { authComponent } from "./auth";

export const createToken = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // Generate a 6-digit numeric token as a string
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    const record = await ctx.db
      .query("user_inactivity_checks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (record) {
      await ctx.db.patch(record._id, {
        token,
      });
    } else {
      await ctx.db.insert("user_inactivity_checks", {
        userId: user._id,
        lastCheckedAt: 0,
        token,
      });
    }

    return token;
  },
});

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

export const fetchRecordByToken = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.token) {
      throw new Error("Invalid token");
    }

    const check = await (
      await ctx.db.query("user_inactivity_checks").collect()
    ).filter((c) => c.token === args.token)[0];

    if (!check) {
      throw new Error("Inactivity check not found");
    }

    const record = await ctx.db
      .query("user_inactivity_checks")
      .withIndex("by_user", (q) => q.eq("userId", check.userId))
      .first();

    return record;
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
    } else {
      await ctx.db.insert("user_inactivity_checks", {
        userId: user._id,
        lastCheckedAt: args.lastCheckedAt,
      });
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

export const handleConfirm = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.token) {
      throw new Error("Invalid token");
    }

    const record = await ctx.runMutation(
      api.userInactivityChecks.fetchRecordByToken,
      {
        token: args.token,
      },
    );

    if (record) {
      await ctx.db.patch(record._id, {
        lastCheckedAt: 0,
      });
      await insertAuditLog(ctx, record.userId, "Inactivity Reset", {});
    }
  },
});

export const handleCancel = action({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.token) {
      throw new Error("Invalid token");
    }

    const record = await ctx.runMutation(
      api.userInactivityChecks.fetchRecordByToken,
      {
        token: args.token,
      },
    );

    if (record) {
      await ctx.runAction(api.rules.triggerDeadManSwitch);
    }
  },
});
