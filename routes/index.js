var express = require('express');
var request = require('request');
var router = express.Router();
var configobject = require('../config/config');

router.get('/', function (req, res) {
  var db = req.db;
  var coders = db.get('coder');
  coders.find({},{}, function(e, docs){
    coders.distinct('group',function(e,items){
      res.render('home', { title: 'Coders Progress',coders:docs,groups:items,url:configobject.appurl});
  });
  });
      
});

module.exports = router;