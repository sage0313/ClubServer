//adminService.js
'use strict';

var base = require('./base');


exports.adminQuery = function(req, res){


	base.execute(req, res, function(req, res, conn){

		var query = " select * from item ";


		console.log("query="+query);


		conn.query(query,function(err, rows) {

			res.send(rows);

		});


	});	


};






