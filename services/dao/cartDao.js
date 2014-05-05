//cartDao.js

'use strict';

var base = require('../base');

exports.selectCartById = function(idarg, conn, callback){
	var cid = conn.escape(idarg);
	var query = "select emp_id, user_id, msg, timestamp from cart where id = "+ cid;
	console.log("query="+query);
	conn.query(query,function(err, rows, fields) {
		callback(err, rows);
	});	
}

exports.insertCart = function(cartarg, conn, callback) {
	var emp_id = conn.escape(cartarg.emp_id);
	var user_id = conn.escape(cartarg.user_id);
	var msg = conn.escape(cartarg.msg);
	var timestamp = Math.round(+new Date()/1000);

	var query = "insert into cart(emp_id, user_id, msg, timestamp) "
			  + "values( "+emp_id+","+user_id+","+msg+","+timestamp+");";
	console.log("query="+query);

	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});
}