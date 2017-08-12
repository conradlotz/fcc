var express = require('express');
var router = express.Router();
var servergroup = require('../server/server.groups');
var request = require('request');

//Scraping stats from Free Code Camp
router.get('/api/groups',servergroup.getGroups);

//Fetcing data from database to display in grid
router.get('/users',function(req,res){
var db = req.db;
  var coders = db.get('coder');

  coders.find({},{}, function(e, docs){
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(docs, null, 3));
  });
})

module.exports = router;