const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  duration: Number,
  topic: String,
  notes: String,
  price: Number,

  // 👇 Google Meet fields
  meetLink: String,
  googleEventId: String,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
