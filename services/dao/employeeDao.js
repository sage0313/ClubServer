// employeeDao.js
'use strict';

var base = require('../base');

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
	var query = " select id, sn, name, phone, part, status from employee where id = "+ id ;
	console.log("query="+query);
	conn.query(query,function(err, rows, fields) {
		callback(err,rows);
	});	
}

exports.selectEmployeeByName = function(conn, callback){

}

exports.selectEmployeeBySN = function(conn, callback){

}

exports.selectEmployeeByPhone = function(conn, callback){

}

