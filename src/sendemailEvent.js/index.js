import eventEmitter from "events";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/sendEmail.js";

export const EventEmitter = new eventEmitter();

EventEmitter.on("sendemail", async (data) => {
  try {
    const { email, name } = data;

    const token = jwt.sign(
      { email },
      process.env.SEND_EMAILTOKEN,
      { expiresIn: "3h" } 
    );

    const link = `${process.env.BASE_URL}/users/confirmed/${token}`;

    const isSend = await sendEmail(
      email,
      "Please Confirm Your Email",
      `
      <p>Hello ${name},</p>
      <p>Click the link below to confirm your email:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 3 minutes.</p>
      `
    );

    if (!isSend) {
      console.error(" Failed to send confirmation email to:", email);
      
    }
  } catch (error) {
    console.error(" Error in sendemail event:", error.message);
  }
});


EventEmitter.on("forgetpassword", async (data) => {
  try {
    const { email, otp, name } = data;

    const isSend = await sendEmail(
      email,
      "Reset Your Password Code",
      `
      <p>Hello ${name},</p>
      <h1>Please don't share your code:</h1>
      <h3>Your reset code is: <strong>${otp}</strong></h3>
      <h4>60 sec the code will expire </h4>
      `
    );

    if (!isSend) {
      console.error("❌ Failed to send code to:", email);
    }
  } catch (error) {
    console.error("❌ Error in forgetpassword event:", error.message);
  }
});
