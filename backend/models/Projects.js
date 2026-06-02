import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    timeline: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    portfolioLinks: [String],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      min: Number,
      max: Number,
    },
    timeline: String,
    skills: [String],
    category: String,

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bids: [bidSchema],

    proposalsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
