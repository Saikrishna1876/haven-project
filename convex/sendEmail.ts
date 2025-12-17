import { Resend } from "@convex-dev/resend";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
});

export const sendTestEmail = internalMutation({
  args: {
    toEmail: v.string(),
    subject: v.string(),
    html: v.string(),
    // optional attachments (we'll render links to them in the email body)
    attachments: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    // If attachments were provided, append a small list of links to the HTML body.
    let html = args.html;
    if (args.attachments && args.attachments.length > 0) {
      const attachmentsHtml = `<h3>Attachments</h3><ul>${args.attachments
        .map(
          (a: any) => `
          <li>${a.name || "unnamed"}${
            a.url ? ` - <a href="${a.url}">link</a>` : ""
          }</li>
        `
        )
        .join("")}</ul>`;
      html = `${html}${attachmentsHtml}`;
    }

    await resend.sendEmail(ctx, {
      from: "Me <onboarding@resend.dev>",
      to: args.toEmail,
      subject: args.subject,
      html,
    });
  },
});
