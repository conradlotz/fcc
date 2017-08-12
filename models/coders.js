var mongoose = require('mongoose');
var schema = mongoose.Schema;

var schema = new mongoose.Schema({
    username: {type: String},
    name: {type: String},
    surname: {type: String},
    email: {type: String},
    html: {type: String},
    javascript: {type: String}

});

module.exports= mongoose.model('coder',schema);

