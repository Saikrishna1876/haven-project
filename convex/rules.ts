import { v } from "convex/values";
import { decryptData } from "../src/lib/encryption";
import { api } from "./_generated/api";
import { action, internalAction, mutation, query } from "./_generated/server";
import { insertAuditLog } from "./audit";
import { authComponent } from "./auth";
import type { Asset } from "./vault";

export const checkInactivity = internalAction({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.runQuery(authComponent.component.adapter.findMany, {
      model: "user",
      paginationOpts: {
        cursor: null,
        numItems: 100,
      },
    });
    console.log(users);
    for (const user of users.page) {
      const res = await ctx.runQuery(
        api.userInactivityChecks.fetchUserInactivityCheckByUser,
        { user },
      );
      const rule = await ctx.runQuery(api.rules.getRuleByUser, { user });
      console.log("Inactivity record:", res);
      if (res) {
        if (res.lastCheckedAt === 14) {
          await ctx.runAction(api.reactEmail.sendUserActivityCheckEmail, {
            userData: user,
            subject: "Are you still there?",
            toEmail: user.email,
          });
        } else if (res.lastCheckedAt === 17) {
          const token = await ctx.runMutation(
            api.userInactivityChecks.createToken,
            { user },
          );
          await ctx.runAction(
            api.reactEmail.sendTrustedContactActivityCheckEmail,
            {
              userData: user,
              subject: "User Inactivity Alert",
              token,
            },
          );
        } else {
          if (rule && rule.inactivityDuration === res.lastCheckedAt) {
            await ctx.runAction(api.rules.deadManSwitchByUser, { user });
          }
        }

        await ctx.runMutation(api.userInactivityChecks.updateInactivityByUser, {
          user,
          lastCheckedAt: res.lastCheckedAt + 1,
        });
      } else {
        await ctx.runMutation(api.userInactivityChecks.updateInactivityByUser, {
          user,
          lastCheckedAt: 0,
        });
        console.log("No inactivity check record found for user.");
      }
    }
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

export const deadManSwitchByUser = action({
  args: {
    user: v.any(),
  },
  handler: async (ctx, args) => {
    const user = args.user;

    const userData = JSON.parse(JSON.stringify(user));

    const contacts = await ctx.runQuery(api.contacts.getContacts);

    const assets = await ctx.runQuery(api.vault.getAssets);

    if (!assets || assets.length === 0) {
      await ctx.runMutation(api.audit.insertAuditLogMutation, {
        action: "Dead Man's Switch: No Assets",
        details: {
          message: "No assets found to send to contacts",
        },
      });
    } else {
      // Prepare and render provider-specific email template (Google first)
      const aggregatedBackupCodes: object[] = assets.map(
        (a: Asset) =>
          decryptData(a.encryptedPayload, a.encryptedPayload.split("_")[1])
            .recoveryMethods.twoFactorBackups[0],
      );

      const subject = `Google Account Recovery Information for ${
        user.name || String(user._id)
      }`;

      for (const contact of contacts) {
        try {
          await ctx.runAction(api.reactEmail.sendAccountRecoveryEmail, {
            assets,
            contact,
            userData,
            aggregatedBackupCodes,
            subject,
            toEmail: contact.contactEmail,
          });
        } catch (err) {
          await ctx.runMutation(api.audit.insertAuditLogMutation, {
            action: "Dead Man's Switch: Send Failed",
            details: {
              contactId: contact._id,
              error: String(err),
            },
          });
        }
      }
    }
  },
});
export const triggerDeadManSwitch = action({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");
    await ctx.runAction(api.rules.deadManSwitchByUser, { user });
  },
});

export const getRuleByUser = query({
  args: {
    user: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rules")
      .withIndex("by_user", (q) => q.eq("userId", args.user._id))
      .first();
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
