'use strict';

var mysql = require('mysql');

var dbpool = mysql.createPool({
	host: 'localhost',
	port:3306,
	user:'ticketuser',
	password:'passw0rd',
	database:'ticketdb',
	connectionLimit:20,
	waitForConnections:false
});


exports.execute = function(req, res, callback){
	dbpool.getConnection(function(err,connection){
		callback(req,res,connection);
		connection.release();
	});
}
