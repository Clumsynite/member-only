const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  joined: { type: Date, default: Date.now },
  status: {type:String, enum: ['public','private', 'admin'], default: 'public'}
});

UserSchema.virtual("fullname").get(function () {
  return `${this.fname} ${this.lname}`;
});

module.exports = mongoose.model("User", UserSchema);
