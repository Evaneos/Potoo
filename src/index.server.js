import express from 'express';
import errorParser from 'alouette';
const app = express();
const basicAuth = require('basic-auth');
const cookieParser = require('cookie-parser');
import argv from './server/argv';
const errorsParser = require('alouette');
import ErrorHtmlRenderer from 'alouette/lib/HtmlRenderer';
const errorHtmlRenderer = new ErrorHtmlRenderer();
import {webSocketPort} from './server/screenSocket'
import { ConsoleLogger, LogLevel } from 'nightingale';

import iframe from './server/views/Iframe'
import admin from './server/views/Admin'

const logger = new ConsoleLogger('watchme', LogLevel.ALL);
const port = argv.port || 3000;

process.on('uncaughtException', function(err) {
    try {
        errorsParser.log(err);
    } catch (err2) {
        console.error(err.stack);
        console.error(err2.stack);
    }
});

app.use(express.static(__dirname + '/../public'));

app.use(function(err, req, res, next) {
    errorsParser.log(err);
    console.log('ERRROR');
    if (argv.production) {
        res.status(500).send('Error: ' + err.message);
    } else {
        res.status(500).send(errorHtmlRenderer.render(err));
    }
});

app.listen(port, () => {
    logger.info('listening', { port: port });
});


app.get('/admin', function(req, res){
    res.end(admin({ hostname: req.hostname, webSocketPort }));
});

app.get('/:name*?', function(req, res){
    console.log(req.params.name);
    const name = decodeURIComponent(req.params.name);
    let url = 'http://www.evaneos.com';
    res.end(iframe({ hostname: req.hostname, webSocketPort, url }));
});