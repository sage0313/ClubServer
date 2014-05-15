//adminService.js
'use strict';

var base = require('./base');
var userDao = require('./dao/userDao');

exports.adminQuery = function(req, res){


	base.executeRest(req, res, function(err, req, res, conn){
		if (err) {
			res.send({"status":"error","error":err});		
		} else {
			var query = " select * from item ";
			console.log("query="+query);
			conn.query(query,function(err, rows) {
				res.send(rows);
			});
		}
	});	


};


exports.searchUser = function(req, res){
	base.executeRest(req, res, function(err, req, res, conn){
		if (err) {
			res.send({"status":"error","error":err});		
		} else {
			var uname = req.query.name;
			userDao.selectUserByName(uname, conn, function(err, rows){
				res.send(rows);
			});
		}
	});
};


exports.changeUserRole = function(req,res){
	base.executeRest(req, res, function(err, req, res, conn){
		if (err) {
			res.send({"status":"error","error":err});		
		} else {
			var userinfo = {
				id:req.body.id,
				fromrole:req.body.fromrole,
				torole:req.body.torole
			};
			userDao.updateUserRole(userinfo, conn, function(err, rows){
				res.send(rows);
			});
		}
	});	
};



