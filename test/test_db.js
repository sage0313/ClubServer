
/**
 * Module dependencies.
 */


 'use strict';

 var mysql = require('mysql');

 var connection = mysql.createConnection({
 	host: 'localhost',
 	port: 3306,
 	user: 'ticketuser',
 	password: 'passw0rd',
 	database: 'ticketdb'
 });



 var query = connection.query('show tables',function(err,rows){
 	console.log(rows);
	//res.json(rows);

	process.exit(1);
});


