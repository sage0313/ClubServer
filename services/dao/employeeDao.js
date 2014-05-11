// employeeDao.js
'use strict';

var base = require('../base');

var selectColumns = " select id, sn, name, phone, visitdate, ismarriage, applystatus, rcv_name, rcv_phone, part, status, msg  from employee " ;

exports.insertEmployee = function(emp , conn, callback){
	var sn = conn.escape(emp.sn);
	var name= conn.escape(emp.name);
	var phone = conn.escape(emp.phone);
	var part = conn.escape(emp.part);
	var status = conn.escape(emp.status);

	var query = " insert into employee(sn, name, phone, part, status) ";
	query+=" values( "+sn+","+name+","+phone+","+emp.part+","+emp.status+")" ;
	console.log("query="+query);
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});
}


exports.selectEmployeeById = function(idarg, conn, callback){
	var id = conn.escape(idarg);
	var query = " "+ selectColumns;
	query +=" where id = "+ id ;
	console.log("query="+query);
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});	
}

exports.selectEmployeeBy = function(querystringarg, type, conn, callback){
	var querystring = conn.escape('%'+querystringarg+'%');
	var query =" "+ selectColumns;
	if(type=="bysn"){
		query +=" where sn like " + querystring ;
	}else if (type=="byname"){
		query +=" where name like "+ querystring ;
		query +=" union " + selectColumns;
		query +=" where rcv_name like "+ querystring ;
	}else if(type=="byphone"){
		query +=" where phone like "+ querystring ;
		query +=" union " + selectColumns;
		query +=" where rcv_phone like "+ querystring ;
	}
	console.log("query="+query);
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});			
}
