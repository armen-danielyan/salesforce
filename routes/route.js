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

var signUp = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('signup', {title: 'Sign Up'});
    }
};

var signUpPost = function (req, res, next) {
    var user = req.body;
    var usernamePromise = null;
    usernamePromise = new Model.User({username: user.username}).fetch();
    return usernamePromise.then(function (model) {
        if (model) {
            res.render('signup', {title: 'signup', errorMessage: 'username already exists'});
        } else {
            var password = user.password;
            var hash = bcrypt.hashSync(password);

            var signUpUser = new Model.User({username: user.username, password: hash});
            signUpUser.save().then(function (model) {
                signInPost(req, res, next);
            });
        }
    });
};

var signOut = function (req, res, next) {
    if (!req.isAuthenticated()) {
        notFound404(req, res, next);
    } else {
        req.logout();
        res.redirect('/signin');
    }
};

var privacy = function (req, res, next) {
    var user = req.user;

    if (user !== undefined) {
        user = user.toJSON();
    }
    res.render('privacy', {title: 'Privacy', user: user});
};

var notFound404 = function (req, res, next) {
    res.status(404);
    res.render('404', {title: '404 Not Found'});
};







module.exports.index = index;



module.exports.signIn = signIn;
module.exports.signInPost = signInPost;

module.exports.signUp = signUp;
module.exports.signUpPost = signUpPost;

module.exports.signOut = signOut;

module.exports.privacy = privacy;

// module.exports.profile = profile;
// module.exports.profileSave = profileSave;

// module.exports.settings = settings;
// module.exports.settingsPost = settingsPost;

module.exports.notFound404 = notFound404;