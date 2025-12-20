import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema(
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
    tags: [String],
    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "tutor"],
      required: true,
    },

    answers: [
      {
        content: { type: String, required: true },
        answeredBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Doubt", doubtSchema);
