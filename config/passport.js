/**
 * Created by Paul on 11/29/2016.
 */

//passport used to authenticate from sources like facebook and google.
    // for user accounts
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy(
    function(username, password, done){
        //validates the users credentials
        User.findOne({username: username},function (err,user){
            if (err){return done(err)}
            if(!user){
                return done(null, false,{message: 'incorrect username.'});
            }
            if(!user.validPassword(password)){
                return done(null, false, {message: 'Incorrect password.'});
            }
            return done(null, user);
        });
    }
));