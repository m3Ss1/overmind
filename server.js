const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  config = require('./config/DB');

var app = express();

// DB Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DB_mongo, {useNewUrlParser: true}).then(
  () => {console.log('Database is connected')},
  err => {
    console.log('Can not connect to the database' + err);
    mongoose.connect(config.DB_local, {useNewUrlParser: true}).then(
      () => {console.log('Database is connected')},
      err => {console.log('Can not connect to the database' + err)});
  }
);

app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist/overmind')));

// API Route options
app.use('/api/comics', require('./routes/comics-api'));
app.use('/api/mtg', require('./routes/mtg-api'));

// Server listen
var port = process.env.PORT || 4000;
var server = app.listen(port, function () {
  console.log('Listening on port ' + port);
});
