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

        // log(users, {'status': 200, method : method, endPoint: endPoint}, req, res);

        if (!data)
            return res.status(500).end();

        // USER
        if ((!req.user) || (typeof req.user.id === 'undefined'))
            data.userId = null;
        else
            data.userId = req.user.id;

        // STATUS

        // 500 Internal Server Error
        // 404 Not Found
        // 403 Forbidden
        // 409 Conflict
        // 400 Bad Request

        if (!data.status) {
            data.status = 'unknown';
            data.level = 'unknown';
        }
        else if (data.status >= 500) {
            data.status = data.status.toString();
            data.level = 'error';
        }
        else if ([404, 403, 409, 400].indexOf(data.status) > -1) {
            data.status = data.status.toString();
            data.level = 'warn';
        }
        else {
            try {
                data.status = data.status.toString();
            } catch(e) {}
            data.level = 'success';
        }

        // ENDPOINT
        data.endPoint = config.apiVersion + data.endPoint;

        // HEADERS
        // data.headers = req.headers;

        // MESSAGE
        if (!result)
            data.message = data.level;
        else if ((typeof result !== 'undefined') && (result.message))
            data.message = result.message;
        else if ((typeof result !== 'undefined') && (typeof result.data !== 'undefined') && (result.data.message))
            data.message = result.message;
        else
            data.message = data.level;

        if (environment.type === "development") {
            if ((data.level === 'error') || (data.level === 'warn')) {
                console.log(data.status, data.message, data.method + ': ' + data.endPoint);
                console.log(result);
            }
            else {
                console.log(data.status, data.message, data.method + ': ' + data.endPoint);
            }
            return res.status(data.status).send(result);
        }
        else {
            if (data.level === 'error') {
                console.log(data.status, data.message, data.method + ': ' + data.endPoint);
                console.log(result);
            }
            else {
                console.log(data.status, data.message, data.method + ': ' + data.endPoint);
            }

            logger.log(data.message, data);

            return res.status(data.status).send(result);
        }

    }
};

module.exports = Helpers;

// EOF
