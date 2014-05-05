//itemDao.js
'use strict';
var base = require('../base');


exports.selectItems = function(conn, callback){
	var query = " select id, name, description, type, money from item "; 
	console.log("query="+query);

	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});
};

exports.selectItemById = function(idarg, conn, callback){
	var id = conn.escape(idarg);
	var query = " select id, name, description, type, money from item where id="+ id; 
	console.log("query="+query);

	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});
};


exports.selectHasItemsByEmployee = function(eidarg, conn, callback){
	var eid = conn.escape(eidarg);
	var query= "select a.id , b.name , b.description, b.type, b.money , a.cnt  ";
	query += " from (select d.item_id id , sum(d.spend_count) cnt from cart c, item_in_cart d  where c.emp_id = 1  and c.id = d.cart_id group by d.item_id) a , item b ";
	query +=" where a.id = b.id ";
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});
}