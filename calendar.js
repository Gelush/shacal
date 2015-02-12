// Google OAuth Configuration
var express = require('express'),
  moment = require('moment'),
  google = require('googleapis');
var path = require('path');
var bodyParser = require('body-parser');
  uploadical = require('./uploadical');
  manual = require('./manual');
  app = require('./app');
  
var app = express();
app.use(express.static(path.join(__dirname, '')));

//connect to the mongoDB
var db = require('mongoskin').db("mongodb://localhost:27017/shacal", { w: 0});
    db.bind('event');

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

app.post('/data', function(req, res){
    var data = req.body;

    //get operation type
    var mode = data["!nativeeditor_status"];
    //get id of record
    var sid = data.id;
    var tid = sid;

    //remove properties which we do not want to save in DB
    delete data.id;
    delete data.gr_id;
    delete data["!nativeeditor_status"];


    //output confirmation response
    function update_response(err, result){
        if (err)
            mode = "error";
        else if (mode == "inserted")
            tid = data._id;

        res.setHeader("Content-Type","text/xml");
        res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
    }

    //run db operation
    if (mode == "updated")
        db.event.updateById( sid, data, update_response);
    else if (mode == "inserted")
        db.event.insert(data, update_response);
    else if (mode == "deleted")
        db.event.removeById( sid, update_response);
    else
        res.send("Not supported operation");
});

var server = app.listen(2003, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});