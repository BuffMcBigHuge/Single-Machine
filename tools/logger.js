/**
 * SINGLE MACHINE - /tools/logger
 * (c) 2016
 */

var loggly = require('loggly');
var fs = require('fs'); // File system library
var config = require('../tools/config.json'); // Config
var environment = config[process.env.NODE_ENV || 'development']; // Environment

var alsoLogToConsole = true;

var logger = (function (){

    var client = loggly.createClient({
        token: config.loggly.token,
        subdomain: config.loggly.subdomain,
        json: true,
        tags: [config.appName]
    });

    return {

        log: function (logString, extraLogData) {

            var date = new Date();
            var body;
            var type = 'log';

            body = {
                'message': logString,
                'appName': config.appName,
                'appVersion': config.appVersion,
                'timeStamp': date,
                'type': type
            };

            if (typeof extraLogData !== 'undefined') {
                for (var attribute in extraLogData) {
                    body[attribute] = extraLogData[attribute];
                }
            }

            if (alsoLogToConsole)
                console.log(logString);

            if (environment.loggly) {

                client.log(body, function (err, result) {

                    if (err)
                        console.log("Loggly Error: " + JSON.stringify(err));

                });
            }
        }
    }

})();

module.exports = logger;

// EOF
