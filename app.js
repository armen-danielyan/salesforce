var config = require('config');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var ejs = require('ejs');
var logger = require('morgan');
var path = require('path');
var shortID = require('shortid');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var SalesforceStrategy = require('passport-salesforce').Strategy;

var route = require('./routes/route');
var Model = require('./models/model');

var app = express();

/*passport.use(new LocalStrategy(
    function (username, password, done) {
        new Model.User({username: username})
            .fetch()
            .then(function (data) {
                var user = data;
                if (user === null) {
                    return done(null, false, {message: 'Invalid username or password'});
                } else {
                    user = data.toJSON();
                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, {message: 'Invalid username or password'});
                    } else {
                        return done(null, user);
                    }
                }
            });
    }
));*/

passport.use(new SalesforceStrategy(
    config.get('salesforce'),
    function(accessToken, refreshToken, profile, done) {
        new Model.User({sf_userID: profile.user_id})
            .fetch()
            .then(function(data){
                var user = data;
                if (user === null) {
                    new Model.User({
                        username: profile.nickname,
                        password: bcrypt.hashSync(shortID.generate()),
                        email: profile.email,
                        first_name: profile.given_name,
                        last_name: profile.family_name,
                        sf_userID: profile.user_id
                    }).save().then(function(model){
                        user = model.toJSON();
                        return done(null, user);
                    });
                } else {
                    user = data.toJSON();
                    return done(null, user);
                }
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    new Model.User({username: username})
        .fetch()
        .then(function (user) {
            done(null, user);
        });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'thisissecretkey',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Routes
 */

app.get('/', route.index);

app.get('/signin', route.signIn);
app.post('/signin', route.signInPost);

app.get('/signout', route.signOut);

app.get('/auth/salesforce', route.salesforceAuth);
app.get('/auth/salesforce/return', route.salesforceReturn);

app.use(route.notFound404);

module.exports = app;