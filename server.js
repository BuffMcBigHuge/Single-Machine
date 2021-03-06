/**
 * SINGLE MACHINE Server
 * (c) 2018
 */

'use strict';

/**
 *        _           __                     __   _
 *   ___ (_)__  ___ _/ /__   __ _  ___ _____/ /  (_)__  ___
 *  (_-</ / _ \/ _ `/ / -_) /  ' \/ _ `/ __/ _ \/ / _ \/ -_)
 * /___/_/_//_/\_, /_/\__/ /_/_/_/\_,_/\__/_//_/_/_//_/\__/
 *            /___/
 *
 *    App: Single Machine v1.1
 *    Engineer: Marco Domenico Tundo - marco@bymar.co
 *    Web: http://singlemachine.bymar.co
 *
*/

var bodyParser = require('body-parser');
var express = require('express');
var jwt = require('jwt-simple');
var sm = require('sitemap');
var cors = require('cors');
var fs = require('fs');

var auth = require('./api/auth.js');
var user = require('./api/user.js');
var upload = require('./api/upload.js');

var config = require('./tools/config.json'); // Config
var environment = config[process.env.NODE_ENV || 'development']; // Environment
var logger = require('./tools/logger'); // Loggly Logger

/**
 |--------------------------------------------------------------------------
 | EXPRESS
 |--------------------------------------------------------------------------
 */
var app = express();

app.set('port', environment.port);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.disable('x-powered-by');

/**
 |--------------------------------------------------------------------------
 | ENDPOINTS
 |--------------------------------------------------------------------------
 */
app.use(config.apiVersion + '/auth', auth);
app.use(config.apiVersion + '/user', user);
app.use(config.apiVersion + '/upload', upload);

/**
 |--------------------------------------------------------------------------
 | Expiry
 |--------------------------------------------------------------------------
 */
app.get('/*', function (req, res, next) {
    if (req.url.indexOf("/stylesheets/") >= 0) {
        res.setHeader("Cache-Control",  "max-age=0, no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
    }
    if ((req.url.indexOf("/images/")) >= 0) {
        res.setHeader("Cache-Control", "public, max-age=604800");
        res.setHeader("Expires", new Date(Date.now() + 604800000).toUTCString());
    }
    next();
});

/**
 |--------------------------------------------------------------------------
 | S3
 |--------------------------------------------------------------------------
 */
app.get('/u/:id/:pid', function(req, res) {
    var link = "https://"+config.aws.s3_bucket+".s3.amazonaws.com/"+req.params.id+"/"+req.params.pid;
    res.redirect(link);
});

/**
 |--------------------------------------------------------------------------
 | HTTPS
 |--------------------------------------------------------------------------
 */
app.use(express.static('views'));
app.set('views', __dirname + '/views');

if (environment.type === 'production') {

    // Redirect to HTTPS

    app.use(function (req, res, next) {
        if ((!req.connection.encrypted) && (req.get('X-Forwarded-Proto') !== 'https') && (req.url != '/healthcheck') && (req.url != (config.apiVersion + 'peerjs')))
            res.redirect('https://' + req.get('Host') + req.url);
        else
            next();
    });
}

/**
 |--------------------------------------------------------------------------
 | SITEMAP
 |--------------------------------------------------------------------------
 */
var sitemap = sm.createSitemap ({
    hostname: environment.hostname,
    cacheTime: 600000,        // 600 sec - cache purge period
    urls: [
        { url: '/',  changefreq: 'weekly', priority: 1.0 },
        { url: '/images/logo/logo_large.png', caption: 'SINGLE MACHINE Logo'}/*,
        { url: '/page',  changefreq: 'weekly',  priority: 0.9 },
        { url: '/other-page', changefreq: 'weekly',  priority: 0.9}*/
    ]
});

/**
 |--------------------------------------------------------------------------
 | MANIFEST
 |--------------------------------------------------------------------------
 */
app.get('/manifest.json', function(req, res) {
    res.send(fs.readFileSync('./tools/manifest.json'));
});

/**
 |--------------------------------------------------------------------------
 | ROBOTS.TXT
 |--------------------------------------------------------------------------
 */
app.get('/robots.txt', function(req, res) {
    res.send(fs.readFileSync('./tools/robots.txt'));
});

/**
 |--------------------------------------------------------------------------
 | VIEWS
 |--------------------------------------------------------------------------
 */
app.use(express.static('app'));
app.set('views', __dirname + '/app');
app.set('view engine', 'ejs');

app.get('/sitemap.xml', function(req, res) {
    sitemap.toXML( function (err, xml) {
        if (err)
            return res.status(500).end();
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    });
});

app.get('/healthcheck', function(req, res) {
    res.render('healthcheck.ejs');
});

if (config.maintenance) {
    // Redirect to maintenance
    app.get('/*', function (req, res) {
        res.render('maintenance.ejs');
    });
}
else {
    app.get('/*', function (req, res) {
        res.render('main.ejs');
    });
}

/**
 |--------------------------------------------------------------------------
 | START
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), function() {
    console.log('SINGLE MACHINE listening on port ' + app.get('port'));
}).on('error', function (err) {
    console.log(JSON.stringify(err));
});

// EOF
