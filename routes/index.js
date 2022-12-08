var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  Superheroe.count().exec(async function (err, count) {
    var randomNumber = Math.floor(Math.random() * count)
    var randomSuperheroe = await Superheroe.findOne().skip(randomNumber);
    res.send('InmobiMex api router');
  })
});

module.exports = router;
