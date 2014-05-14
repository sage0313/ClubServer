// employeeService.js
'use strict';

var base = require('./base');
var employeeDao = require('./dao/employeeDao');
var itemDao = require('./dao/itemDao');
var cartDao = require('./dao/cartDao');

exports.getEmployee = function(req, res){
	base.execute(req,res, function(req, res, conn){
		employeeDao.selectEmployeeById(req.params.uid, conn, function(err, rows){
			console.log(rows);
			if(err){
				res.send({"status":"error","error":""+err});
			} else {
				if(rows && rows.length===1){
					var ret = rows[0];
					itemDao.selectHasItemsByEmployee(ret.id, conn, function(err, rows){
						ret.hasitems = rows;
						res.send({"status":"success","ret":ret});
					});
				} else {
					res.send({"status":"success","ret":rows});	
				}	
			}
		});
	});
};

exports.searchEmployee = function(req, res){
	base.execute(req,res, function(req, res, conn){
		var query = req.query.query;
		var type = req.query.type;
		if(type==="byall" || type==="bysn" || type==="byname" || type==="byphone"){
			employeeDao.selectEmployeeBy(query, type, conn, function(err, rows){
				console.log(rows);
				if(err){
					res.send({"status":"error","error":""+err});
				} else {
					res.send({"status":"success","ret":rows});
				}
			});
		} else {
			console.log("query=",query,"type=",type);
			res.send({"status":"error","error":"query string is invalid. "});
		}
	});	
};

exports.getCartsByEmployee = function(req, res){
	base.execute(req, res, function(req, res, conn){
		var eid = req.params.eid;
		cartDao.selectItemsInCartsByEmployee(eid, conn, function(err, rows) {
			console.log(err);
			console.log(rows);
			var cartlist = new Object();
			for(var i in rows){
				var o = rows[i];

				var cart = new Object();

				if(!cartlist[o.cart_id]){
					cart.cart_id = o.cart_id;
					cart.emp_id = o.emp_id;
					cart.user_id = o.user_id;
					cart.user_name = o.user_name;
					cart.msg = o.msg;
					cart.tmstmp = o.tmstmp;
					cart.items = [];
					cartlist[o.cart_id] = cart;
				} else {
					cart = cartlist[o.cart_id];
				}
				var items = cart.items;
				var item = new Object();
				item.item_id = o.item_id;
				item.item_name = o.item_name;
				item.item_type = o.item_type;
				item.item_money = o.item_money;
				item.item_cnt = o.cnt;
				item.item_desc = o.item_desc;

				items.push(item);
				

			}

			res.send({"status":"success","ret":cartlist});
		});

	});
};




