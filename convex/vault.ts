import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const addAsset = mutation({
  args: {
    type: v.string(),
    name: v.string(),
    metadata: v.any(),
    encryptedPayload: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await ctx.db.insert("vault_items", {
      userId: user._id,
      type: args.type,
      name: args.name,
      metadata: args.metadata,
      encryptedPayload: args.encryptedPayload,
      createdAt: Date.now(),
    });

    // Log action
    await ctx.db.insert("audit_logs", {
      userId: user._id,
      action: "Asset Added",
      timestamp: Date.now(),
      details: { assetName: args.name, type: args.type },
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
      details: { assetId: args.id },
    });
  },
});
