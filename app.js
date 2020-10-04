require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const flash = require('connect-flash');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const indexRouter = require("./routes/index");
const User = require("./models/user");
const mongoose = require("mongoose");

const app = express();

const mongoDB = process.env.MONGO_URL || process.env.MONGO_URI;

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error: "));

const MongoStore = require('connect-mongo')(session);
const connection = mongoose.createConnection(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(flash())
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {maxAge: 10 * 3000}
  })
);

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { msg: "Incorrect username" });
      }
      bcryptjs.compare(password, user.password, (err, res) => {
        if (res) {
          console.log(res)
          return done(null, user);
        } else {
          return done(null, false, { msg: "Incorrect password" });
        }
      });
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, () => {
  console.log(`App listening on port 3000!\nhttp://localhost:3000`);
});
