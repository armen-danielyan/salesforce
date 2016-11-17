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

passport.use(new LocalStrategy(
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
));

passport.use(new SalesforceStrategy(
    config.get('salesforce'),
    function(accessToken, refreshToken, profile, done) {
        var instanceURLRgx = /([a-z0-9|-]+\.)*[a-z0-9|-]+\.[a-z]+/;
        console.log(profile);
        console.log('AT: '+ accessToken);
        // console.log('RT: '+ refreshToken);
        new Model.User({sf_userID: profile.user_id})
            .fetch()
            .then(function(data){
                var user = data;
                if (user === null) {
                    new Model.User({
                        sf_userID: profile.user_id,
                        sf_organisationID: profile.organization_id,
                        username: profile.nickname,
                        full_name: profile.name,
                        first_name: profile.given_name,
                        last_name: profile.family_name,
                        email: profile.email,
                        sf_accessToken: accessToken,
                        sf_refreshToken: refreshToken,
                        sf_instanceURL: 'https://' + instanceURLRgx.exec(profile.urls.query)[0]
                    })
                        .save()
                        .then(function(model){
                            user = model.toJSON();
                            return done(null, user);
                        });
                } else {
                    new Model.User({ID: user.toJSON().ID})
                        .save({
                            sf_accessToken: accessToken
                        }, {patch: true})
                        .then(function(){
                            user = data.toJSON();
                            return done(null, user);
                        });
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
app.post('/', route.indexPost);

app.get('/signin', route.signIn);
app.post('/signin', route.signInPost);

app.get('/signup', route.signUp);
app.post('/signup', route.signUpPost);

app.get('/reset', route.reset);
app.post('/reset', route.resetPost);

app.get('/signout', route.signOut);

app.get('/auth/salesforce', route.salesforceAuth);
app.get('/auth/salesforce/return', route.salesforceReturn);

app.use(route.notFound404);

module.exports = app;