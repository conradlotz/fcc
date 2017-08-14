var config = {}

config.codexgroupsurl = 'http://quiz-me.projectcodex.co/api/usergroups';
config.coursefilelocation = './sources/course.json';
config.databaseconnection = 'localhost:27017/codex';
config.freecodecampurl = 'https://www.freecodecamp.com/';
config.defaultdate = 'Jan 01, 2010'
config.appurl = process.env.app_url;

module.exports = config;