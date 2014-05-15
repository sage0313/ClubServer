// userDao.js
'use strict';

var base = require('../base');
// Role Setting
// ready = just sign up (don't allow to sign in)
// user = user (sign in and udpate db)
// admin = admin 

exports.signcheck = function(userid, userpwd, conn, callback){
	var userid = conn.escape(userid);
	var userpwd = conn.escape(userpwd);
	var query = " select id, userid, username, role from user "
	+" where userid = "+userid+ " and userpwd = password("+userpwd+")  ";
	
	console.log("query="+query);
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});
};

exports.selectUserById = function(uid, conn, callback){
	var id = conn.escape(uid);
	var query = " select id, userid, username, role from user where id = "+id+ " ";

	console.log("query=",query);
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});	
};

exports.selectUserByName = function(uname, conn, callback){
	var name = conn.escape('%'+uname+'%');
	var query = " select id, userid, username, role from user where username like "+name+ " ";
	query += " union select id, userid, username, role from user where userid like "+name+" "; 

	console.log("query=",query);
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});	
};

exports.insertUser = function(userinfo, conn, callback){
	var userid = conn.escape(userinfo.userid);
	var username = conn.escape(userinfo.username);
	var userpwd = conn.escape(userinfo.userpwd);
	var userrole = conn.escape('ready'); //conn.escape(userinfo.role);
	var query = " insert into user (userid, username, userpwd, role) "
	+ " values(" + userid +" , " + username + " , password("+ userpwd + "), " + userrole+" ) ";

	console.log("query="+query);
	conn.query(query, function(err, rows, fields){
		callback(err, rows);
	});
};

exports.updateUserName = function(userinfo, conn, callback){ 
	var username = conn.escape(userinfo.username);
	var id = conn.escape(userinfo.id);
	var query = " update user set  username = "+ username+" where id = "+id+" " ;

	console.log("query="+query);
	conn.query(query, function(err, rows, fields){
		callback(err,rows);
	});
};

exports.updateUserPwd = function(userinfo, conn, callback){
	var newpwd = conn.escape(userinfo.newpwd);
	var id = conn.escape(userinfo.id) ;
	var oldpwd = conn.escape(userinfo.oldpwd);

	var query = " update user set userpwd = password("+newpwd+") where id="+id+" and userpwd = password("+oldpwd+ ") " ;

	console.log("query="+query);
	conn.query(query, function(err, rows, fields){
		callback(err, rows);
	});
};

exports.updateUserRole = function(userinfo, conn , callback){
	var id = conn.escape(userinfo.id);
	var fromrole = conn.escape(userinfo.fromrole);
	var torole = conn.escape(userinfo.torole);
	var query 
	var query = " update user set role = "+torole+" where id="+id+" and role = "+fromrole+ " " ;

	console.log("query="+query);
	conn.query(query, function(err, rows, fields){
		callback(err, rows);
	});
}