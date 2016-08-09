/**
 * SINGLE MACHINE - /tools/helpers
 * (c) 2016
 */

var jwt = require('jwt-simple');
var moment = require('moment');

var config = require('../tools/config.json'); // Config
var environment = config[process.env.NODE_ENV || 'development']; // Environment
var logger = require('../tools/logger'); // Loggly Logger

Helpers = {

    /*
     |--------------------------------------------------------------------------
     | Ensure authenticated by matching JWT
     |--------------------------------------------------------------------------
     */
    ensureAuthenticated: function (req, res, next) {

        if (!req.header('Authorization')) {
            return res.status(401).send({message: 'Missing authorization'});
        }
        var token = req.header('Authorization').split(' ')[1];

        var payload = null;
        try {
            payload = jwt.decode(token, config.key);
        } catch (err) {
            return res.status(401).send({message: err.message});
        }

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: 'Token has expired'});
        }
        req.user = payload.sub;
        next();
    },

    /*
     |--------------------------------------------------------------------------
     | Generate JSON Web Token
     |--------------------------------------------------------------------------
     */
    createJWT : function (user) {

        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        };

        return jwt.encode(payload, config.key);
    },

    log : function(result, data, req, res) {

        // Logs and completes return for all API calls
        // log(users, {'status': 200, method : method, endPoint: endPoint}, req, res);

        if (!data)
            return res.status(500).end();

        // USER
        if ((!req.user) || (typeof req.user.id === 'undefined'))
           data.userId = 'unknown';
        else
            data.userId = req.user.id;

        // STATUS
        if ([500, 404, 403, 409, 400].indexOf(data.status) > -1)
            data.level = 'error';
        else
            data.level = 'success';

        // ENDPOINT
        data.endPoint = config.apiVersion + data.endPoint;

        // HEADERS
        data.headers = req.headers;

        if (environment.type == "development") {

            console.log(data);
            logger.log(data.level, data);
            return res.status(data.status).send(result);
        }
        else {

            console.log(data);
            logger.log(data.level, data);
            return res.status(data.status).send(result);
        }
    }
};

module.exports = Helpers;

// EOF
