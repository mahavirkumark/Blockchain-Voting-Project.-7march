require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OTP_STORE = {}; // Store OTP temporarily

// ✅ Send OTP via Fast2SMS
app.post("/send-otp", async (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length !== 10) {
        return res.status(400).json({ error: "Invalid phone number" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    OTP_STORE[phone] = otp; // Store OTP for verification

    try {
        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                route: "otp",
                message: `Your OTP is ${otp}`,
                language: "english",
                numbers: phone
            },
            {
                headers: {
                    authorization: process.env.FAST2SMS_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

// ✅ Verify OTP
app.post("/verify-otp", (req, res) => {
    const { phone, otp } = req.body;
    if (OTP_STORE[phone] && OTP_STORE[phone] == otp) {
        delete OTP_STORE[phone]; // Remove OTP after verification
        res.json({ success: true, message: "OTP Verified!" });
    } else {
        res.status(400).json({ error: "Invalid OTP" });
    }
});

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
