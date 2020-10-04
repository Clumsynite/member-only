const Message = require('../models/message');
const async = require('async');

exports.get_messages = (req, res, next) => {
  res.render('index', {user: req.user, state: req.isAuthenticated()})
}