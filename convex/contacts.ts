import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { internal } from "./_generated/api";

export const addContact = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await ctx.runMutation(internal.sendEmail.sendTestEmail, {
      toEmail: args.email,
      subject: "Verify your trusted contact",
      html: `Please verify your trusted contact by clicking <a href="${
        process.env.SITE_URL
      }/verify?email=${encodeURIComponent(args.email)}">here</a>.`,
    });

    await ctx.db.insert("trusted_contacts", {
      userId: user._id,
      contactEmail: args.email,
      verificationStatus: "pending",
    });

    await ctx.db.insert("audit_logs", {
      userId: user._id,
      action: "Contact Added",
      timestamp: Date.now(),
      details: { email: args.email },
    });
  },
});

export const getContacts = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("trusted_contacts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const resendInvite = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // Find the contact for this user
    const contacts = await ctx.db
      .query("trusted_contacts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const contact = contacts.find(
      (c) =>
        (c as unknown as { contactEmail: string }).contactEmail === args.email
    );
    if (!contact) throw new Error("Contact not found");

    // Send the verification email again
    await ctx.runMutation(internal.sendEmail.sendTestEmail, {
      toEmail: args.email,
      subject: "Verify your trusted contact (reminder)",
      html: `Please verify your trusted contact by clicking <a href="${
        process.env.SITE_URL
      }/verify?email=${encodeURIComponent(args.email)}">here</a>.`,
    });

    await ctx.db.insert("audit_logs", {
      userId: user._id,
      action: "Contact Invite Resent",
      timestamp: Date.now(),
      details: { email: args.email },
    });
  },
});

export const verifyContact = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Public endpoint: don't require auth. Find matching contact(s) and mark verified.
    const all = await ctx.db.query("trusted_contacts").collect();
    const contact = all.find(
      (c) =>
        (c as unknown as { contactEmail: string }).contactEmail === args.email
    );
    if (!contact) {
      return { success: false };
    }

    await ctx.db.patch(contact._id, { verificationStatus: "verified" });

    await ctx.db.insert("audit_logs", {
      userId: contact.userId,
      action: "Contact Verified",
      timestamp: Date.now(),
      details: { email: args.email },
    });

    return { success: true };
  },
});

export const deleteContact = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // Find the contact for this user
    const contacts = await ctx.db
      .query("trusted_contacts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const contact = contacts.find(
      (c) =>
        (c as unknown as { contactEmail: string }).contactEmail === args.email
    );
    if (!contact) throw new Error("Contact not found");

    // Delete the contact
    await ctx.db.delete(contact._id);

    await ctx.db.insert("audit_logs", {
      userId: user._id,
      action: "Contact Deleted",
      timestamp: Date.now(),
      details: { email: args.email },
    });
  },
});
