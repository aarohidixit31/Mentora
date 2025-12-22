import express from "express";
import Project from "../models/Projects.js"; // ✅ adjust if filename differs
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* ================= POST PROJECT ================= */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({
        success: false,
        message: "Only freelancers can post projects",
      });
    }

    const { title, description, budget, timeline, skills, category } = req.body;

    const project = await Project.create({
      title,
      description,
      budget,
      timeline,
      skills,
      category,
      postedBy: req.user.userId, // ✅ FIXED
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (err) {
    console.error("Post project error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to post project",
    });
  }
});

/* ================= GET PROJECTS ================= */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// GET projects where current freelancer has bid
router.get("/my-proposals", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      "bids.freelancer": req.user.userId,
    })
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.get("/my-projects", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      postedBy: req.user.userId,
    })
     .populate("postedBy", "name") 
    .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch {
    res.status(500).json({ success: false });
  }
});


export default router;
