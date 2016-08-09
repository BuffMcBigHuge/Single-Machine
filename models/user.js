/**
 * SINGLE MACHINE - /models/user
 * (c) 2016
 */

var mongoose = require('mongoose');
var db = require('../api/db.js');
var bcrypt = require('bcryptjs');

var ShortId = require('id-shorter');

var userSchema = new mongoose.Schema({
    id: {type: String, unique: true, lowercase: true, sparse: true},
    email: {type: String, unique: true, lowercase: true },
    password: {type: String, select: false },
    bioSummary: {type : String},
    displayName: {
        firstName: {type : String},
        middleName: {type : String},
        lastName: {type : String}
    },
    picture: {type : String},
    uploads : [{
        type: {type: String},
        file: {type : String}
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isValid: {type : Boolean}
});

userSchema.index({location : '2dsphere'});

userSchema.pre('save', function (next) {

    var user = this;

    // Middleware
    if (!user.id) {
        var mongoDBShortId = ShortId();
        var shortId = mongoDBShortId.encode(user._id);
        user.id = shortId;
    }

    if (!user.isModified('password'))
        return next();

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });

});

userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

var User = db.model('User', userSchema);

module.exports = User;

// EOF
