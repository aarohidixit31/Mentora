
import express from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/**
 * STEP 1: Generate Google OAuth URL
 * GET /api/google/connect
 */
router.get("/connect", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // 🔑 Encode user identity into state
    const state = jwt.sign(
      { userId: jwt.decode(token).userId },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/calendar"],
      state, // ✅ CRITICAL
    });

    return res.json({ success: true, url });
  } catch (err) {
    console.error("GOOGLE CONNECT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Google connect failed",
    });
  }
});

/**
 * STEP 2: Google OAuth callback
 * GET /api/google/callback
 */
router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.redirect("http://localhost:3000/sessions?google=error");
    }

    // 🔐 Recover userId from state
    const decodedState = jwt.verify(state, process.env.JWT_SECRET);
    const userId = decodedState.userId;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    const user = await User.findById(userId);
    if (!user) {
      return res.redirect("http://localhost:3000/sessions?google=error");
    }

    // ✅ SAVE TOKENS CORRECTLY
    user.google = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    };

    await user.save();

    return res.redirect(
      "http://localhost:3000/sessions?google=connected"
    );
  } catch (err) {
    console.error("GOOGLE CALLBACK ERROR:", err);
    return res.redirect(
      "http://localhost:3000/sessions?google=error"
    );
  }
});

export default router;
