
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

 var query;
 process.argv.forEach(function(val, index, array){
 	if(index==2){
 		query = val;
 	}
 });

 console.log("query=["+query+"]");
 if(typeof query=='undefined'){
 	console.log("query string is required by arguments" );
 	process.exit(1);
 }




 var query = connection.query(query,function(err,rows){
 	console.log(rows);
	//res.json(rows);

	process.exit(1);
});


