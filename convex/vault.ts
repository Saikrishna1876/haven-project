import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const addAsset = mutation({
  args: {
    provider: v.string(),
    providerAccountId: v.optional(v.string()),
    name: v.string(),
    metadata: v.optional(v.any()),
    recoveryMethods: v.optional(v.any()),
    encryptedPayload: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await ctx.db.insert("vault_items", {
      userId: user._id,
      provider: args.provider,
      providerAccountId: args.providerAccountId,
      name: args.name,
      metadata: args.metadata,
      recoveryMethods: args.recoveryMethods,
      encryptedPayload: args.encryptedPayload,
      createdAt: Date.now(),
      recoveryStatus: "unverified",
    });

    // Log action
    await ctx.db.insert("audit_logs", {
      userId: user._id,
      action: "Asset Added",
      timestamp: Date.now(),
      details: { assetName: args.name, provider: args.provider },
    });
  },
});

export const updateAsset = mutation({
  args: {
    id: v.id("vault_items"),
    name: v.optional(v.string()),
    metadata: v.optional(v.any()),
    encryptedPayload: v.optional(v.string()),
    recoveryMethods: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const asset = await ctx.db.get(args.id);
    if (!asset || asset.userId !== user._id) {
      throw new Error("Asset not found or unauthorized");
    }

    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.metadata !== undefined) updates.metadata = args.metadata;
    if (args.encryptedPayload !== undefined)
      updates.encryptedPayload = args.encryptedPayload;
    if (args.recoveryMethods !== undefined)
      updates.recoveryMethods = args.recoveryMethods;

    await ctx.db.patch(args.id, updates);

    // Log action
    await ctx.db.insert("audit_logs", {
      userId: user._id,
      action: "Asset Updated",
      timestamp: Date.now(),
      details: { assetId: args.id, updates },
    });
  },
});

export const getAssets = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("vault_items")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const deleteAsset = mutation({
  args: { id: v.id("vault_items") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const asset = await ctx.db.get(args.id);
    if (!asset || asset.userId !== user._id) {
      throw new Error("Asset not found or unauthorized");
    }

    await ctx.db.delete(args.id);

    await ctx.db.insert("audit_logs", {
      userId: user._id,
      action: "Asset Deleted",
      timestamp: Date.now(),
      details: { assetId: args.id, provider: asset.provider },
    });
  },
});
