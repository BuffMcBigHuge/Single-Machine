/**
 * SINGLE MACHINE - /api/upload
 * (c) 2016
 */

'use strict';

var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var jwt = require('jwt-simple');
var multer = require('multer');
var upload = multer();
var moment = require('moment');

var mongoose = require('mongoose');
var User = mongoose.model('User', require('../models/user.js'));

var Helpers = require("../tools/helpers.js");
var ensureAuthenticated = Helpers.ensureAuthenticated;
var log = Helpers.log;

var config = require('../tools/config.json'); // Config
var environment = config[process.env.NODE_ENV || 'development']; // Environment

/*
 |--------------------------------------------------------------------------
 | POST /upload/user
 |--------------------------------------------------------------------------
 */
router.post('/user', ensureAuthenticated, upload.any(), function (req, res) {

    var endPoint = '/upload/user';
    var method = 'POST';

    var type = req.body.type;

    if ((typeof type === 'undefined') || ((type != 'image') && ((type != 'pdf'))) || 
        (typeof req.files === 'undefined') || (typeof req.files[0] === 'undefined'))
        return log({message: 'Invalid parameters'}, {'status': 400, method : method, endPoint: endPoint}, req, res);

    var data = req.files[0];

    if (typeof data === "undefined")
        return log({message: 'Invalid request'}, {'status': 403, method : method, endPoint: endPoint}, req, res);

    aws.config.update({accessKeyId: config.aws.access_key, secretAccessKey: config.aws.secret_key});
    var s3 = new aws.S3({signatureVersion: 'v4'});

    User.findById(req.user, function (err, user) {

        if (!user)
            return log({message: 'User not found'}, {'status': 400, method : method, endPoint: endPoint}, req, res);

        if (err)
            return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

        req.user = user;

        if ((typeof user.isValid === 'undefined') || (user.isValid === false) || (typeof user.id === 'undefined'))
            return log({message: ''}, {'status': 400, method : method, endPoint: endPoint}, req, res);
            
        var pid = '10000' + parseInt(Math.random() * 10000000);
        var file = "https://" + config.aws.s3_bucket + ".s3.amazonaws.com/" + user.id + '/' + pid;
        var url = "/u/" + user.id + '/' + pid;

        var s3_params = {
            Bucket: config.aws.s3_bucket,
            Key: user.id + "/" + pid,
            ContentType: data.mimetype,
            ACL: "public-read",
            Body: data.buffer
        };

        return s3.putObject(s3_params, function (err, data) {

            if (err)
                return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

            var upload = {
                "type" : type,
                "file" : file
            };
            
            if (typeof user.uploads === 'undefined')
                user.uploads = [upload];
            else
                user.uploads.push(upload);

            user.save(function(err) {

                if (err)
                    return log(err, {'status': 500, method : method, endPoint: endPoint}, req, res);

                return log({
                    status: 200,
                    success: true,
                    message: 'Uploaded',
                    data : url
                }, {'status': 200, method : method, endPoint: endPoint}, req, res);

            });
        });

    });

});

module.exports = router;

// EOF
