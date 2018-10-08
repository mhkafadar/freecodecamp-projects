'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var Link = require('./models/link.js');
var dns = require('dns');
var url = require('url');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connect("mongodb://localhost:27017/shortlink2");

app.use(cors());


/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", function(req, res) {
	var parsedUrl = url.parse(req.body.url);
	let ipAddr;
	dns.lookup(parsedUrl.hostname, function(err, addr, family) {
		if (!addr) { 
			return res.json({ error: 'Wrong URL!'})
		}
		else {
			ipAddr = addr
		}
		var newLink = new Link({
			forward: req.body.url,			
		});	
		newLink.save(function(err) {
			if(err) { 
				console.log(err);
				res.json('This url already exists');
				return;
			}
			res.status(200).json({
				original_url: newLink.forward,
				short_url: newLink.linkId
			});
		});		
	});
});

app.get('/api/shorturl/:linkId', function(req, res, next) {
	Link.findOne({ 'linkId': req.params.linkId}, function(err, doc) {
		if(err) { 
			console.log(err); 
			next(err);
		}	
		if(doc) {
			res.redirect(doc.forward);
		}	
		else {
			next(err);
		}
	});
});

app.use(function(req, res){
	res.status(400).send("404! not exist");
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});