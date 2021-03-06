'use strict';

var base = require('./base');
var employeeDao = require('./dao/employeeDao');
var cartDao = require('./dao/cartDao');

exports.initDBData = function(req, res){
	base.executeRest(req, res, function(err, req, res, conn){
		if (err) {
			res.send({"status":"error","error":err});		
		} else {

			var initdata = req.body;
			console.log('[initDBData]');
			for (var index in initdata) {
				var data = initdata[index];
				console.log('data: ' + JSON.stringify(data));
				employeeDao.insertEmployee(data, conn, function(err, rows){

					console.log('[initDBData] insertEmployee callback');
					console.log('err: ' + err);
					console.log('rows: ' + JSON.stringify(rows));
					if (err) {
						res.send({"status":"error","error":err});
					} else {
						var cartdata = {
							"emp_id": rows.insertId,
							"user_id": rows.newCart['user_id'],
							"msg": rows.newCart['msg'],
							"item_in_cart": rows.newCart['item_in_cart']
						};
						console.log('cartdata: ' + JSON.stringify(cartdata));
						cartDao.insertCart(cartdata, conn, function(err, rows){
							
							if(err){
								console.log('insertCart err:' + err);
								res.send({"status":"error","error":err});
							} else {
								var item_in_cart = cartdata['item_in_cart'];
								var cart_id = rows.insertId;
								for (var subindex in item_in_cart) {
									console.log('item_info: ' + item_in_cart[subindex]);
									var query_info = item_in_cart[subindex];
									query_info['cart_id'] = cart_id;
									cartDao.insertItemInCart(query_info, conn, function(err, rows) {									
										if (err) {										
											console.log('insertItemInCart err:' + err);
											res.send({"status":"error","error":err});
										}
									});
								}
							}
						});
					}

				});
			}
			res.send({"status":"success","ret":""});
		}
	});
};


exports.createEmployee = function(empinfo){
	base.executeFile(empinfo, function(err, empinfo, conn){

		if (err) {
			console.log('createEmployee base err:' + err);
		} else {

			employeeDao.insertEmployee(empinfo, conn, function(err, rows){
				console.log('[createEmployee] insertEmployee callback');
				console.log('err: ' + err);
				console.log('rows: ' + JSON.stringify(rows));
				if (err) {
					console.log('employeeDao.insertEmployee err:' + err);
				} else if(!rows.newCart){
					console.log('[createEmployee] no cart data');

				} else {
					var cartdata = {
						"emp_id": rows.insertId,
						"user_id": rows.newCart['user_id'],
						"msg": rows.newCart['msg'],
						"item_in_cart": rows.newCart['item_in_cart']
					};
					console.log('cartdata: ' + JSON.stringify(cartdata));
					cartDao.insertCart(cartdata, conn, function(err, rows){
						if(err){
							console.log('insertCart err:' + err);
						} else {
							var item_in_cart = cartdata['item_in_cart'];
							var cart_id = rows.insertId;
								for (var subindex in item_in_cart) {
								// console.log('item_info: ' + item_in_cart[subindex]);
								var query_info = item_in_cart[subindex];
								query_info['cart_id'] = cart_id;
								cartDao.insertItemInCart(query_info, conn, function(err, rows) {
									if (err) {
										console.log('insertItemInCart err:' + err);
									}
								});
							}
						}
					});
				}
			});
		}
	});
};
