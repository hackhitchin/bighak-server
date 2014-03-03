/**
 * Module dependencies.
 */

var express = require('express');
var hoganexpress = require('hogan-express');
var routes = require('./routes');
var dashboard = require('./routes/dashboard');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require("mongoose");

var app = express();

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/bighak';

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.engine('html', hoganexpress);
app.set('layout', 'base'); //use layout.html as the default layout
app.set('view engine', 'html');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({
    key: 'bighak.sess',
    secret: process.env["BIGHAK_SESSION_SECRET"],
    cookie: {
        maxAge: 2678400000 // 31 days
    }
}));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/program', routes.keypad);

app.post('/create', routes.create);

app.get('/users', user.list);

app.get('/dashboard', dashboard.list);

app.get(/\/dashboard\/send\/[a-fA-F0-9]{24}/, dashboard.send);

mongoose.connect(mongoUri);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
