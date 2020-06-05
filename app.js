const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const express_validator = require('express-validator')
const session = require('express-session')


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();


//integrating env file configuration
require('dotenv').config();
//require('dotenv').config({ path: '.env' });

//connect mongodb with this application
mongoose.connect(process.env.MFLIX_DB_URI,{
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("DB Connected !!"))
.catch(err => {
  console.log(err.message)
});


if (process.env.environment === "development") {
  app.set('trust proxy', 1) // trust first proxy

}

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
})); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', usersRouter);
app.use('/login', usersRouter);



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
