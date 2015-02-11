/*Define dependencies.*/

var express=require("express");
var multer  = require('multer');
var app=express();
var done=false;

/*Configure the multer.*/

app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
	
  console.log(file.fieldname + ' uploaded to  ' + file.path);
  
  // read the saved ics (iCalendar) file
  fs = require('fs')
  
	fs.readFile(__dirname + "/" + file.path, 'utf8', function (err,data) {
	  if (err) {
		return console.log(err);
	  }
	  // convert the ics file to json
      var ical2json = require("ical2json");
      var output = ical2json.convert(data);
      console.log(output);
	  console.log(data);
	  
	  
		  // Retrieve
		  var MongoClient = require('mongodb').MongoClient;
		  
		  // Connect to the db
			MongoClient.connect("mongodb://localhost:27017/shacal", function(err, db) {
			  if(err) { return console.dir(err); }

			  var collection = db.collection('ievents');
			  
			  collection.insert(output, { w: 0 });

			});
	  
	});
  done=true;
}
}));

/*Handling routes.*/

app.get('/',function(req,res){
      res.sendFile(__dirname + "/uploadical.html");
});

app.post('/api/ical',function(req,res){
  if(done==true){
    console.log(req.files);
    res.end("File uploaded.");
  }
});

/*Run the server.*/
app.listen(3000,function(){
    console.log("Working on port 3000");
});