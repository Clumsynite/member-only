const User = require("../models/user");
const bcryptjs = require("bcryptjs");

exports.signup_get = (req, res, next) => {
  res.render("signup_form", { title: "SignUp" });
};

exports.signup_post = (req, res, next) => {
  bcryptjs.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      fname: req.body.fname,
      lname: req.body.lname,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
};

exports.login_get = (req, res, next) => {
  res.render("login_form", { title: "Login" });
};

exports.login_post = (req, res, next) => {
  res.render("login_form", { title: "Login" });
};
