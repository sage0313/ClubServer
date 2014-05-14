//userService.js
'use strict';

var base = require('./base');
var userDao = require('./dao/userDao');


exports.signin = function(req, res){
	base.execute(req,res, function(req, res, conn){
		var userid = req.body.userid;
		var userpwd = req.body.userpwd;
		if(userid==null || userpwd==null){
			res.send({"status":"error","error":"check your id or password."});
		}

		userDao.signcheck(userid, userpwd, conn, function(err, rows){
			if(err){					
				res.send({"status":"error","error":""+err});
			}
			if(rows.length===1){
				if(rows[0].role=="ready"){
					res.send({"status":"error","error":"check your permission."});
				}else{
					req.session.loginUser = rows[0];
					res.send({"status":"success"});
				}
			}else{
				res.send({"status":"error","error":"check your id or password."});
			}
		});	
	});
};

exports.signout = function(req, res){
	req.session.loginUser = null; 
	res.send({"status":"success"});
};

exports.signup = function(req, res){
	base.execute(req,res, function(req, res, conn){
		var user = {userid: req.body.userid, 
			username:req.body.username, 
			userpwd:req.body.userpwd};

			console.log(user);
			userDao.insertUser(user, conn, function(err, rows) {
				console.log(rows);
				if(err){
					res.send({"status":"error","error":""+err});
				}
				if(rows){
					res.send({"status":"success"});
				}
			});
		});
};

exports.getSigninUser = function(req, res){
	res.send(req.session.loginUser);
};


exports.getUser = function(req, res){
	base.execute(req,res, function(req, res, conn){
		userDao.selectUserById(req.params.uid, conn, function(err, rows){
			console.log(rows);
			if(err){
				res.send({"status":"error","error":""+err});
			}
			if(rows){
				res.send({"status":"success","ret":rows});
			}
		});
	});
};

exports.isAdmin = function(req, res){
	if(req.session.loginUser!=null){
		if(req.session.loginUser.role==="admin"){
			return true; 
		}
	}
	return false;
};