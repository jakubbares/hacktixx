var models  = require('../models/index');
var express = require('express');
var router  = express.Router();


router.post('/', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  models.User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  }).then(function(user) {
    res.send({
      message: 'Logged in',
      data: user
    });
  });
});

router.post('/check', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  models.User.findOne({
    where: {
      email: req.body.email,
    }
  }).then(function(user) {
    if (user) {
      res.send({
        message: 'Username already exists',
        data: true
      });
    } else {
      res.send({
        message: "Username doesn't exist",
        data: false
      });
    }
  });
});

module.exports = router;
