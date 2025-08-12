import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path'
dotenv.config({path:path.resolve("src/config/.env")})


const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: to || 'mahmoudtarekk236@gmail.com',
      subject: subject || 'Hello World',
      html: html || '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });

    if (error) {
      console.error('SendGrid error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return false;
  }
};
