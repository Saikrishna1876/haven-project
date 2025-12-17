"use node";
import { Resend } from "@convex-dev/resend";
import { pretty, render } from "@react-email/render";
import { v } from "convex/values";
import { api, components } from "./_generated/api";
import { action } from "./_generated/server";
import AccountRecoveryEmail from "./emails/googleRecoveryEmail";
import TrustedContactActivityCheck from "./emails/trustedContactActivityCheck";
import UserActivityCheckEmail from "./emails/userActivityCheck";

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
});

export const sendAccountRecoveryEmail = action({
  args: {
    assets: v.array(v.any()),
    contact: v.any(),
    userData: v.any(),
    aggregatedBackupCodes: v.array(v.any()),
    subject: v.string(),
    toEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const {
      assets,
      userData,
      contact,
      aggregatedBackupCodes,
      subject,
      toEmail,
    } = args;
    const html = await pretty(
      await render(
        await AccountRecoveryEmail({
          userId: String(userData._id),
          userData,
          email: userData.email || contact.contactEmail || undefined,
          fullName: userData.name,
          accountCreated: userData.createdAt
            ? new Date(userData.createdAt).toISOString()
            : undefined,
          lastLogin:
            typeof userData.inactive_for_days !== "undefined" &&
            !Number.isNaN(Number(userData.inactive_for_days))
              ? new Date(
                  Date.now() -
                    Number(userData.inactive_for_days) * 24 * 60 * 60 * 1000,
                ).toISOString()
              : undefined,
          phoneNumber: userData.phoneNumber || undefined,
          hasSecurityQuestions: !!userData.hasSecurityQuestions,
          hasTwoFA: !!userData.hasTwoFA,
          backupCodes: aggregatedBackupCodes,
          recoveryLink: `${process.env.SITE_URL}/recover?user=${userData._id}`,
          assets,
        }),
      ),
    );

    // 2. Send your email as usual using the component
    await resend.sendEmail(ctx, {
      from: "Haven <onboarding@resend.dev>",
      to: toEmail,
      subject,
      html,
    });
  },
});

export const sendUserActivityCheckEmail = action({
  args: {
    userData: v.any(),
    subject: v.string(),
    toEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const { userData, subject, toEmail } = args;
    const lastLogin = await ctx.runQuery(
      api.userInactivityChecks.fetchUserInactivityCheck,
    );
    const html = await pretty(
      await render(
        UserActivityCheckEmail({
          userName: userData.name,
          lastActiveDate: lastLogin
            ? `${lastLogin.lastCheckedAt} day(s) ago`
            : "a while",
          companyName: "Haven",
          siteUrl: process.env.SITE_URL as string,
        }),
      ),
    );

    // 2. Send your email as usual using the component
    await resend.sendEmail(ctx, {
      from: "Haven <onboarding@resend.dev>",
      to: toEmail,
      subject,
      html,
    });
  },
});

export const sendTrustedContactActivityCheckEmail = action({
  args: {
    userData: v.any(),
    subject: v.string(),
  },
  handler: async (ctx, args) => {
    const { userData, subject } = args;
    const lastLogin = await ctx.runQuery(
      api.userInactivityChecks.fetchUserInactivityCheck,
    );
    const contacts = await ctx.runQuery(api.contacts.getContacts);
    for (const contact of contacts) {
      const html = await pretty(
        await render(
          TrustedContactActivityCheck({
            contactName: contact.contactEmail,
            userName: userData.name,
            userEmail: userData.email,
            token: "",
            lastActiveDate: lastLogin
              ? `${lastLogin.lastCheckedAt} day(s) ago`
              : "a while",
            inactivityDays: lastLogin?.lastCheckedAt || 0,
            companyName: "Haven",
            siteUrl: process.env.SITE_URL as string,
          }),
        ),
      );

      // 2. Send your email as usual using the component
      await resend.sendEmail(ctx, {
        from: "Haven <onboarding@resend.dev>",
        to: contact.contactEmail,
        subject,
        html,
      });
    }
  },
});
