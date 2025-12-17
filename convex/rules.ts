import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { api, internal } from "./_generated/api";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AccountRecoveryEmail from "./emails/googleRecoveryEmail";
import { insertAuditLog } from "./audit";

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

export const resetInactivity = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // In a real implementation, this would reset the user's inactivity timer.
    // For the hackathon MVP, we can just log the action.
    console.log(`Resetting inactivity timer for user ${user._id}`);

    // Reset the user's inactive_for_days to 0.
    await ctx.db.patch("users", args.userId, { inactive_for_days: 0 });

    await insertAuditLog(ctx, user._id, "Inactivity Reset", {});
  },
});

export const sendReminders = internalMutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    console.log("Sending reminder emails to users requiring approval...");
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

    await insertAuditLog(ctx, user._id, "Rule Updated", args);
  },
});

export const triggerDeadManSwitch = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // Convert the typed user record into a plain JS object so we can safely access
    // runtime fields without TypeScript complaining about missing properties.
    const userData = JSON.parse(JSON.stringify(user));

    const contacts = await ctx.runQuery(api.contacts.getContacts);

    // Fetch all assets for the user. Use a typed shape to avoid implicit any.
    const assets = await ctx.db
      .query("vault_items")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    if (!assets || assets.length === 0) {
      await insertAuditLog(ctx, user._id, "Dead Man's Switch: No Assets", {
        message: "No assets found to send to contacts",
      });
    } else {
      // Prepare and render provider-specific email template (Google first)
      const aggregatedBackupCodes: string[] = ([] as string[]).concat(
        ...assets.map((a: any) => a.backupCodes || [])
      );

      const subject = `Google Account Recovery Information for ${
        user.name || String(user._id)
      }`;

      for (const contact of contacts) {
        try {
          const html = renderToStaticMarkup(
            React.createElement(AccountRecoveryEmail, {
              userId: String(userData._id),
              userData,
              email: userData.email || contact.contactEmail || undefined,
              fullName: userData.name,
              accountCreated: userData.createdAt
                ? new Date(userData.createdAt).toISOString()
                : undefined,
              lastLogin:
                (userData.lastLogin &&
                  new Date(userData.lastLogin).toISOString()) ||
                undefined,
              phoneNumber: userData.phoneNumber || undefined,
              hasSecurityQuestions: !!userData.hasSecurityQuestions,
              hasTwoFA: !!userData.hasTwoFA,
              backupCodes: aggregatedBackupCodes,
              recoveryLink: `${process.env.SITE_URL}/recover?user=${userData._id}`,
              assets,
            })
          );

          await ctx.runMutation(internal.sendEmail.sendTestEmail, {
            toEmail: contact.contactEmail,
            subject,
            html,
          });
        } catch (err) {
          await insertAuditLog(
            ctx,
            user._id,
            "Dead Man's Switch: Send Failed",
            {
              contactId: contact._id,
              error: String(err),
            }
          );
        }
      }
    }

    // 1. Log the trigger
    await insertAuditLog(ctx, user._id, "Dead Man's Switch TRIGGERED", {
      reason: "Manual Demo Trigger",
    });

    // 2. Simulate sending package
    await insertAuditLog(ctx, user._id, "Recovery Package Sent", {
      recipient: "Executors",
      method: "Email",
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
