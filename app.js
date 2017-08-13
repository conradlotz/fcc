var express = require('express');
var exphbs = require('express-handlebars');
var index = require('./routes/index');
var load = require('./routes/load');
var configobject = require('./config/config');
var mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');
var app = express();

var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.mongo_db || configobject.databaseconnection);

app.use(function (req, res, next) {
    req.db = db;
    next();
});

app.use(cors());
app.set('views', __dirname + '/views');
app.engine('.hbs', exphbs({
    defaultLayout: 'main', layoutDir: __dirname + '/views/layouts', extname: '.hbs',
    partialsDir: [
        //  path to your partials
        __dirname + '/views/partials',
    ]
}));
app.set('view engine', 'hbs');
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/sources', express.static(path.join(__dirname, 'sources')));

app.use('/web', index);
app.use('/', load);

app.listen(process.env.PORT || 4302);
console.log('Listening on port 4302');
module.exports = app;