// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api/timestamp/:date', function(req, res) {
    // check, if entry is yyyy-mm--dd
    var data = req.params.date;
    if (isNaN(data)) {
        // if entry is yy-mm-dd
        var unixFormat = new Date(data).getTime()/1000;
        var temp = new Date(unixFormat * 1000);
        var utc = temp.toUTCString();
    }
    else {
        // if entry is unix time
        var temp = new Date(data * 1000);
        var utc = temp.toUTCString();
        var unixFormat = parseInt(data); // for removing quotation marks
    }
    res.json({
        unix: unixFormat,
        utc: utc
    });
})

app.get('/api/timestamp', function(req, res) {
    // Now
    var time = new Date();
    var utc = time.toUTCString()
    var unix = time.getTime();
    res.json({
        unix: unix,
        utc: utc
    });
})


app.use(function(req, res) {
    res.status(404).send("Page not found");
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});