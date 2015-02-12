var express = require('express');

/*
 * body-parser is a piece of express middleware that 
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body` 
 *
 * 'body-parser' must be installed (via `npm install --save body-parser`)
 * For more info see: https://github.com/expressjs/body-parser
 */
var bodyParser = require('body-parser');

// create our app
var app = express();

// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// A browser's default method is 'GET', so this
// is the route that express uses when we visit
// our site initially.
app.get('/', function(req, res){
  // The form's action is '/' and its method is 'POST',
  // so the `app.post('/', ...` route will receive the
  // result of our form
  var html = '<form action="/" method="post">' +
               'Enter the summary:' +
               '<input type="text" name="summary" placeholder="..." />' +
               '<br>' +
               '<input type="text" name="startTime" placeholder="..." />' +
               '<br>' +
               '<input type="text" name="endTime" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
               
  res.send(html);
});

// This route receives the posted form.
// As explained above, usage of 'body-parser' means
// that `req.body` will be filled in with the form elements
app.post('/', function(req, res){
   // get form response
  var summary = req.body.summary;
  var startTime = req.body.startTime;
  var endTime = req.body.endTime;
  var MongoClient = require('mongodb').MongoClient;
		  
		  // Connect to the db
			MongoClient.connect("mongodb://localhost:27017/shacal", function(err, db) {
			  if(err) { return console.dir(err); }

			  var collection = db.collection('mevents');
			  
			  collection.insert({summary:"" + summary + "", startTime:"" + startTime + "", endTime:"" + endTime + ""}, { w: 1}, function(err, records){
	                console.log("Record added as "+records[0]._id);
				});

			  var collection2 = db.collection2('event');
			  
			  collection.insert({text:"" + summary + "", startTime:"" + start_date + "", end_date:"" + endTime + "", type: 0}, { w: 1}, function(err, records){
	                console.log("Record added as "+records[0]._id);
				});

			});
			
			
          // Send our JSON response back to the browser
          console.log('Successfully fetched events');
          res.send('<a href="http://localhost:2003">Back to Main</a>');
});

var server = app.listen(2005, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});