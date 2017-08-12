var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', function (req, res) {
  var db = req.db;
  var coders = db.get('coder');
  coders.find({},{}, function(e, docs){
    coders.distinct('group',function(e,items){
      res.render('home', { title: 'Coders Progress',coders:docs,groups:items});
  });
  });
      
});

module.exports = router;