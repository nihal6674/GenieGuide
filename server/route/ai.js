import express from "express";
import axios from "axios";
import { GoogleAuth } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/generate", async (req, res) => {
  const { text } = req.body;

  console.log("Received text:", text);

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    // Authenticate using service account
    const auth = new GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
  scopes: "https://www.googleapis.com/auth/cloud-platform",
});

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    // Call Gemini API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateText",
      {
        prompt: text,
        max_output_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data.candidates?.[0]?.content || "";
    res.json({ result });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate response from Gemini" });
  }
});

export default router;
