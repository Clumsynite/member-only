const moment = require('moment');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, require: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, require: true },
  added: { type: Date, default: Date.now },
});

MessageSchema.virtual("timestamp", function () {
  return moment(this.added).format("MMMM Do YYYY, h:mm:ss a");
});

module.exports = mongoose.model("Message", MessageSchema);
