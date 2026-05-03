const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },

  // 🔥 THIS LINE IS CRITICAL
  password: { type: String, select: false },

  role: { type: String, enum: ["admin", "member"], default: "member" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);