import express from "express";
import Doubt from "../models/Doubts.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* ===================== GET ALL DOUBTS ===================== */
router.get("/", auth, async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate("askedBy", "name role")
      .populate("answers.answeredBy", "name role") // ✅ THIS IS THE KEY
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      doubts,
    });
  } catch (err) {
    console.error("GET DOUBTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load doubts",
    });
  }
});


/* ===================== POST DOUBT ===================== */
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const doubt = await Doubt.create({
      title,
      content,
      tags: tags || [],
      askedBy: req.user.userId, // ✅ FIX IS HERE
    });

    res.status(201).json({
      success: true,
      doubt,
    });
  } catch (err) {
    console.error("POST DOUBT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to post doubt",
    });
  }
});

export default router;
