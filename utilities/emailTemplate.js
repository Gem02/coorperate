const dotenv = require("dotenv");
dotenv.config();
const { Resend } = require('resend');


const resend = new Resend(process.env.RESEND_API_KEY);

 const welcomeEmail = async({ email, firstName, lastName }) => {
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

const sendForgotPasswordEmail = async ({ email, firstName, lastName, token }) => {
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
    subject: 'Password Reset Code',
    html,
  });
}

module.exports = {welcomeEmail}
