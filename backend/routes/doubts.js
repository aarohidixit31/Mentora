import express from "express";
import Doubt from "../models/Doubts.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/doubts
 * @desc    Create a new doubt (Student only)
 * @access  Private
 */
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const doubt = await Doubt.create({
      title,
      content,
      tags,
      askedBy: req.userDoc._id,
      role: req.userDoc.role,
      answers: [],
    });

    res.status(201).json({
      success: true,
      doubt,
    });
  } catch (error) {
    console.error("Create doubt error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/doubts
 * @desc    Get all doubts (Students + Tutors)
 * @access  Private
 */
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
  } catch (error) {
    console.error("Fetch doubts error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

/**
 * @route   POST /api/doubts/:id/answer
 * @desc    Tutor posts an answer to a doubt
 * @access  Private (tutor only)
 */
router.post('/:id/answer', auth, async (req, res) => {
  try {
    // Only tutors can answer
    if (!req.userDoc || req.userDoc.role !== 'tutor') {
      return res.status(403).json({ success: false, message: 'Only tutors can answer doubts' });
    }

    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Answer content required' });

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ success: false, message: 'Doubt not found' });

    doubt.answers.push({ content, answeredBy: req.userDoc._id, createdAt: Date.now() });
    await doubt.save();

    const populated = await Doubt.findById(doubt._id)
      .populate('askedBy', 'name role')
      .populate('answers.answeredBy', 'name role');

    res.json({ success: true, doubt: populated });
  } catch (error) {
    console.error('Answer doubt error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   PUT /api/doubts/:id/answer/:answerId
 * @desc    Edit an existing answer (authoring tutor only)
 * @access  Private (tutor only)
 */
router.put('/:id/answer/:answerId', auth, async (req, res) => {
  try {
    if (!req.userDoc || req.userDoc.role !== 'tutor') {
      return res.status(403).json({ success: false, message: 'Only tutors can edit answers' });
    }

    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Answer content required' });

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ success: false, message: 'Doubt not found' });

    const answer = doubt.answers.id(req.params.answerId);
    if (!answer) return res.status(404).json({ success: false, message: 'Answer not found' });

    // Only the author of the answer may edit it
    if (!answer.answeredBy || answer.answeredBy.toString() !== req.userDoc._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this answer' });
    }

    answer.content = content;
    answer.updatedAt = Date.now();

    await doubt.save();

    const populated = await Doubt.findById(doubt._id)
      .populate('askedBy', 'name role')
      .populate('answers.answeredBy', 'name role');

    res.json({ success: true, doubt: populated });
  } catch (error) {
    console.error('Edit answer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
