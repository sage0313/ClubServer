

/**
 * Module dependencies.
 */

'use strict';

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mysql = require('mysql');
var commonService = require('./services/commonService');
var app = express();

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'admin',
	password: 'admin12345',
	database: 'familypicnicDB'
});



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

/********************
 * user
 ********************/

app.get('/user/:uid', function(req, res) {
	commonService.findUserById(req, res);
});

app.post('/user', function(req, res) {
	commonService.addUser(req, res);
});

app.put('/user/:uid', function(req, res) {
	commonService.updateUser(req, res);
});

app.delete('/user/:uid', function(req, res) {
	commonService.deleteUser(req, res);
});

app.post('/user/login', function(req, res) {
	commonService.login(req, res);
});



// clean up 
var cleanup = function() {
	console.log('cleanup');

};

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/HelloWebServer',function(req, res){
	res.send('Hello Web Server.');
});


process.on('SIGTERM', function() {
	server.close(function() {
		cleanup();
		process.exit();
	});
	setTimeout(function(){ process.exit(); }, 5000);
});
process.on('SIGINT', function() {
	server.close(function() {
		cleanup();
		process.exit();
	});
	setTimeout(function(){ process.exit(); }, 5000);
});

