const mongoose = require("mongoose");
const { Schema } = mongoose;

const blockedIpSchema = new Schema({
  ip: {
    type: String,
    required: true,
    unique: true,
  },
  blockedAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("BlockedIp", blockedIpSchema);
