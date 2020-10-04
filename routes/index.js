const express = require("express");
const router = express.Router();

const authenticationController = require("../controllers/authenticationController");
const messageController = require("../controllers/messageController");

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.get("/", messageController.get_messages);

router.get("/login", authenticationController.login_get);

router.post("/login", authenticationController.login_post);

router.get("/signup", authenticationController.signup_get);

router.post("/signup", authenticationController.signup_post);

router.get("/logout", authenticationController.logout_get);

router.get(
  "/new-message",
  checkAuthenticated,
  messageController.new_message_get
);

router.post(
  "/new-message",
  checkAuthenticated,
  messageController.new_message_post
);

router.get("/join", checkAuthenticated, authenticationController.join_get);

router.post("/join", checkAuthenticated, authenticationController.join_post);

module.exports = router;
