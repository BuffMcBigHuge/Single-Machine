/**
 * SINGLE MACHINE - /api/user
 * (c) 2016
 */

'use strict';

var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var express = require('express');
var moment = require('moment');
var path = require('path');
var _ = require('underscore');
var router = express.Router();

var User = mongoose.model('User', require('../models/user.js'));
var config = require('../tools/config.json'); // Config

var Helpers = require("../tools/helpers.js");
var ensureAuthenticated = Helpers.ensureAuthenticated;
var log = Helpers.log;

var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');

/*
 |--------------------------------------------------------------------------
 | GET /user/me
 |--------------------------------------------------------------------------
 */
router.get('/me', ensureAuthenticated, function (req, res) {

    var endPoint = '/user/me';
    var method = 'GET';

    User.findById(req.user, function (err, user) {

        if (err)
            return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

        if (!user)
            return log({message: 'User not found'}, {'status': 400, method : method, endPoint: endPoint}, req, res);

        req.user = user;

        return log(user, {'status': 200,  method : method, endPoint: endPoint}, req, res);
    });
});

/*
 |--------------------------------------------------------------------------
 | PUT /user/me
 |--------------------------------------------------------------------------
 */
router.put('/me', ensureAuthenticated, function (req, res) {

    var endPoint = '/user/me';
    var method = 'PUT';

    User.findById(req.user, function (err, user) {

        if (!user)
            return log({message: 'User not found'}, {'status': 400, method : method, endPoint: endPoint}, req, res);

        if (err)
            return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

        req.user = user;

        user.displayName = req.body.displayName || user.displayName;
        user.email = req.body.email || user.email;
        user.picture = req.body.picture || user.picture;
        user.bioSummary = req.body.bioSummary || user.bioSummary;

        user.save(function (err) {
            
            if (err)
                return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

            return log(user, {'status': 200, method : method, endPoint: endPoint}, req, res);
        });

    });

});

/*
 |--------------------------------------------------------------------------
 | GET /user/profile/:userId
 |--------------------------------------------------------------------------
 */
router.get('/profile/:userId', function (req, res) {

    var endPoint = '/user/profile/:userId';
    var method = 'GET';

    User.find({id : req.params.userId}, function(err, users){

        if (err)
            return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

        if (users.length === 0)
            return log({message: 'User not found'}, {'status': 400, method : method, endPoint: endPoint}, req, res);

        var userProfile = users[0];

        return log(userProfile, {'status': 200, method : method, endPoint: endPoint}, req, res);

    });
});

/*
 |--------------------------------------------------------------------------
 | GET /user/all
 |--------------------------------------------------------------------------
 */
router.get('/all', ensureAuthenticated, function(req, res) {
    
    var endPoint = '/user/all';
    var method = 'GET';

    User.find({isValid : true}, function(err, users){

        if (err)
            return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

        return log(users, {'status': 200, method : method, endPoint: endPoint}, req, res);
    });
    
});

/*
 |--------------------------------------------------------------------------
 | POST /user/password-forgot   request password reset
 |--------------------------------------------------------------------------
 */
router.post('/password-forgot', function(req,res) {

    var endPoint = '/password-forgot';
    var method = 'POST';

    if (typeof req.body.email === 'undefined')
        return log({message: 'Invalid parameters'}, {'status': 400, method : method, endPoint: endPoint}, req, res);

    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                
                if (err)
                    return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done){

            User.findOne({email: req.body.email}, function(err,user) {
                
                if (!user)
                    return log({message: 'No account with that email address'}, {'status': 400, method : method, endPoint: endPoint}, req, res);

                if (err)
                    return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() +3600000;

                user.save(function(err){
                    
                    if (err)
                        return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

                    req.user = user;

                    done(err, token);
                })
            })
        },
        function(token) {
            
            var email = req.body.email;

            var transporter = nodemailer.createTransport( {
                service: "Gmail",
                auth : {
                    user : config.google.mail.user,
                    pass: config.google.mail.pass
                }
            });

           /* var templateDir = path.join(__dirname, '../views/request-password-reset');*/

            var html = "Hello "+req.user.displayName.firstName+"!"+"<br><br>"
                + "You have requested to reset your password with the email: "+email+"<br><br>"
                + "<a href='http://"+req.headers.host + '/reset-password/' + token+"'>"+"Click to Reset Password"+"</a>"+"<br><br>"
                + "If you did not request to reset your password, please disregard this email.<br><br>"
                + "- Simple Machine";

            var mailOptions = {
                to: email,
                subject: 'Password Reset Confirmation ✔ 👥',
                html: html
            };

            transporter.sendMail(mailOptions, function(err){
                
                if (err)
                    return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

                return log({message : 'Successful'}, {'status': 200, method : method, endPoint: endPoint}, req, res);
            });

        }
    ], function(err) {
        
        if (err)
            return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);
    });

});

/*
 |--------------------------------------------------------------------------
 | POST /user/reset-password/:token
 |--------------------------------------------------------------------------
 */
router.post('/reset-password/:token',function (req,res){

    var endPoint = '/rest-password';
    var method = 'POST';

    async.waterfall([
       function(done) {
           User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }},function(err,user){
               
               if (!user)
                   return log({message: 'Password reset token is invalid or has expired'}, {'status': 400, method : method, endPoint: endPoint}, req, res);
               
               if (err)
                   return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

               user.password = req.body.password;
               user.resetPasswordToken = undefined;
               user.resetPasswordExpires = undefined;

               user.save(function(err) {
                   
                   if (err)
                       return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);
                   
                   done(err,user);
                   
               });
           })

       },
       function(user) {

           var transporter = nodemailer.createTransport( {
               service: "Gmail",
               auth : {
                   user : config.google.mail.user,
                   pass: config.google.mail.pass
               }
           });
           
           var html = 'Hello,'+ user.displayName.firstName + '<br>'
               +'This is a confirmation that the password for your account has just been changed.\n';

           var mailOptions = {
               to: user.email,
               subject: 'Password Reset Successfully ✔ 👥',
               html: html
           };

           transporter.sendMail(mailOptions, function(err, info){

               if (err)
                   return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);
               
               return log({message : 'Successful'}, {'status': 200, method : method, endPoint: endPoint}, req, res);
           });

       }
   ], function(err) {
        
        return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

    });
    
});

module.exports = router;

// EOF
