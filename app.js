'use strict'

const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser')
const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.use('/static', express.static('static'));

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Planet = require('./planets.js');
mongoose.connect('mongodb://localhost:27017/planets-db');

app.get('/index/create', function (req, res) {
  // Add a planet form
  console.log('adding a planet')
  res.render('create', {});
});

app.post('/index/create', function (req, res) {
  // add form data to db
  let planet = new Planet({
    name: req.body.name,
    size: req.body.size,
    orbit: req.body.orbit
  });

  console.log('adding planet to DB');
  console.log(planet);
  planet.save().then(function(data) {
    console.log('default planet added to database:', data)
    res.redirect('/index');
  }).catch(function(err) {
    console.log('planet entry failed:', err);
    res.redirect('/index/create');
  })
});

app.post('/index/:planet/edit', function (req, res) {
  // perform update in mongoose
  console.log('updating', req.body.name, req.body.id);
  Planet.update({_id: req.body.id},
    {$set: {
      name: req.body.name,
      size: req.body.size,
      orbit: req.body.orbit
    }}, function (err, obj) {
      if (err) {
        console.log(err);
      }
      res.redirect('/index/' + req.body.name);
    }
  )
});

app.get('/index/:planet/edit', function (req, res) {
  // render update form for specified planet
  console.log('updating planet', req.params.planet)
  Planet.findOne({name: req.params.planet}, function(err, obj) {
    if (err) {
      console.log('error:', err);
      res.redirect('/index/' + req.params.planet);
    }
    console.log(obj);
    res.render('create', obj);
  })
});

app.post('/index/:planet/delete', function (req, res) {
  console.log('checking if you want to delete ' + req.params.planet)
  res.render('delete', {name: req.params.planet, id: req.body.id})
})

app.post('/index/delete', function (req, res) {
  console.log('deleting the planet', req.body.id);
  Planet.deleteOne({ _id: req.body.id}).then((data) => {
    console.log('deleted');
    res.redirect('/index');
  }).catch((err) => {
    console.log('error!', err);
    res.redirect('/index');
  })
});

app.get('/index/:planet', function (req, res) {
  // show all details for a given planet
  console.log('visiting planet:', req.params.planet);
  Planet.findOne({name: req.params.planet}, function(err, obj) {
    if (err) {
      console.log('error:', err);
      res.redirect('/index');
    }
    // console.log(obj);
    res.render('planet', obj);
  })
});

app.get('/index', function (req, res) {
  // show all planet names
  Planet.find({}).then(function (obj) {
    console.log('rendering index');
    res.render('index', {planets: obj});
  }).catch(function (err) {
    console.log('error:', err);
    res.send(err);
  })
});

app.listen(3000, function() {
  console.log('listening on 3000');
})
