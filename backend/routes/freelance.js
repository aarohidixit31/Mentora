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
     .populate("bids.freelancer", "name email")
    .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch {
    res.status(500).json({ success: false });
  }
});

/* ================= SUBMIT BID/PROPOSAL ================= */
router.post("/:projectId/bid", auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { bidAmount, timeline, coverLetter, portfolioLinks } = req.body;

    // Validate required fields
    if (!bidAmount || !timeline || !coverLetter) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: bidAmount, timeline, coverLetter",
      });
    }

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if freelancer already bid on this project
    const existingBid = project.bids.find(
      (b) => b.freelancer.toString() === req.user.userId
    );
    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a proposal for this project",
      });
    }

    // Create and add the bid
    const bid = {
      freelancer: req.user.userId,
      bidAmount: Number(bidAmount),
      timeline,
      coverLetter,
      portfolioLinks: portfolioLinks || [],
      submittedAt: new Date(),
    };

    project.bids.push(bid);
    project.proposalsCount = project.bids.length;

    const updatedProject = await project.save();

    res.status(201).json({
      success: true,
      message: "Proposal submitted successfully",
      project: updatedProject,
    });
  } catch (err) {
    console.error("Submit bid error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit proposal",
    });
  }
});

export default router;
