// userDao.js
'use strict';

var base = require('../base');

exports.signcheck = function(userid, userpwd, conn, callback){
	var query = " select id, userid, username, role from user where userid = "+conn.escape(userid)+ " and userpwd = password("+conn.escape(userpwd)+") ";
	console.log("query="+query);

	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});
};

exports.selectUserById = function(id, conn, callback){
	var query = " select id, userid, username, role from user where id = "+conn.escape(id)+ " ";
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});	
};


exports.insertUser = function(userinfo, conn, callback){
	var query = " insert into user (userid, username, userpwd, role)  values(" + conn.escape(userinfo.userid) +" , " + conn.escape(userinfo.username) + " , password("+ conn.escape(userinfo.userpwd) + "), " + conn.escape(userinfo.role)+" ) ";

	conn.query(query, function(err, rows, fields){
		callback(err, rows);
	});
};

exports.updateUserName = function(userinfo, conn, callback){ 
	var query = " update user set  username = "+conn.escape(userinfo.username) + " where id = "+ conn.escape(userinfo.id) + " " ;

	conn.query(query, function(err, rows, fields){
		callback(err,rows);
	});
};

exports.updateUserPwd = function(userinfo, conn, callback){
	var query = " update user set userpwd = password("+ conn.escape(userinfo.newpwd)+") where id="+ conn.escape(userinfo.id) +" and userpwd = password("+conn.escape(userinfo.oldpwd)+ ") " ;

	conn.query(query, function(err, rows, fields){
		callback(err, rows);
	});
};