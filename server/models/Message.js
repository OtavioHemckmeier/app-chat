const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  user: Object,
  message: String,
  data: { type: Date, default: Date.now, required: true },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
