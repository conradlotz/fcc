var express = require('express');
var router = express.Router();
var servergroup = require('../server/server.groups');
var request = require('request');

//Scraping stats from Free Code Camp
router.get('/api/update',servergroup.updatestats);
router.post('/api/reset',servergroup.resetstats);

module.exports = router;