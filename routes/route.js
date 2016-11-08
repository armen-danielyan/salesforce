var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');





var index = function (req, res, next) {
/*    if (!req.isAuthenticated()) {
        res.redirect('/signin');
    } else {*/

        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();
        }

        res.render('index', {title: 'Home', user: user});
    //}
};

var notFound404 = function (req, res, next) {
    res.status(404);
    res.render('404', {title: '404 Not Found'});
};







module.exports.index = index;

// module.exports.profile = profile;
// module.exports.profileSave = profileSave;
//
// module.exports.signIn = signIn;
// module.exports.signInPost = signInPost;
//
// module.exports.signUp = signUp;
// module.exports.signUpPost = signUpPost;
//
// module.exports.signOut = signOut;
//
// module.exports.facebookAuth = facebookAuth;
// module.exports.facebookAuthReturn = facebookAuthReturn;
//
module.exports.notFound404 = notFound404;
//
// module.exports.privacy = privacy;
//
// module.exports.settings = settings;
// module.exports.settingsPost = settingsPost;
//
// module.exports.webhooks = webhooks;
// module.exports.webhooksPost = webhooksPost;
//
// module.exports.authorize = authorize;