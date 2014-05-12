//cartDao.js

'use strict';

var base = require('../base');

exports.insertCart = function(cartarg, conn, callback) {
	var emp_id = conn.escape(cartarg.emp_id);
	var user_id = conn.escape(cartarg.user_id);
	var msg = conn.escape(cartarg.msg);

	var query = "insert into cart(emp_id, user_id, msg) " + 
				"values( "+emp_id+","+user_id+","+msg+");";
	console.log("query="+query);

	conn.query(query,function(err, rows) {
		// console.log('query result err:' + err);
		// console.log('query result rows:' + JSON.stringify(rows));
		callback(err,rows);
	});
};

exports.insertItemInCart = function(itemargs, conn, callback) {
	var cart_id = conn.escape(itemargs.cart_id);
	var item_id = conn.escape(itemargs.item_id);
	var spend_count = conn.escape(itemargs.spend_count);

	var query = "insert into item_in_cart(cart_id, item_id, spend_count) " + 
				"values( "+cart_id+","+item_id+","+spend_count+");";
	console.log("query="+query);

	conn.query(query,function(err, rows) {
		// console.log('query result err:' + err);
		// console.log('query result rows:' + JSON.stringify(rows));
		callback(err,rows);
	});	
};


exports.selectTicketStatusByEmployee = function(eidarg, conn, callback) {
	var eid = conn.escape(eidarg);
	var query =	" select i.name, i.type, sum(ic.spend_count) " + 
				" from cart c, item_in_cart ic, item i" + 
				" where c.emp_id=" + eid + " and c.id=ic.cart_id and ic.item_id = i.id" + 
				" group by i.name, i.type;";

	console.log(query);
	
	conn.query(query,function(err, rows) {
		callback(err,rows);
	});	
};


exports.selectItemsInCartsByEmployee = function(eidarg, conn, callback){
	var eid = conn.escape(eidarg);
	var query =	" select c.id cart_id " + 
				" , c.emp_id, emp_id " + 
				" , c.user_id user_id " + 
				" , c.msg msg " + 
				" , UNIX_TIMESTAMP(c.timestamp) tmstmp " + 
				" , i.id item_id " + 
				" , i.name item_name " + 
				" , i.description item_desc " + 
				" , i.type item_type " + 
				" , i.money item_money " + 
				" , ic.spend_count cnt  " + 
				" , (select username from user where id = c.user_id ) user_name " + 
				"  from cart c , item i, item_in_cart ic " + 
				"	where c.emp_id=" + eid + 
				"	and c.id = ic.cart_id " + 
				"	and ic.item_id = i.id ";

	console.log(query);
	
	conn.query(query,function(err, rows) {
		callback(err,rows);
	});
};