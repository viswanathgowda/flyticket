const nodeMailer = require("nodemailer");
const logger = require("../logger");
require("dotenv").config();

const sendEmail = async ({ from, to, subject, text }) => {
  // Create transporter with SMTP service details
  const appPassword = process.env.MAIL_PASSWORD;
  const appMailId = process.env.MAIL;

  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com", // e.g., smtp.gmail.com
    port: 587, // or 465 for SSL
    secure: false, // true for port 465, false for other ports
    auth: {
      user: appMailId,
      pass: appPassword,
    },
  });

  // Email options
  let mailOptions = {
    from, // sender address
    to, // recipient email from request body
    subject, // subject line
    text, // plain text body
    // html: "<b>Hello world?</b>", // if you want HTML body
  };
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info);
    return { emailInfo: info, message: "Email sent successfully" };
  } catch (err) {
    console.error("failed in sending email", err);
    logger.error("failed in sending email", { error: err });
  }
};

module.exports = { sendEmail };
