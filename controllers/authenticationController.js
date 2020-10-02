const User = require('../models/user')
const async = require('async');

exports.login_get = (req, res, next) => {
  res.render('login_form')  
}