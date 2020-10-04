const passport = require('passport');
const express = require("express");
const router = express.Router();

const authenticationController = require("../controllers/authenticationController");
const messageController = require("../controllers/messageController");

const checkAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next()
  } 
  res.redirect('/login')
}

router.get("/", messageController.get_messages);

router.get("/login", authenticationController.login_get);

router.post(
  "/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get("/signup", authenticationController.signup_get);

router.post("/signup", authenticationController.signup_post);

router.get('/logout', authenticationController.logout_get)
module.exports = router;
