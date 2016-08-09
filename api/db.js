/**
 * SINGLE MACHINE - /api/db
 * (c) 2016
 */

'use strict';

var mongoose = require('mongoose');
var config = require('../tools/config.json'); // Config
var environment = config[process.env.NODE_ENV || 'development']; // Environment

/**
 |--------------------------------------------------------------------------
 | DATABASE
 |--------------------------------------------------------------------------
 */
var options = {
    server: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS: 30000
        },
        auto_reconnect: true
    },
    replset: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS : 30000
        }
    }
};

var connection = mongoose.connection;

connection.on('connecting', function() {
    console.log('Connecting to MongoDB...');
});

connection.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

connection.on('connected', function() {
    console.log('MongoDB connected!');
});

connection.once('open', function() {
    console.log('MongoDB connection opened!');
});

connection.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});

connection.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    mongoose.connect(environment.mongo.uri, options);
});

mongoose.connect(environment.mongo.uri, options);

connection.on('error', function(err) {
    console.log('Error: Could not connect to MongoDB.'.red);
});

module.exports = mongoose;

// EOF
