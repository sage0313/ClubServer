'use strict';

var mysql = require('mysql');

var dbpool = mysql.createPool({
	host: 'localhost',
	port:3306,
	user:'ticketuser',
	password:'passw0rd',
	database:'ticketdb',
	connectionLimit:20,
	waitForConnections:true
});

exports.executeRest = function(req, res, callback){	
	dbpool.getConnection(function(err,connection){
		callback(err, req, res, connection);
		if (connection) {
			connection.release();
		}
	});
};

exports.executeFile = function(data, callback){	
	dbpool.getConnection(function(err,connection){
		callback(err, data, connection);
		if (connection) {
			connection.release();
		}
	});
};