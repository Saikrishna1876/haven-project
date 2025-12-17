import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { insertAuditLog } from "./audit";
import { authComponent } from "./auth";

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

    await insertAuditLog(ctx, user._id, "Contact Added", { email: args.email });
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

export const getContactById = query({
  args: { contactId: v.id("trusted_contacts") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const contact = await ctx.db.get(args.contactId);
    if (!contact || contact.userId !== user._id) {
      throw new Error("Contact not found");
    }

    return contact;
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
        (c as unknown as { contactEmail: string }).contactEmail === args.email,
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

    await insertAuditLog(ctx, user._id, "Contact Invite Resent", {
      email: args.email,
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
        (c as unknown as { contactEmail: string }).contactEmail === args.email,
    );
    if (!contact) {
      return { success: false };
    }

    await ctx.db.patch(contact._id, { verificationStatus: "verified" });

    await insertAuditLog(ctx, contact.userId, "Contact Verified", {
      email: args.email,
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
        (c as unknown as { contactEmail: string }).contactEmail === args.email,
    );
    if (!contact) throw new Error("Contact not found");

    // Delete the contact
    await ctx.db.delete(contact._id);

    await insertAuditLog(ctx, user._id, "Contact Deleted", {
      email: args.email,
    });
  },
});
