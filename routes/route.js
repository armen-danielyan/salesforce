var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

var Model = require('../models/model');


var index = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/signin');
    } else {

        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();
        }

        console.log(res);

        res.render('index', {title: 'Home', user: user});
    }
};

var signIn = function (req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/');
    res.render('signin', {title: 'Sign In'});
};

var signInPost = function (req, res, next) {
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/signin'}, function (err, user, info) {
        if (err) {
            return res.render('signin', {title: 'Sign In', errorMessage: err.message});
        }
        if (!user) {
            return res.render('signin', {title: 'Sign In', errorMessage: info.message});
        }
        return req.logIn(user, function (err) {
            if (err) {
                return res.render('signin', {title: 'Sign In', errorMessage: err.message});
            } else {
                return res.redirect('/');
            }
        });
    })(req, res, next);
};

var signOut = function (req, res, next) {
    if (!req.isAuthenticated()) {
        notFound404(req, res, next);
    } else {
        req.logout();
        res.redirect('/signin');
    }
};

var notFound404 = function (req, res, next) {
    res.status(404);
    res.render('404', {title: '404 Not Found'});
};

var salesforceAuth = function(req, res, next){
    passport.authenticate('salesforce', {session: true})(req, res, next);
};

var salesforceReturn = function(req, res, next){
    passport.authenticate('salesforce', {session: true}, function(err, user, info) {
        if (err) {
            return res.render('signin', {title: 'Sign In', errorMessage: err.message});
        }
        if (!user) {
            return res.render('signin', {title: 'Sign In', errorMessage: info.message});
        }
        return req.logIn(user, function (err) {
            if (err) {
                return res.render('signin', {title: 'Sign In', errorMessage: err.message});
            } else {
                return res.redirect('/');
            }
        });
    })(req, res, next)
};






module.exports.index = index;

module.exports.signIn = signIn;
module.exports.signInPost = signInPost;

module.exports.signOut = signOut;

module.exports.salesforceAuth = salesforceAuth;
module.exports.salesforceReturn = salesforceReturn;

module.exports.notFound404 = notFound404;