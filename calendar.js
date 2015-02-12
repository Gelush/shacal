// Google OAuth Configuration
var express = require('express'),
  moment = require('moment'),
  google = require('googleapis');
var path = require('path');
var bodyParser = require('body-parser');
  uploadical = require('./uploadical');
  app = require('./app');
  
var app = express();
app.use(express.static(path.join(__dirname, '')));

//is necessary for parsing POST request
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/init', function(req, res){
    db.event.insert({ 
        text:"My test event A", 
        start_date: new Date(2013,8,1),
        end_date:   new Date(2013,8,5)
    });
    db.event.insert({ 
        text:"One more test event", 
        start_date: new Date(2013,8,3),
        end_date:   new Date(2013,8,8),
        color: "#DD8616"
    });

    /*... skipping similar code for other test events...*/

    res.send("Test events were added to the database")
});


app.get('/data', function(req, res){
    db.event.find().toArray(function(err, data){
        //set id property for all records
        for (var i = 0; i < data.length; i++)
            data[i].id = data[i]._id;

        //output response
        res.send(data);
    });
});
var server = app.listen(2003, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});