const Message = require("../models/message");
const async = require("async");

exports.get_messages = (req, res, next) => {
  Message.find({})
    .populate("author")
    .exec((err, data) => {
      if (err) {
        return next(err);
      }
      res.render("index", {
        user: req.user,
        state: req.isAuthenticated(),
        messages: data,
      });
    });
};
exports.new_message_get = (req, res, next) => {
  res.render("message_form", { title: "New Message" });
};
exports.new_message_post = (req, res, next) => {
  const message = new Message({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id,
  });
  message.save((err, data) => {
    if (err) {
      res.render("message_form", { errors: err });
      return;
    }
    res.redirect("/");
  });
};
