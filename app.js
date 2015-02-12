// Google OAuth Configuration
var googleConfig = {
  clientID: '45657096402-bpjdte3rqkit3pe3p89d2qo5fc399b11.apps.googleusercontent.com',
  clientSecret: '-JPxaGxrc4b8pgM0HfFKj7_m',
  calendarId: 'gelus2k@gmail.com',
  redirectURL: 'http://localhost:2002/auth'
};

// Dependency setup
var express = require('express'),
  moment = require('moment'),
  google = require('googleapis');
  uploadical = require('./uploadical');

// Initialization
var app = express(),
  calendar = google.calendar('v3');
  oAuthClient = new google.auth.OAuth2(googleConfig.clientID, googleConfig.clientSecret, googleConfig.redirectURL),
  authed = false;

// Response for localhost:2002/
app.get('/', function(req, res) {

  // If we're not authenticated, fire off the OAuth flow
  if (!authed) {

    // Generate an OAuth URL and redirect there
    var url = oAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/calendar.readonly'
    });
    res.redirect(url);
  } else {
	  
      // Format today's date
      var today = moment().format('YYYY-MM-DD') + 'T';

      // Call google to fetch events for today on our calendar
      calendar.events.list({
        calendarId: googleConfig.calendarId,
        maxResults: 20,
        timeMin: today + '00:00:00.000Z',
        timeMax: today + '23:59:59.000Z',
        auth: oAuthClient
      }, function(err, events) {
        if(err) {
          console.log('Error fetching events');
          console.log(err);
        } else {

		  // Retrieve
		  var MongoClient = require('mongodb').MongoClient;
		  
		  // Connect to the db
			MongoClient.connect("mongodb://localhost:27017/shacal", function(err, db) {
			  if(err) { return console.dir(err); }

			  var collection = db.collection('events');
			  
			  collection.insert(events.items, { w: 0 });

			  var collection2 = db.collection('event');
			  for(var i in events.items)
				{
					 collection2.insert({summary: events.items[i].summary, start_date: events.items[i].start, end_date: events.items[i].end}, { w: 0 });
				}
			  

			});
			
			
          // Send our JSON response back to the browser
          console.log('Successfully fetched events');
          res.send('<a href="http://localhost:2003">Back</a>');
        }
      });
  }
});

// Return point for oAuth flow, should match googleConfig.redirectURL
app.get('/auth', function(req, res) {

    var code = req.param('code');

    if(code) {
      // Get an access token based on our OAuth code
      oAuthClient.getToken(code, function(err, tokens) {

        if (err) {
          console.log('Error authenticating')
          console.log(err);
        } else {
          console.log('Successfully authenticated');
          console.log(tokens);
          
          // Store our credentials and redirect back to our main page
          oAuthClient.setCredentials(tokens);
          authed = true;
          res.redirect('/');
        }
      });
    } 
});

var server = app.listen(2002, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});