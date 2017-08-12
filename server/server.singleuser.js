var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var filehelper = require('../utils/file.helper.js');
var sectionhelper = require('../utils/section.helper.js');

var userobject = require('../models/user');
var configobject = require('../config/config');
var challengeobject = require('../models/challenge');

var coursedetails = filehelper.readfile(configobject.coursefilelocation);

function getSingleUser(req, res, next) {

    if (req.params.name === undefined) {
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify("ErrorMessage", "Please provide a user name"));
    }

    var url = configobject.freecodecampurl + req.params.name;
    var r = request.defaults();

    r(url, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);

            $('.public-profile-img').filter(function () {
                var data = $(this);

                profileImage = data[0].attribs.src;
                name = data.next().next().text();
                location = data.parent().find('.flat-top.wrappable').slice(1).text();

                userobject.name = name;
                userobject.profileImage = profileImage;
                userobject.location = location;
            })

            $('tr').filter(function (i, element) {
                if (i === 0) {
                    return true;
                }

                challengeobject.title = $(this).children().first().text();
                challengeobject.completed_at = $(this).children().eq(1).text();
                challengeobject.status = 0;

                userobject.completed.push(challengeobject);
            });
        }

        var result = [];
              
        var totalmainsections = 0;
        var totalsubsections = 0;
        var totalsections = 0;

        var totalmainsectionscompleted = 0;
        var totalsubsectionscompleted = 0;

        coursedetails.forEach(function (element) {
            element.subheader.forEach(function (item) {
                item.sections.forEach(function (section) {
                    var found = sectionhelper.matchsections(section, userobject);
                    if (found !== undefined) {
                        result.push(
                            {
                                mainsection: element.name,
                                subsection: item.name,
                                maptitle: section,
                                title: found.title,
                                completed: found.title === section,
                                date_completed: found.completed_at
                            });
                    }
                    else {
                        result.push({
                            mainsection: element.name,
                            subsection: item.name,
                            maptitle: section,
                            title: "Not Completed",
                            completed: false,
                            date_completed: ''
                        });
                    }

                });

            });
        });

        if (!error && response.statusCode != 200) {
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify("ErrorMessage", "Please enter a valid user name"));
        }
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify({ name: userobject.name, avatar: userobject.profileImage, progress: result }, null, 3));
    });
}

function getMainSections(req, res, next) {
    var mainsections = [];

    coursedetails.forEach(function (element) {

        mainsections.push(element.name);
    });

    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(mainsections, null, 3));
}

function getSubSections(req, res, next) {
    var subsections = [];

    var completed = 0;

    var counters = [];
    var section = '';
    var previouscounter = 0;

    coursedetails.forEach(function (element) {
        var counter = 0;
        section = '';
        element.subheader.forEach(function (item) {
            section = item.name;
            counters.push({ main: element.name, sub: section, numofsections: item.sections.length, numofsubsections: element.subheader.length });
        });
    });

    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(counters, null, 3));
}

module.exports = { getSingleUser: getSingleUser, getMainSections: getMainSections, getSubSections: getSubSections }