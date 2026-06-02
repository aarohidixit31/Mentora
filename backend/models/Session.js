const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: Date,
  duration: Number,
  topic: String,
  price: Number,

  meetLink: String,
  googleEventId: String,

  isBooked: { type: Boolean, default: false }, // ✅ IMPORTANT
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track students who booked

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);
