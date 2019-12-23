const express = require('express');
const mongoose = require('mongoose');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
);
// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

const passport = require('passport');
// Passport Config
require('./config/passport')(passport);

const indexRouter = require('./routes/index');
const students = require('./routes/students');

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



// DB Config
const db = require('./config/secret').mongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.set('view engine', 'ejs');


// Express body parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRouter);
app.use('/students', students);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
