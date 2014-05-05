

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

 // Services
 var userService = require('./services/userService');
 var employeeService = require('./services/employeeService');
 var itemService = require('./services/itemService');
 var cartService = require('./services/cartService');
 var notificationService = require('./services/notificationService');
 
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
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());

// for session (it should be before methodOverride)
app.use(express.cookieParser());
app.use(express.session({ secret: "keyboard cat" }));

app.use(express.methodOverride());
app.use(express.cookieDecoder());
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
// if ('development' === app.get('env')) {
  // app.use(express.errorHandler());
// }

app.get('/', function(req,res){
	console.log(req.session);
	if(req.session.loginUser==null){
		res.sendfile(__dirname+'/public/login.html');
	}else{
		res.sendfile(__dirname+'/public/index.html');		
	}
});

/********************
 * user
 ********************/
 app.post('/user/signin', function(req, res) {
 	userService.signin(req, res);
 });

 app.get('/user/signout', function(req, res) {
 	userService.signout(req, res);
 });

 app.post('/user/signup', function(req, res) {
 	userService.signup(req, res);
 });

 app.get('/user/signinuser', function(req, res){
 	userService.getSigninUser(req,res);
 });

 app.get('/user/:uid', function(req, res) {
 	userService.getUser(req, res);
 });

 app.get('/user/:uid/cart', function(req, res) {
 	userService.getUserCart(req, res);
 });

 // app.put('/user/:uid', function(req, res) {
 // 	userService.updateUser(req, res);
 // });

 // app.delete('/user/:uid', function(req, res) {
 // 	commonService.deleteUser(req, res);
 // });


/********************
 * employee
 ********************/
 app.get('/employee/:uid', function(req,res){
 	employeeService.getEmployee(req,res);
 });

 app.get('/employee', function(req,res){
 	employeeService.searchEmployee(req,res);
	// TODO dev
});




/********************
 * item
 ********************/
 app.get('/item', function(req,res){
 	itemService.getItems(req,res);
	// TODO dev 
});

 app.get('/item/:uid', function(req,res){
 	itemService.getItem(req,res);
	// TODO dev 
});

/********************
 * cart
 ********************/
 app.get('/cart/:cid', function(req,res){
 	cartService.getCart(req,res);
	// TODO dev
});
 app.post('/cart', function(req,res){
 	cartService.createCart(req,res);
	// TODO dev
});

/********************
 * notification
 ********************/
 app.get('/notification/:nid',function(req,res){
 	notificationService.getNotification(req,res);
	// TODO dev
});
 app.get('/notification', function(req,res){
 	notificationService.getNotificationsByLoginUser(req,res);
	// TODO dev
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

