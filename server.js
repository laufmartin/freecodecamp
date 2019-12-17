'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');
var bodyParser = require('body-parser');
var cors = require('cors');
var sleep = require('sleep');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

const URI = process.env.URI;
var Schema = mongoose.Schema;
/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
let connection = mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }); 
let urlSchema = new Schema({
    "originalUrl": String,
    "shortUrl": String 
})
// Create Model
let UrlShortener = mongoose.model('UrlShortener', urlSchema);


app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
let regex = RegExp(/(^(http):\/\/|^(https:\/\/))/);

// URL Shortener endpoint:
app.post("/api/shorturl/new", function(req, res) {
  let url = req.body.url;
  let host = url.replace(/(^\w+:|^)\/\//, "");
  let newRequest = { originalUrl: url };
  //count number of objects
  let cn;
  
  //check if posted url is correct and/or have correct format
  if(!regex.test(url)){
    res.json({error: "invalid URL"});
  }else{
    dns.lookup(host, (err, address, family) => {
      if (err) {res.json({ error: "invalid URL" })};
    })    
  } 

  //try find posted url in mongo DB
  UrlShortener.findOne(newRequest,(err, data) => {
    //if posted url is not in DB, create new record
    if (data == null){
      UrlShortener.find().then((data1) => {
          //find without arguments will fetch all records and count is stored in variable. Then with add 1 (this is instead of auto-increment plugin)
          cn = data1.length;
          var newURL = new UrlShortener({originalUrl: url, shortUrl: cn + 1 });
          newURL.save(function(err, datas) {if (err) return console.error(err);});
          res.json({original_url: url, short_url: cn + 1 });
      });    
    }else{
      res.json({original_url: data.originalUrl, short_url: data.shortUrl});
    }
  })   
    
})

//visit shortened link saved in mongo DB
app.get("/api/shorturl/:shortUrl", (req, res)=> {   
  UrlShortener.findOne(req.params,(err, doc)=> {
  err 
    ? console.log(err) 
    : doc !== null
    ? res.redirect(doc.originalUrl)
    : res.json({error: "link not found"})
  })
 })

app.listen(port, function () {
  console.log('Node.js listening ...');
});