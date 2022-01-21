import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
import { adjustHtml, removeCosmetics } from "./../helpers/html-cosmetics.js";

dotenv.config();

const OAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

OAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const sendEmail = async (to, subject, text) => {
  const accessToken = await OAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_SENDER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  const mailOptions = {
    from: `RomeDAO Update <${process.env.EMAIL_SENDER}>`,
    bcc: to,
    subject: removeCosmetics(subject),
    text: removeCosmetics(text),
    html: `<p>${adjustHtml(text)}</p>`,
  };
  const res = await transport.sendMail(mailOptions);
  return res;
};

export { sendEmail };
