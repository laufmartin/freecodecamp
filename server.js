// server.js
// where your node app starts

// init project
var requestLanguage = require('express-request-language');
var cookieParser = require('cookie-parser');
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

const requestIp = require('request-ip');
var parser = require('accept-language-parser');


// your first API endpoint... 
app.get("/api/whoami", function (req, res) {
  const clientIp = requestIp.getClientIp(req); 
  res.json({ ipaddress: clientIp, "language": req.headers['accept-language'], "software": req.headers['user-agent'] });
});


//testing route
app.route('/dh').get((req,res) => { 
  res.json({ ipaddress: req.headers['user-agent'] });
});





// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
