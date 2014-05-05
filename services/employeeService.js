// employeeService.js
'use strict';

var base = require('./base');
var employeeDao = require('./dao/employeeDao');

exports.getEmployee = function(req, res){
	base.execute(req,res, function(req, res, conn){
		employeeDao.selectEmployeeById(req.params.uid, conn, base.returnCommon);
	});
}

exports.searchEmployee = function(req,res){
	base.execute(req,res, function(req, res, conn){
		var query = req.query.query;
		var type = req.query.type;
		if(type=="byall"){
			if(isNaN(query)){ // name
				employeeDao.selectEmployeeBy(query, type, conn, base.returnCommon);	
			}else{ // sn and phone
				var retmap = new Object();
				employeeDao.selectEmployeeBy(query, "bysn", conn, function(err,rows){
					if(err){
						res.send({"status":"error","error":""+err});
					}
					if(rows){
						for(var o in rows){
							var oo= rows[o];
							retmap[oo.id] = oo;
							console.log(oo);
						}
					}
					employeeDao.selectEmployeeBy(query, "byphone", conn, function(err,rows){
						if(err){
							res.send({"status":"error","error":""+err});
						}
						if(rows){						
							for(var o in rows){
								var oo= rows[o];
								retmap[oo.id] = oo;
								console.log(oo);
							}					
						}	
						var retarray = [];
						for(var k in retmap){
							retarray.push(retmap[k]);
						}
						res.send({"status":"success","ret":retarray});
					});
				});	
			}
		}else if(type=="bysn" || type=="byname" || type=="byphone"){
			employeeDao.selectEmployeeBy(query, type, conn, base.returnCommon);
		}else{
			res.send({"status":"error","error":"query string is invalid. "});
		}
	});	

}