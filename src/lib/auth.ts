import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
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

  //? Customize/adding  user fields
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
  //? email and password config
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  //?
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationToken = `${process.env
        .FRONTEND_URL!}/verify-email?token=${token}`;
      const info = await transporter.sendMail({
        from: '"prisma blog" <tomjidhuda04@gmail.com>',
        to: "hudatomjid@gmail.com",
        subject: "hello form blog site",
        text: "hi",
        html: "<b>hello world!</b>",
      });

      console.log("message send:", info.messageId);
    },
  },
});
