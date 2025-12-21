import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const DoubtSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ✅ ONLY required user field
    },
    answers: [AnswerSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Doubt", DoubtSchema);
