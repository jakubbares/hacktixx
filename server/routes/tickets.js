var models  = require('../models/index');
var express = require('express');
var router  = express.Router();


router.get('/', function(req, res) {
  models.Ticket.findAll({
  }).then(function(tickets) {
    res.send({
      message: 'Success',
      data: tickets
    });
  });
});

router.post('/create', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  models.Ticket.create({
    userEmail: req.body.userEmail,
    userEthAddress: req.body.userEthAddress,
    event: req.body.event,
    row: req.body.row,
    column: req.body.column,
    resale: req.body.resale,
    origPrice: req.body.origPrice,
    newPrice: req.body.newPrice
  }).then(function() {
    res.send(JSON.stringify({
      message: 'Ticket registered',
      data: {
        userEmail: req.body.userEmail,
        userEthAddress: req.body.userEthAddress,
        event: req.body.event,
        row: req.body.row,
        column: req.body.column,
        resale: req.body.resale,
        origPrice: req.body.origPrice,
        newPrice: req.body.newPrice
      }
    }));
  });
});

router.put('/update', function(req, res) {
  const updateValues = {
    userEmail: req.body.userEmail,
    userEthAddress: req.body.userEthAddress,
    event: req.body.event,
    row: req.body.row,
    column: req.body.column,
    resale: req.body.resale,
    origPrice: req.body.origPrice,
    newPrice: req.body.newPrice
  };
  models.Ticket.update(updateValues, {
    where: {
      row: req.body.row,
      column: req.body.column,
      event: req.body.event
    }
  }).then(function(){
    res.send(JSON.stringify({
      message: 'Ticket updated',
      data: {
        userEmail: req.body.userEmail,
        userEthAddress: req.body.userEthAddress,
        event: req.body.event,
        row: req.body.row,
        column: req.body.column,
        resale: req.body.resale,
        origPrice: req.body.origPrice,
        newPrice: req.body.newPrice
      }
    }));
  });
});

router.get('/:event/destroy', function(req, res) {
  models.Ticket.destroy({
    where: {
      event: req.params.event
    }
  }).then(function() {
    res.send({
      message: 'Ticket deleted'
    });
  });
});



module.exports = router;
