import nodemailer from "nodemailer";

// Direct import of environment variables from .env file
const EMAIL_USER = "info@ybtcuk.com";
const EMAIL_PASS = "YBTC@uk123";
const EMAIL_RECEIVER = "info@ybtcuk.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    fullName, phone, orgName, companySize,
    industry, timeline, contactMethod, message
  } = req.body;

  if (!fullName || !phone || !message) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_RECEIVER || EMAIL_USER,
      subject: `New Consultation Request from ${fullName}`,
      text: `
📩 New Consultation Request

Full Name: ${fullName}
Phone: ${phone}
Organization: ${orgName}
Company Size: ${companySize}
Industry: ${industry}
Timeline: ${timeline}
Preferred Contact Method: ${contactMethod}

Message:
${message}
      `,
    });

    return res.status(200).json({ message: "Your consultation request has been sent!" });
  } catch (err) {
    console.error("Error sending mail:", err);
    return res.status(500).json({ message: "Failed to send email." });
  }
}
