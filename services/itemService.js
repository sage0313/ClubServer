//itemService.js
'use strict';

var base = require('./base');
var itemDao = require('./dao/itemDao');

exports.getItems = function(req, res){
	base.executeRest(req,res, function(err, req, res, conn){
		if (err) {
			res.send({"status":"error","error":err});		
		} else {
			itemDao.selectItems(conn, function(err, rows){
				console.log('[getItems] selectItems callback');
				console.log('err: ' + err);
				console.log('rows: ' + rows);
				if(err) {
					res.send({"status":"error","error":err});
				} else {
					res.send({"status":"success","ret":rows});
				}
			});
		}
	});
};


exports.getItem = function(req, res){
	base.executeRest(req,res, function(err, req, res, conn){
		if (err) {
			res.send({"status":"error","error":err});		
		} else {
			itemDao.selectItemById(req.params.uid, conn, function(err, rows){
				console.log('[getItem] selectItemById callback');
				console.log('err: ' + err);
				console.log('rows: ' + rows);
				if(err) {
					res.send({"status":"error","error":err});
				}
				else {
					res.send({"status":"success","ret":rows});
				}
			});
		}
	});
};