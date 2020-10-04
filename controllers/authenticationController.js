const { body, validationResult, check } = require("express-validator");
const passport = require("passport");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

exports.signup_get = (req, res, next) => {
  res.render("signup_form", {
    title: "SignUp",
    user: req.user || { status: "public" },
    state: req.isAuthenticated(),
  });
};

exports.signup_post = [
  body("fname")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First name must be specified")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("lname")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Last name must be specified")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("username")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Username must be specified")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("password").isLength({ min: 8 }).trim(),
  check("password").exists(),
  check("confirm", "Passwords don't match")
    .exists()
    .custom((value, { req }) => value === req.body.password),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.render("signup_form", {
        title: "SignUp",
        username: req.body.username,
        err: errors.errors,
        fname: req.body.fname,
        lname: req.body.lname,
        user: req.user,
        state: req.isAuthenticated(),
      });
    } else {
      const exists = await User.findOne({ username: req.body.username });
      if (exists) {
        res.render("signup_form", {
          title: "SignUp",
          errors: { msg: "Username already exists" },
          fname: req.body.fname,
          lname: req.body.lname,
          user: req.user,

          state: req.isAuthenticated(),
        });
      } else {
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
      }
    }
  },
];

exports.login_get = (req, res, next) => {
  res.render("login_form", { title: "Login" });
};

exports.login_post = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (!user) {
      res.render("login_form", {
        title: "Login",
        errors: info,
        username: req.body.username,
        user: req.user,

        state: req.isAuthenticated(),
      });
      return;
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  })(req, res, next);
};

exports.logout_get = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) throw new Error(err);
    res.redirect("/");
  });
};

exports.join_get = (req, res, next) => {
  res.render("join_form", {
    title: "Join US",
    user: req.user || { status: "public" },
    state: req.isAuthenticated(),
  });
};

exports.join_post = (req, res, next) => {
  if (req.body.secret === process.env.JOIN_KEY) {
    const user = new User({
      status: "private",
      _id: req.user._id,
    });
    User.findByIdAndUpdate(req.user._id, user, {}, (err, data) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  } else {
    res.render("join_form", {
      title: "Join US",
      errors: {
        msg: "Trying to use a different key\nRead my README for a hint ",
      },
      user: req.user,
      state: req.isAuthenticated(),
    });
  }
};
