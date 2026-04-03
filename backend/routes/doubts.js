import express from "express";
import Doubt from "../models/Doubts.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate("askedBy", "name role")
      .populate("answers.answeredBy", "name role")
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
      askedBy: req.user.userId,
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


router.post("/:id/answer", auth, async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        success: false,
        message: "Only tutors can answer doubts",
      });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Answer content is required",
      });
    }

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }

    doubt.answers.push({
      content,
      answeredBy: req.user.userId,
    });

    await doubt.save();

    res.status(201).json({
      success: true,
      message: "Answer posted successfully",
    });
  } catch (err) {
    console.error("POST ANSWER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to post answer",
    });
  }
});

export default router;
