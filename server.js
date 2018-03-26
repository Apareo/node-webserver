const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

var inMaint = true;

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
  var now = new Date().toString();
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
  resp.render('home.hbs', {
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

app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
