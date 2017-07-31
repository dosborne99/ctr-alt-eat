const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const viewRoutes = require('./routes/views');
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');

const {PORT, DATABASE_URL} = require('./config.js');

const app = express();

//set mongoose promises to es6 native
mongoose.Promise = global.Promise;

app.use(session({
  secret: 'it is all good',
  resave: true,
  saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.set('view engine', 'pug');
app.use(express.static('public'));

app.use('/', viewRoutes);
app.use('/users', userRoutes);
app.use('/recipes', recipeRoutes);

app.use('*', function(req, res) {
  res.redirect('login');
});

// ** connect to Mongo Database
let server;

//open server and connect to database
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

//close server and disconnect from dsatabase
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};