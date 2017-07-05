'use strict'

const express = require('express');
const mustache = require('mustache-express');
const app = express();
const router = express.Router();

app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.use('/static', express.static('static'));

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Planet = require('./planets.js');
mongoose.connect('mongodb://localhost:27017/planets-db');

// default entry
// let planet = new Planet({});
// custom entry
let planet = new Planet({
  name: "Sun",
  size: "695,700 km",
  orbit: 0
});

// planet.save().then(function(data) {
//   console.log('default planet added to database:', data)
// }).catch(function(err) {
//   console.log('planet entry failed:', err);
// })

app.get('/', function (req, res) {
  Planet.find({}).then(function (obj) {
    console.log('successful query:', obj);
    res.send(obj);
  }).catch(function (err) {
    console.log('error:', err);
    res.send(err);
  })
})

app.listen(3000, function() {
  console.log('listening on 3000');
})
