import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_NAME,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.FRONTEND_URL!],

  //? Customize/adding user fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  //? Email and password config
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  //? Email verification config with nodemailer
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env
          .FRONTEND_URL!}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
          from: '"Prisma Blog" <tomjidhuda04@gmail.com>',
          to: user.email,
          subject: "Please verify your email for Prisma Blog",
          html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #000000; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Prisma Blog</h1>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px; color: #333333;">
            <h2 style="margin-top: 0; color: #111111;">Hello${
              user.name ? ", " + user.name : ""
            }!</h2>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                Thank you for signing up. To complete your registration and access your account, please verify your email address by clicking the button below.
            </p>
            
            <!-- Call to Action Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background-color: #000000; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">
                    Verify Email Address
                </a>
            </div>

            <p style="font-size: 14px; color: #666666; margin-top: 24px;">
                If the button above doesn't work, verify by clicking the link below:<br>
                <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
            </p>

            <p style="font-size: 14px; color: #666666; margin-top: 24px;">
                If you didn't create an account, you can safely ignore this email.
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Prisma Blog. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
          `,
        });

        console.log("Message sent:", info.messageId);
      } catch (error: any) {
        console.error("Email sending failed:", error.message);
        throw error;
      }
    },
  },

  //? OAuth config for Google login
  //! for the login it need to be done in frontend side also
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
