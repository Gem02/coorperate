import dotenv from "dotenv";
dotenv.config();
import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);

export async function welcomeEmail({ email, firstName, lastName }) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
        <h2 style="color: #333;">Welcome to Ay Developers, ${firstName} ${lastName}!</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          We're excited to have you on board. We’re committed to helping you .
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          You can now log in to your account, explore our services, and take the first step.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you have any questions or need assistance, our support team is always here to help.
        </p>
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
          Welcome once again,<br/>
          The Ay Developers Team
        </p>
      </div>
    </div>
  `;

  return await resend.emails.send({
    from: 'Ay Concept <support@aydevelopers.com.ng>',
    to: email,
    subject: 'Welcome to Ay Developers!',
    html,
  });
}


export const sendEmail2 = async () => {
  try {
  await resend.emails.send({
    from: 'Ay Developers <support@aydevelopers.com.ng>',
    to: ['mangaigodwin@gmail.com'],
    subject: 'hello world',
    html: '<p>it works!</p>',
  });
  console.log(
    "sent"
  )
  } catch (error) {
    console.log(error)
  }
}

 async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: 'support@frugalvest.com.ng', // your verified domain sender
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (err) {
    console.error('Email sending failed:', err.message);
    return false;
  }
} 

 export async function sendWelcomeEmail({ email, firstName, lastName, compoundingNumber, verificationLink }) {
  const fullName = `${firstName} ${lastName}`;
  const html = `
    <div style="background-color: #f5f7fb; padding: 40px 0; font-family: 'Segoe UI', Roboto, sans-serif; color: #333;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
        <div style="background-color: #0046d4; padding: 24px 32px;">
          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to FrugalVest 🎉</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
            Hi <strong>${fullName}</strong>,
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Thank you for joining <strong>FrugalVest</strong>. We're excited to help you grow your wealth through our compounding investment system.
          </p>
          <div style="padding: 16px; background-color: #f0f4ff; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 16px; color: #0046d4;">Your Compounding Number:</p>
            <h2 style="margin: 8px 0 0; font-size: 20px; color: #222;">${compoundingNumber}</h2>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">
            Please confirm your email address to activate your account.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationLink}" 
              style="background-color: #0046d4; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
              Verify My Email
            </a>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 0;">
            <strong>Note:</strong> This verification link will expire in <strong>24 hours</strong>. If it expires, you'll need to request a new one.
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 32px;">
            If you didn’t create this account, you can safely ignore this message.
          </p>
        </div>
        <div style="background-color: #f8f9fb; padding: 20px 32px; text-align: center;">
          <p style="font-size: 13px; color: #999;">
            &copy; ${new Date().getFullYear()} FrugalVest. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: 'Welcome to FrugalVest!',
    html,
  });
} 

export async function sendForgotPasswordEmail({ email, firstName, lastName, token }) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
        <h2 style="color: #333;">Hello ${firstName} ${lastName},</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          We received a request to reset the password for your FrugalVest account.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Use the code below to reset your password. This code is valid for <strong>10 minutes</strong>.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background-color: #dc3545; color: #ffffff; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; letter-spacing: 4px;">
            ${token}
          </div>
        </div>
        <p style="font-size: 14px; color: #777;">
          If you did not request a password reset, you can safely ignore this email — your account will remain secure.
        </p>
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
          Thank you,<br/>
          The FrugalVest Team
        </p>
      </div>
    </div>
  `;

  return await resend.emails.send({
    from: 'Ay Concept <support@aydevelopers.com.ng>',
    to: email,
    subject: 'Your FrugalVest Password Reset Code',
    html,
  });
}


