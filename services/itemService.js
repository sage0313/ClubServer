//itemService.js
'use strict';

var base = require('./base');
var itemDao = require('./dao/itemDao');

exports.getItems = function(req, res){
	base.execute(req,res, function(req, res, conn){
		itemDao.selectItems(conn, function(err, rows){
			console.log(rows);
			if(err){
				res.send({"status":"error","error":""+err});
			}
			if(rows){
				res.send({"status":"success","ret":rows});
			}
		});
	});
};


exports.getItem = function(req, res){
	base.execute(req,res, function(req, res, conn){
		itemDao.selectItemById(req.params.uid, conn, function(err, rows){
			console.log(rows);
			if(err){
				res.send({"status":"error","error":""+err});
			}
			if(rows){
				res.send({"status":"success","ret":rows});
			}
		});
	});
};