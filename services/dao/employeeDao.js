// employeeDao.js
'use strict';

var base = require('../base');

var selectColumns = " select id, sn, name, phone, visitdate, ismarriage, status, rcv_name, rcv_phone, part, msg , m_adult, m_child, p_adult, p_child from employee " ;

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
	var m_adult = emp.m_adult;
	var m_child = emp.m_child;
	var p_adult = emp.p_adult;
	var p_child = emp.p_child;
	if(isNaN(parseInt(m_adult))){
		m_adult = 0;		
	} else{
		m_adult = parseInt(m_adult);
	}
	if(isNaN(parseInt(m_child))){
		m_child = 0;	
	} else{
		m_child = parseInt(m_child);
	}
	if(isNaN(parseInt(p_adult))){
		p_adult = 0;	
	} else{
		p_adult = parseInt(p_adult);
	}
	if(isNaN(parseInt(p_child))){
		p_child = 0;	
	} else{
		p_child = parseInt(p_child);
	}

	var query = " insert into employee(sn, name, phone, visitdate, ismarriage, status, rcv_name, rcv_phone, part, msg,m_adult, m_child, p_adult, p_child) " 
	+" values( "+sn+","+name+","+phone+","+visitdate+","+ismarriage+","+status+","+rcv_name+","+rcv_phone+","+part+","+msg+", "+m_adult+","+m_child+","+ p_adult+","+p_child+");";

	console.log("query="+query);
	conn.query(query,function(err, rows, fields) {
		if (rows) {
			rows['newCart'] = emp.newCart;
		}
		callback(err, rows);
	});
};


exports.selectEmployeeById = function(idarg, conn, callback) {
	var id = conn.escape(idarg);
	var query = selectColumns + 
	" where id = " + id;
	console.log("query="+query);
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});	
};

exports.selectEmployeeBy = function(querystringarg, type, conn, callback) {
	var querystring = conn.escape('%'+querystringarg+'%');
	var query = selectColumns;
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
