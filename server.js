'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dns = require('dns');
var cors = require('cors');

var app = express();
const mongo_key = process.env.MONGO_DB;
var Schema = mongoose.Schema;

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect(process.env.MONGO_DB,);


// mongoose.connect(process.env.MONGOLAB_URI);
// url SCHEMA
var urlSchema = new Schema({
  id: Number,
  url: String,
});
var urlModel = mongoose.model('Url', urlSchema);


app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// test API
app.get("/api/hello", function (req, res) {
  let original = req.body;
  res.json({greeting: 'hello API'});
  console.log(original);
});









app.listen(port, function () {
  console.log('Node.js listening ...');
});