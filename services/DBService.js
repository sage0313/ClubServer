'use strict';

var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'CLUBDB'
});

connection.connect(function(err) {
	if (err) {
		console.log('mysql connection error: ' + err);
		throw err;
	}
});

exports.loadUser = function(userid, callback) {
	var query="select USERID, PASSWD from ACCOUNT where USERID='"+userid+"';";
	console.log('query: ' + query);
	connection.query( query, function(err, rows, fields)
	{	
		if(err)
		{
			console.log('load userinfo err: ' + err);
		}
		callback(err, rows);
	});	
}

exports.addUser = function(user, callback) {

	var query="insert into ACCOUNT(USERID, PASSWD) values('"+user.userid+"', '"+user.passwd+"');";
	console.log('query: ' + query);
	connection.query( query, function(err, rows, fields)
	{	
		if(err)
		{
			console.log('add userinfo err: ' + err);
		}
		callback(err, rows);
	});
}

exports.deleteUser = function(userid, callback) {

	var query="delete from ACCOUNT where USERID='"+userid+"';";
	console.log('query: ' + query);
	connection.query( query, function(err, rows, fields)
	{	
		if(err)
		{
			console.log('delete userinfo err: ' + err);
		}
		callback(err, rows);
	});
}

exports.loginUser = function(userid, passwd, callback) {

	var query="select USERID, PASSWD from ACCOUNT where USERID='"+userid+"' and PASSWD='"+passwd+"';";
	console.log('query: ' + query);
	connection.query( query, function(err, rows, fields)
	{	
		if(err)
		{
			console.log('login err: ' + err);
		}
		callback(err, rows);
	});
};


 