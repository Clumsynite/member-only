const User = require("../models/user");
const async = require("async");

exports.signup_get = (req, res, next) => {
  res.render("signup_form", { title: "Sign Up" });
};

exports.login_get = (req, res, next) => {
  res.render("login_form", { title: "Login" });
};

exports.login_post = (req, res, next) => {
  res.render("login_form", { title: "Login" });
};
