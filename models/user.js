const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  joined: {type: Date, default: Date.now}
});

UserSchema.virtual('fullname').get(function (){
  return `${this.fname} ${this.lname}`
})

module.exports = mongoose.model('User', UserSchema)