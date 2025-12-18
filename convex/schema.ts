import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user_inactivity_checks: defineTable({
    userId: v.string(),
    lastCheckedAt: v.number(),
    token: v.optional(v.string()),
  }).index("by_user", ["userId"]),
  vault_items: defineTable({
    userId: v.string(), // Link to our users table or auth user id.
    // Provider info to support accounts from Google, Microsoft, Apple, etc.
    provider: v.string(), // e.g. 'google', 'microsoft', 'apple', 'custom'
    providerAccountId: v.optional(v.string()), // account id / identifier on the provider side

    // Human-friendly name for the vault entry (email account, service name, etc.)
    name: v.string(),

    // Provider- or entry-specific metadata (e.g. last sign-in IP, creation date on provider, scopes)
    metadata: v.optional(v.any()),

    // Encrypted blob containing secrets / credentials for the vault item
    encryptedPayload: v.string(),

    // When this vault item was created in our system
    createdAt: v.number(),

    // Generalized recovery information — use a structured object here so the UI and server logic
    // can understand available recovery factors for the provider. Examples of keys this object
    // can contain: recoveryPhone, recoveryEmail, backupCodes (stored elsewhere encrypted),
    // authAppRegistered, securityKeys, trustedDeviceSignals, lastKnownDeviceInfo, deletedAtOnProvider,
    // appealTicket, etc.
    // Keep it as `any` to allow provider-specific shapes while remaining typed in runtime code.
    recoveryMethods: v.optional(v.any()),

    // Convenience fields for status tracking and auditing
    recoveryStatus: v.optional(
      v.union(
        v.literal("healthy"),
        v.literal("at_risk"),
        v.literal("unverified"),
      ),
    ),
    lastRecoveryAttemptAt: v.optional(v.number()),
    lastVerifiedAt: v.optional(v.number()),
    isDeleted: v.optional(v.boolean()),
  })
    .index("by_user", ["userId"])
    .index("by_provider", ["provider"]),

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
