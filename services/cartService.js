// cartService.js
'use strict';

var base = require('./base');
var cartDao = require('./dao/cartDao');


exports.getCart = function(req, res){
	base.execute(req, res, function(req, res, conn){
		cartDao.selectCartById(req.params.cid, conn, function(err, rows){
			console.log(rows);
			if(err){
				res.send({"status":"error","error":""+err});
			} else {
				res.send({"status":"success","ret":rows});
			}
		});
	});
}


exports.createCart = function(req, res){
	base.execute(req, res, function(req, res, conn){
		cartDao.insertCart(req.body, conn, function(err, rows){
			console.log(rows);
			if(err){
				res.send({"status":"error","error":""+err});
			} else {
				res.send({"status":"success","ret":rows});
			}
		});
	});
}