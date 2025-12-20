

import express from "express";
import Session from "../models/Session.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { google } from "googleapis";

const router = express.Router();

/* =====================================================
   GET ALL SESSIONS
===================================================== */
router.get("/", auth, async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("mentor", "name avatar")
      .sort({ date: 1 });

    res.json({ success: true, sessions });
  } catch (err) {
    console.error("GET sessions error:", err);
    res.status(500).json({ success: false });
  }
});

/* =====================================================
   GET MY SESSIONS (TUTOR)
===================================================== */
router.get("/my", auth, async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        success: false,
        message: "Only tutors can view their sessions",
      });
    }

    const sessions = await Session.find({
      mentor: req.user.userId,
    }).sort({ date: 1 });

    res.json({ success: true, sessions });
  } catch (err) {
    console.error("GET my sessions error:", err);
    res.status(500).json({ success: false });
  }
});

/* =====================================================
   CREATE SESSION + GOOGLE MEET
===================================================== */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        success: false,
        message: "Only tutors can create sessions",
      });
    }

    const mentor = await User.findById(req.user.userId);

    if (!mentor?.google?.accessToken) {
      return res.status(400).json({
        success: false,
        message: "Connect Google account to create Meet link",
      });
    }

    const { date, time, duration, topic, notes, price } = req.body;

    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    /* =======================
       GOOGLE CALENDAR CLIENT
    ======================= */
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: mentor.google.accessToken,
      refresh_token: mentor.google.refreshToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    /* =======================
       CREATE CALENDAR EVENT
    ======================= */
    const event = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: topic,
        description: notes,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
          },
        },
      },
    });

    const meetLink =
      event.data.conferenceData?.entryPoints?.find(
        (e) => e.entryPointType === "video"
      )?.uri;

    /* =======================
       SAVE SESSION
    ======================= */
    const session = await Session.create({
      mentor: mentor._id,
      date: startTime,
      duration,
      topic,
      notes,
      price,
      meetLink,
      googleEventId: event.data.id,
    });

    res.json({ success: true, session });
  } catch (err) {
    console.error("CREATE SESSION ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create session",
    });
  }
});

export default router;
