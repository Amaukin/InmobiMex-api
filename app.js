var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var propertyApiRouter = require('./routes/propertyApi');
var userApiRouter = require('./routes/userApi');

var app = express();

mongoose.connect('mongodb+srv://AdminTI:AdminTI@inmobimex.xdlamyh.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true
}).then( () => {
  console.log('Connected to mongo database');
}).catch(err => console.log('Error:', err));

hbs.registerPartials(__dirname + '/views/partials')

hbs.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

app.use('/', indexRouter);
app.use('/propertyApi', propertyApiRouter);
app.use('/usersApi', userApiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
