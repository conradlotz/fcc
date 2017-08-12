var fs = require('fs');

var readfile = function(filepath)
{
   return JSON.parse(fs.readFileSync(filepath, 'utf8'));
};

module.exports = {readfile:readfile}