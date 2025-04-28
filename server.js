require('dotenv').config();  // Load environment variables from .env
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

// Allow only your frontend domain for CORS
app.use(cors({
  origin: "https://ybtcuk.com",   // Update this if frontend domain changes
}));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server is running! Use POST /send-consultation to submit the form.");
});

app.post("/send-consultation", async (req, res) => {
  try {
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
        user: process.env.EMAIL_USER,   // From .env file
        pass: process.env.EMAIL_PASS,   // From .env file
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER, // receiver email
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
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Your consultation request has been sent!" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// Port from environment, fallback 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
