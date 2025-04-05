import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { Users } from "../models/users.model.js";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async ({ email, emailType, userId }) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    // console.log(hashedToken);
    if (emailType === "VERIFY") {
      await Users.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await Users.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    var transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: "neha@sharma.ai",
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <p>Hello,</p>

    <p>You requested to ${
      emailType === "VERIFY" ? "verify your email" : "reset your password"
    }.</p>

    <p>Please click the link below to proceed:</p>

    <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}" 
       style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px;">
       ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
    </a>

    <p style="margin-top: 20px;">Or copy and paste the following token manually:</p>
    
    <code style="display: inline-block; background: #f3f4f6; padding: 8px 12px; border-radius: 5px; font-size: 14px;">
      ${hashedToken}
    </code>

    <p style="margin-top: 20px;">Or visit this full link:</p>

    <p style="color: #2563eb;">${
      process.env.DOMAIN
    }/verifyemail?token=${hashedToken}</p>

    <br />
    <p>Thank you,<br/>The Team</p>
  </div>
`,

      // html body
    };
    const mailResponse = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("error: " + error);
  }
};
