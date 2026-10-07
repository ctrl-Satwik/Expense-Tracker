const { Resend } = require("resend");
const { getClientUrl } = require("./clientUrl");

let resendClient = null;

// Created lazily so the server still boots when RESEND_API_KEY is missing
const getResend = () => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured");
    }
    if (!resendClient) {
        resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return resendClient;
};

const escapeHtml = (value = "") =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const sendEmail = async ({ to, subject, html, text }) => {
    if (!process.env.EMAIL_FROM) {
        throw new Error("EMAIL_FROM is not configured");
    }

    const { data, error } = await getResend().emails.send({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
        text,
    });

    if (error) {
        // Only the provider's error name/message - never the API key
        throw new Error(`Email provider error: ${error.name || "unknown"} - ${error.message || ""}`);
    }
    return data;
};

const buildEmail = ({ fullName, intro, buttonText, link, expiryText }) => {
    const name = escapeHtml(fullName || "there");
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
            <h2 style="color: #875cf5;">Expense Tracker</h2>
            <p>Hi ${name},</p>
            <p>${intro}</p>
            <p style="margin: 24px 0;">
                <a href="${link}" style="background: #875cf5; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; display: inline-block;">${buttonText}</a>
            </p>
            <p style="font-size: 13px; color: #6b7280;">Or paste this link into your browser:<br>${link}</p>
            <p style="font-size: 13px; color: #6b7280;">${expiryText} If you didn't request this, you can safely ignore this email.</p>
        </div>
    `;
    const text = `Hi ${fullName || "there"},\n\n${intro}\n\n${link}\n\n${expiryText} If you didn't request this, you can safely ignore this email.`;
    return { html, text };
};

exports.sendVerificationEmail = async (user, rawToken) => {
    const link = `${getClientUrl()}/verify-email/${rawToken}`;
    const { html, text } = buildEmail({
        fullName: user.fullName,
        intro: "Thanks for signing up. Please confirm your email address to activate your account.",
        buttonText: "Verify Email",
        link,
        expiryText: "This link expires in 24 hours.",
    });
    return sendEmail({ to: user.email, subject: "Verify your email - Expense Tracker", html, text });
};

exports.sendPasswordResetEmail = async (user, rawToken) => {
    const link = `${getClientUrl()}/reset-password/${rawToken}`;
    const { html, text } = buildEmail({
        fullName: user.fullName,
        intro: "We received a request to reset your password.",
        buttonText: "Reset Password",
        link,
        expiryText: "This link expires in 10 minutes and can only be used once.",
    });
    return sendEmail({ to: user.email, subject: "Reset your password - Expense Tracker", html, text });
};
