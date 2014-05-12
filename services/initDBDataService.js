'use strict';

var base = require('./base');
var employeeDao = require('./dao/employeeDao');
var cartDao = require('./dao/cartDao');

exports.initDBData = function(req, res){
	base.execute(req, res, function(req, res, conn){

		var initdata = req.body;

		console.log('body: ' + initdata);

		for (var index in initdata) {
			var data = initdata[index];
			console.log('data: ' + JSON.stringify(data));
			employeeDao.insertEmployee(data, conn, function(err, rows){
				console.log('insertEmployee err: ' + err);
				console.log('rows: ' + JSON.stringify(rows));
				if (err) {
				} else {
					var cartdata = {
						"emp_id": rows.insertId,
						"user_id": rows.newCart['user_id'],
						"msg": rows.newCart['msg'],
						"item_in_cart": rows.newCart['item_in_cart']
					};
					console.log('cartdata: ' + JSON.stringify(cartdata));
					cartDao.insertCart(cartdata, conn, function(err, rows){
						console.log('insertCart err:' + err);
						if(err){

						} else {
							var item_in_cart = cartdata['item_in_cart'];
							var cart_id = rows.insertId;
							for (var subindex in item_in_cart) {
								console.log('item_info: ' + item_in_cart[subindex]);
								var query_info = item_in_cart[subindex];
								query_info['cart_id'] = cart_id;
								cartDao.insertItemInCart(query_info, conn, function(err, rows) {
									console.log('insertItemInCart err:' + err);
									if (err) {

									}
								});
							}
						}
					});

				}

			});
}
});
res.send({"status":"success","ret":""});
};


exports.createEmployee = function(empinfo){
	base.execute(empinfo, function(empinfo, conn){

		employeeDao.insertEmployee(empinfo, conn, function(err, rows){
			// console.log('insertEmployee err: ' + err);
			// console.log('rows: ' + JSON.stringify(rows));
			if (err) {
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
});
}