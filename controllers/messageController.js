const Message = require("../models/message");

exports.get_messages = (req, res, next) => {
  Message.find({})
    .populate("author")
    .exec((err, data) => {
      if (err) {
        return next(err);
      }
      res.render("index", {
        title: "Anon Discussions",
        user: req.user,
        state: req.isAuthenticated(),
        messages: data,
        user: req.user || { status: "public" },
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
      res.render("message_form", {
        errors: err,
        title: "New message",
        user: req.user || { status: "public" },
      });
      return;
    }
    res.redirect("/");
  });
};

exports.message_delete_get = (req, res, next) => {
  Message.findById(req.params.id).populate('author').exec((err, data) => {
    if(err) {return next(err)}
    res.render('message_delete', {title: `Delete ${data.title}`, user: req.user, message: data})
  })
}

exports.message_delete_post = (req, res, next) => {
  Message.findByIdAndRemove(req.body.messageid, (err) => {
    if(err) {return next(err)}
    res.redirect('/')
  })
}