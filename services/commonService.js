'use strict';


var DBService = require('./DBService');

exports.findUserById = function(req, res) {
	var userid = req.params.uid;
	console.log('[findUserById] userid' + userid);
	if (!userid) {
		res.send({'error':'wrong input'});
		return;
	}
	DBService.loadUser(userid, function(err, userinfo) {
		if (err) {
			res.send({'error': err});
		} else {
			res.send(userinfo);
		}	
	});
};

exports.addUser = function(req, res) {
	var user = req.body;
	console.log('[addUser] Info: ' + JSON.stringify(user));

	if (!user) {
		res.send({'error':'wrong input'});
		return;
	}

	DBService.addUser(user, function(err, userinfo) {
		if (err) {
			res.send({'error': err});
		} else {
			res.send(userinfo);
		}	
	});
};


/*

exports.updateUser = function(req, res) {
	var userID = req.params.id;
	console.log('[deleteUserById] gwID' + userID);
	if (!userID) {
		res.send({'error':'wrong input'});
		return;
	}
	return;
};


*/



exports.deleteUser = function(req, res) {
	var userid = req.params.uid;
	console.log('[deleteUserById] userid: ' + userid);
	DBService.deleteUser(userid, function(err, userinfo) {
		if (err) {
			res.send({'error': err});
		} else {
			res.send(userinfo);
		}	
	});
};



exports.login = function(req, res) {
	var userid = req.body.uid;
	var passwd = req.body.pwd;
	console.log('[login] userid: ' + userid);
	console.log('[login] passwd: ' + passwd);	

	if (!userid) {
		res.send({'error':'wrong input'});
		return;
	}

	DBService.loginUser(userid, passwd, function(err, userinfo) {
		if (err) {
			res.send({'error': err});
		} else {
			res.send(userinfo);
		}	
	});
};