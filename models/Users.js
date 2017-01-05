/**
 * Created by Paul on 11/29/2016.
 */
var mongoose = require('mongoose');
//crypto module used for hashing/encripting
var crypto = require('crypto');
//json web token
var jwt = require('jsonwebtoken');

//schema = some sort of layout for the data
var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    //4 params password, salt, iterations, and key length
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password){
    //hashed the password passed in.
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    //compares to the actual data.
    return this.hash == hash;
};

UserSchema.methods.generateJWT = function(){
    var today = new Date();
    var exp = new Date(today);
    //60 days later it'll expire
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime()/1000)
    }, 'SECRET'); //TODO: USE AN ENVIRONMENT VARIABLE TO REFFERENCE
};

//let mongodb know about the model named User using the schema UserSchema
mongoose.model('User',UserSchema);