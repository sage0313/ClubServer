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

exports.selectItemsInCartsByEmployee = function(eidarg, conn, callback){
	var eid = conn.escape(eidarg);
	var query =" select c.id cart_id, c.emp_id, emp_id, c.user_id user_id, c.msg msg, c.timestamp tmstmp ";
	query += " , i.id item_id, i.name item_name, i.description item_desc, i.type item_type, i.money item_money ";
	query += " , ic.spend_count cnt  ";
	query += "  from cart c , item i, item_in_cart ic ";
	query += "  where c.emp_id=" + eid;
	query += "  and c.id = ic.cart_id ";
	query += "  and ic.item_id = i.id ";

	console.log(query);
	
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});
}