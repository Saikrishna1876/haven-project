import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    publicKey: v.optional(v.string()),
    authUserId: v.optional(v.string()), // Link to better-auth user ID
  })
    .index("by_email", ["email"])
    .index("by_auth_user_id", ["authUserId"]),

  vault_items: defineTable({
    userId: v.string(), // Link to our users table or auth user id. Let's use authUserId for simplicity in queries if we have it, or our user ID.
    // Let's use the ID from our `users` table if we want relational integrity, or just string if we want flexibility.
    // Given the guide, let's use string to store the User ID (likely the one from this schema or auth).
    // I'll use the ID from the `users` table in this schema for better relational modeling if I was using v.id(),
    // but since I might query by auth ID, let's stick to string and store the authUserId.
    // Actually, let's just use the `users` table ID.
    // But wait, the guide implies `users` table IS the user table.
    // Let's assume `userId` refers to the `users` document ID in this schema.
    // But for simplicity with `better-auth`, I'll store `authUserId` in `users` and use `users._id` for relations?
    // Or just use `authUserId` everywhere?
    // Let's use `userId` as a string which holds the `better-auth` user ID. This is the most robust way to link without syncing issues.
    // So `users` table is just for extra profile data (publicKey).
    // And `vault_items` links to `userId` (auth id).
    type: v.string(),
    name: v.string(),
    metadata: v.any(),
    encryptedPayload: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  trusted_contacts: defineTable({
    userId: v.string(),
    contactEmail: v.string(),
    verificationStatus: v.union(v.literal("pending"), v.literal("verified")),
  }).index("by_user", ["userId"]),

  rules: defineTable({
    userId: v.string(),
    inactivityDuration: v.number(),
    approvalRequired: v.boolean(),
    conditions: v.optional(v.any()),
  }).index("by_user", ["userId"]),

  audit_logs: defineTable({
    userId: v.string(),
    action: v.string(),
    timestamp: v.number(),
    details: v.optional(v.any()),
  }).index("by_user", ["userId"]),
});
