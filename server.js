const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const shortid = require('shortid');

const cors = require('cors')

const mongoose = require('mongoose')
const URI = process.env.URI;
var Schema = mongoose.Schema;
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
let userSchema = new Schema({
    _id:{
            type: String,
            default: shortid.generate
        },
    name: String
})
// Create Model
let user = mongoose.model('ExerciseUser', userSchema);

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


//post new user
app.post("/api/exercise/new-user", (req, res) => {
  let newRequest = { name: req.body.username };
  
  //try find posted name in mongo DB
  user.findOne(newRequest,(err, data) => {
    //if posted name is not in DB, create new record
    if (data == null){
      var newUser = new user(newRequest);
      newUser.save(function(err, datas) {
        if (err) return console.error(err);
        res.json(datas);
      });
    }else{
      res.json({name :data.name, id: data._id, note: "already in DB"});
    }
  })
  
})






//show all
app.get("/all", (req, res)=> { 
  user.find().then((data) =>{
    let htm = "<h1 style='color: blue'>List of already saved Users in DB:</h1> <table><tr><th style='width: 100px'>User</th><th>ID</th><tr/>";
    for (var i = 0; i<data.length;i++){htm = htm + "<tr><td>" + data[i].name + "</td><td>" + data[i]._id +"</td></tr>"}
    htm = htm + "</table>"
    
    res.set("Content-Type", "text/plain"); 
        res.format({
        "text/html": () => res.send(htm)
    });
  })
})


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
