var models  = require('../models/index');
var express = require('express');
var router  = express.Router();


router.get('/', function(req, res) {
  models.User.findAll({
  }).then(function(users) {
    res.send({
      message: 'Success',
      data: users
    });
  });
});

router.post('/create', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  models.User.create({
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  }).then(function() {
    res.send(JSON.stringify({
      message: 'User registered',
      data: {
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      }
    }));
  });
});

router.put('/:email/update', function(req, res) {
  const updateValues = {
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  };
  models.User.update(updateValues, {
    where: {email: req.params.email}
  }).then(function(){
    res.send(JSON.stringify({
      message: 'User updated',
      data: {
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      }
    }));
  });
});

router.get('/:email/destroy', function(req, res) {
  models.User.destroy({
    where: {
      email: req.params.email
    }
  }).then(function() {
    res.send({
      message: 'User deleted'
    });
  });
});



module.exports = router;
