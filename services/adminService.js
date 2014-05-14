//adminService.js
'use strict';

var base = require('./base');
var userDao = require('./dao/userDao');

exports.adminQuery = function(req, res){


	base.execute(req, res, function(req, res, conn){

		var query = " select * from item ";


		console.log("query="+query);


		conn.query(query,function(err, rows) {
			res.send(rows);

		});
	});	


};


exports.searchUser = function(req, res){
	base.execute(req, res, function(req, res, conn){
		var uname = req.query.name;
		userDao.selectUserByName(uname, conn, function(err, rows){
			res.send(rows);
		});
	});
};


exports.changeUserRole = function(req,res){
	base.execute(req, res, function(req, res, conn){
		var userinfo = {
			id:req.body.id,
			fromrole:req.body.fromrole,
			torole:req.body.torole
		};
		userDao.updateUserRole(userinfo, conn, function(err, rows){
			res.send(rows);
		});
	});	
}



