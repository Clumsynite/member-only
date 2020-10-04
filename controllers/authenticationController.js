const passport = require("passport");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

exports.signup_get = (req, res, next) => {
  res.render("signup_form", { title: "SignUp" });
};

exports.signup_post = async (req, res, next) => {
  const exists = await  User.findOne({username: req.body.username})
  if(exists) {
    res.render('signup_form', {title: 'SignUp', errors: {msg: 'Username already exists'}, fname: req.body.fname, lname: req.body.lname})
  }else{
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
};

exports.login_get = (req, res, next) => {
  res.render("login_form", { title: "Login" });
};

exports.login_post = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {

    if (!user) {
      res.render("login_form", { title: "Login", errors: info, username: req.body.username });
      return
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  })(req, res, next);
}

exports.logout_get = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) throw new Error(err);
    res.redirect("/");
  });
};
