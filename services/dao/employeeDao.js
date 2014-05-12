// employeeDao.js
'use strict';

var base = require('../base');

var selectColumns = " select id, sn, name, phone, visitdate, ismarriage, status, rcv_name, rcv_phone, part, msg  from employee " ;

exports.insertEmployee = function(emp, conn, callback) {

	console.log('emp: ' + JSON.stringify(emp));

	var sn = conn.escape(emp.sn);
	var name= conn.escape(emp.name);
	var phone = conn.escape(emp.phone);
	var visitdate = "'2014.05.24'";
	var ismarriage = conn.escape(emp.ismarriage);
	var status = conn.escape(emp.status);
	var rcv_name = conn.escape(emp.rcv_name);
	var rcv_phone = conn.escape(emp.rcv_phone);
	var part = conn.escape(emp.part);
	var msg = conn.escape(emp.msg);

	var query = " insert into employee(sn, name, phone, visitdate, ismarriage, status, rcv_name, rcv_phone, part, msg) " +
				" values( "+sn+","+name+","+phone+","+visitdate+","+ismarriage+","+status+","+rcv_name+","+rcv_phone+","+part+","+msg+");";

	console.log("query="+query);
	conn.query(query,function(err, rows, fields) {
		rows['newCart'] = emp.newCart;
		callback(err, rows);
	});
};


exports.selectEmployeeById = function(idarg, conn, callback) {
	var id = conn.escape(idarg);
	var query = " "+ selectColumns;
	query +=" where id = "+ id ;
	console.log("query="+query);
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});	
};

exports.selectEmployeeBy = function(querystringarg, type, conn, callback) {
	var querystring = conn.escape('%'+querystringarg+'%');
	var query =" "+ selectColumns;
	if(type==="bysn" || type==="byall") {
		query +=" where sn like " + querystring;
	} 
	if (type==="byname" || type==="byall") {
		if (type==="byall") {
			query +=" union " + selectColumns;
		}
		query +=" where name like "+ querystring;
		query +=" union " + selectColumns;
		query +=" where rcv_name like "+ querystring;
	} 
	if(type==="byphone" || type==="byall") {
		if (type==="byall") {
			query +=" union " + selectColumns;
		}
		query +=" where phone like "+ querystring;
		query +=" union " + selectColumns;
		query +=" where rcv_phone like "+ querystring;
	}
	console.log("query="+query);
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});			
};
