'use strict'
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongo = require('mongodb');
var monk = require('monk');

var filehelper = require('../utils/file.helper');
var sectionhelper = require('../utils/section.helper');

var userobject = require('../models/user');
var configobject = require('../config/config');
var challengeobject = require('../models/challenge');

var db = monk(process.env.mongo_db || configobject.databaseconnection);

var coursedetails = filehelper.readfile(configobject.coursefilelocation);

var result = [];
const coderschema = db.get('coder');

function updatestats(req, res, next) {

    var url = configobject.codexgroupsurl;
    var r = request.defaults();

    var grouplist = [];
    var userdetails;

    r(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            //Test member whom have completed some items
            /*          
            var member = {};
            member.firstName = 'Dwayne';
            member.lastName = 'Sauls';
            member.githubUsername = 'Adam911';
                                 
            //Test Member that with no profile
            var member = {};
            member.firstName = 'Gareth';
            member.lastName = 'Williams';
            member.githubUsername = 'GarethW1994';
            */
 
            var member = {};
            member.firstName = 'Janine';
            member.lastName = 'Ritchie';
            member.githubUsername = 'janine-code';
            getGroupStats(member); 
            
            
           /*  var groups = JSON.parse(response.body);
            groups.forEach(function (element) {
                var group = { id: 0, name: '' };
                group.id = element._id;
                group.name = element.name;
                grouplist.push(group);
                element.members.forEach(function (member) {
                    member.group = element.name;
                    getGroupStats(member);
                });
            }, this);   */
        }

        
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(userdetails, null, 3));
        grouplist = [];
    });
}

function resetstats(req,res,next)
{
    coderschema.drop();

    res.setHeader('content-type', 'application/json');
    res.send('Reset completed');
    
}

function getGroupStats(member) {
    let totalmainsections = 0;
    let totalsubsections = 0;
    let totalsections = 0;

    let totalmainsectionscompleted = 0;
    let totalsubsectionscompleted = 0;

    let url = configobject.freecodecampurl + member.githubUsername.toLowerCase();
    let r = request.defaults();

    r(url, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            
            let $ = cheerio.load(body);

            if($('.public-profile-img').html()=== null)
            {
                userobject = {};
                var doc = { group:member.group,username: member.githubUsername, firstname: member.firstName, lastname: member.lastName, image: userobject.profileImage, location: userobject.location, web: "-", javascript: "-", lastdate: "-" };
                coderschema.update(doc, doc, { upsert: true });
                return;
            }

            $('.public-profile-img').filter(function () {

                let data = $(this);

                let profileImage = data[0].attribs.src;
                let name = data.next().next().text();

                userobject = {};
                let location = data.parent().find('.flat-top.wrappable').slice(1).text();
                userobject.firstname = member.firstName;
                userobject.lastname = member.lastName;
                userobject.profileimage = profileImage;
                userobject.location = location;
                userobject.completed = [];

                $('tr').filter(function (i, element) {
                    if (i === 0) { return true;}
                    
                    challengeobject.title = $(this).children().first().text();
                    challengeobject.completed_at = $(this).children().eq(1).text();
                    challengeobject.status = 0;
                    userobject.completed.push(challengeobject);
                    challengeobject = {};
                    //console.log(challengeobject);
                    
                });

                coursedetails.forEach(function (element) {
                element.subheader.forEach(function (item) {
                    item.sections.forEach(function (section) {

                        var found = sectionhelper.matchsections(section, userobject);
                        //console.log(userobject.firstname + ' ' + userobject.lastname);
                        //console.log(userobject.completed);
                        
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
            
            var returnval = JSON.parse(getSubs(result));
            result =[];
            var doc = { group:member.group,username: member.githubUsername, firstname: userobject.firstname, lastname: userobject.lastname, image: userobject.profileImage, location: userobject.location, web: returnval.web, javascript: returnval.javascript, lastdate: returnval.lastdate };
            coderschema.update(doc, doc, { upsert: true });
            userobject = {};
                
            })
        }


        return 'done';
    });

}

function getSubs(result) {
    var subsections = getSubSect();
    var htmlcompleted = 0;
    var htmlcounter = 0;
    var javascriptcompleted = 0;
    var lastdate = configobject.defaultdate;
    var jscounter = 0;

    for (var i = 0; i < subsections.length; i++) {

        result.forEach(function (item) {

            if (subsections[i].sub === item.subsection && item.completed === true && subsections[i].sub === 'HTML5 and CSS') {
                htmlcompleted++;
                htmlcounter++;
            }
            if (subsections[i].sub === item.subsection && item.completed === false && subsections[i].sub === 'HTML5 and CSS') {
                htmlcounter++;
            }
            if (subsections[i].sub === item.subsection && item.completed === true && subsections[i].sub === 'Basic JavaScript') {
                javascriptcompleted++;
                jscounter++;
            }
            if (subsections[i].sub === item.subsection && item.completed === false && subsections[i].sub === 'Basic JavaScript') {
                jscounter++;
            }

            if (lastdate < item.date_completed)
                lastdate = item.date_completed;
        });
    }

    var html = ((htmlcompleted / htmlcounter) * 100).toFixed(2);
    var javascript = Math.floor((javascriptcompleted / jscounter) * 100).toFixed(2);

    if(lastdate === configobject.defaultdate)
        {
            lastdate = "-"
        }

    return JSON.stringify({ web: html, javascript: javascript, lastdate: lastdate });

};

function getMainSect() {
    var mainsections = [];

    coursedetails.forEach(function (element) {
        mainsections.push(element.name);
    });

    return mainsections;
}

function getSubSect() {
    var counters = [];
    var section = '';

    coursedetails.forEach(function (element) {
        var counter = 0;
        section = '';
        element.subheader.forEach(function (item) {
            section = item.name;
            counters.push({ main: element.name, sub: section, numofsections: item.sections.length, numofsubsections: element.subheader.length });
        });
    });

    return counters;
}

module.exports = { updatestats: updatestats, resetstats: resetstats}