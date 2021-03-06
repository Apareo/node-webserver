const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

var inMaint = false;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', text => {
  return text.toUpperCase();
});

app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toLocaleString();
  var log = `${now}: ${req.method} || ${req.url}`;
  console.log(log);
  fs.appendFile('Server.log', log + '\n', err => {
    if (err) {
      console.log('Unable to append to server log.');
    }
  });
  next();
});

app.use((req, resp, next) => {
  if (inMaint) {
    resp.render('maintenance.hbs');
  } else {
    next();
  }
});

app.get('/', (req, resp) => {
  resp.render('Home.hbs', {
    pageTitle: 'Home',
    titleText: 'Special Home Page',
    welcomeMessage: 'Thank you for visiting our experiment!'
  });
});

app.get('/about', (req, resp) => {
  resp.render('about.hbs', {
    pageTitle: 'Special About Page',
    mainText:
      'Thank you for visiting our experiment, I hope you like the direction we are heading.<br>' +
      'We hope you are as excited as we are about the possibilities.'
  });
});

app.get('/bad', (req, resp) => {
  resp.send({
    errorMessage: 'Cannot fulfill request!',
    errornumber: 503
  });
});

app.get('/projects', (req, resp) => {
  resp.render('projects.hbs', {
    pageTitle: 'Projects',
    titleText: 'List of current projects',
    mainText: 'Current Projects List.'
  });
});

app.get('/utils', (req, resp) => {
  resp.render('utils.hbs', {
    pageTitle: 'Utilities',
    titleText: 'Special Utilities for Members',
    mainText:
      'This is where you will find special utilities built just for Members.'
  });
});

app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
