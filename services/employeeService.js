// employeeService.js
'use strict';

var base = require('./base');
var employeeDao = require('./dao/employeeDao');

exports.getEmployee = function(req, res){
 base.execute(req,res, function(req, res, conn){
		employeeDao.selectEmployeeById(req.params.uid, conn, function(err, rows){
			console.log(rows);
			if(err){
				res.send({"status":"error","error":""+err});
			}
			if(rows){
				res.send({"status":"success","ret":rows});
			}
		});
	});
}

exports.searchEmployee = function(req,res){
	
}