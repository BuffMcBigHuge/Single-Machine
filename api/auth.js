/**
 * SINGLE MACHINE - /api/auth
 * (c) 2016
 */

'use strict';

var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var express = require('express');
var moment = require('moment');
var request = require('request');
var router = express.Router();

var User = mongoose.model('User', require('../models/user.js'));
var config = require('../tools/config.json'); // Config
var environment = config[process.env.NODE_ENV || 'development']; // Environment

var Helpers = require("../tools/helpers.js");
var ensureAuthenticated = Helpers.ensureAuthenticated;
var log = Helpers.log;
var createJWT = Helpers.createJWT;

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
router.post('/signup', function (req, res) {

    var endPoint = '/auth/signup';
    var method = 'POST';

    if ((typeof req.body.email === 'undefined') || (typeof req.body.password === 'undefined') ||
        (typeof req.body.isBusiness === 'undefined') || (typeof req.body.isValid === 'undefined'))
        return log({message: 'Invalid parameters'}, {'status': 400, method : method, endPoint: endPoint}, req, res);

    User.findOne({ email: req.body.email }, function (err, existingUser) {
        
        if (existingUser)
            return log({message: 'Email is Already Taken'}, {'status': 409, method : method, endPoint: endPoint}, req, res);

        if ((typeof req.body.displayName === 'undefined'))
            return log({message: 'Invalid parameters'}, {'status': 400, method : method, endPoint: endPoint}, req, res);

        var user = new User({
            email: req.body.email,
            password: req.body.password,
            displayName: {
                firstName: req.body.displayName.firstName,
                middleName: req.body.displayName.middleName,
                lastName: req.body.displayName.lastName
            },
            isValid: false,
            isBusiness: req.body.isBusiness
        });

        // Setting up Recaptcha will ask the user to validate their account before access
        if (!environment.recaptcha)
            user.isValid = true;

        user.save(function(err, result) {

            if (err)
                return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

            // Setting up Mailchimp will add the new user to a Mailchimp list
            if (environment.mailchimp)
                return log({token : createJWT(result)}, {'status': 200, method : method, endPoint: endPoint}, req, res);

            var batch = [{ "email" : {"email" : req.body.email},
                "merge_vars" : {"fname" :  req.body.displayName.firstName,
                    "lname" :  req.body.displayName.lastName}
            }];

            var body = {
                "apikey": config.mailchimp.apikey,
                "id": config.mailchimp.list,
                "batch": batch,
                "double_optin": false,
                "update_existing": true
            };

            request.post({'url': 'https://us8.api.mailchimp.com/2.0/lists/batch-subscribe', 'form' : body, 'timeout' : 0, 'maxSockets' : Infinity},
                function (err, httpResponse, body) {

                    if (err)
                        return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

                    return log({token : createJWT(result)}, {'status': 200, method : method, endPoint: endPoint}, req, res);

                });

        });
    });
});

/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
router.post('/login', function (req, res) {

    var endPoint = '/auth/login';
    var method = 'POST';

    User.findOne({ email: req.body.email }, '+password', function (err, user) {
        
        if (!user)
            return log({message: 'Invalid Email and/or Password'}, {'status': 401, method : method, endPoint: endPoint}, req, res);

        if (err)
            return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

        user.comparePassword(req.body.password, function(err, isMatch) {
            
            if (!isMatch)
                return log({message: 'Invalid Email and/or Password'}, {'status': 401, method : method, endPoint: endPoint}, req, res);

            return log({token : createJWT(user)}, {'status': 200, method : method, endPoint: endPoint}, req, res);

        });
    });
});

/*
 |--------------------------------------------------------------------------
 | Validate Captcha
 |--------------------------------------------------------------------------
 */
router.post('/validate', ensureAuthenticated, function(req, res) {

    var endPoint = '/auth/validate';
    var method = 'POST';

    if (typeof req.body.value === 'undefined')
        return log({
            success: false
        }, {'status': 401, method : method, endPoint: endPoint}, req, res);

    var params = {
        secret : config.google.recaptcha.secret,
        response : req.body.value,
        remoteip : req.ip
    };

    request.post({url: config.google.recaptcha.uri, form: params, json: true}, function (err, response, body) {

        if (err)
            return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

        User.findById(req.user, function (err, user) {

            if (!user)
                return log({message: 'User not found'}, {'status': 400, method : method, endPoint: endPoint}, req, res);

            if (err)
                return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

            req.user = user;

            user.isValid = true;

            user.save(function(err) {

                if (err)
                    return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

                return log({
                    success: true
                }, {'status': 200, method : method, endPoint: endPoint}, req, res);

            });
        });

    });

});

module.exports = router;

// EOF
