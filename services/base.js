'use strict';

var mysql = require('mysql');

var dbpool = mysql.createPool({
	host: 'localhost',
	port:3306,
	user:'root',
	password:'root',
	database:'ticketdb',
	connectionLimit:20,
	waitForConnections:false
});



exports.execute = function(req, res, callback){	
	if(typeof callback === "undefined"){
		callback = res;
		dbpool.getConnection(function(err,connection){
			callback(req, connection);
			connection.release();
		});
	} else {
		dbpool.getConnection(function(err,connection){
			callback(req, res, connection);
			connection.release();
		});
	}

};