import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "AI route is working!" });
});

// POST /ai/generate
router.post("/generate", async (req, res) => {
  const { text } = req.body;

  console.log("Received text:", text); // <-- Add this line

  if (!text) return res.status(400).json({ error: "Text is required" });

  // ... rest of the code
});

export default router;
