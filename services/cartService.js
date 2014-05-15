// cartService.js
'use strict';

var base = require('./base');
var cartDao = require('./dao/cartDao');


exports.getTicketInfofromCarts = function(req, res) {
	base.executeRest(req, res, function(err, req, res, conn){

		if (err) {
			res.send({"status":"error","error":err});		
		} else {
			var eid = req.params.eid;
			cartDao.selectTicketStatusByEmployee(eid, conn, function(err, rows) {

				console.log('[getTicketInfofromCarts] selectTicketStatusByEmployee callback');
				console.log('err:' + err);
				console.log('rows: ' + rows);

				if (err) {
					res.send({"status":"error","error":err});
				} else {
					var ticketlist = [];
					for (var i in rows) {
						var obj = rows[i];
						// console.log('ticket info: ' + o);

						var ticket = {};
						ticket.name = obj.name;
						ticket.type = obj.type;
						ticket.count = obj['sum(ic.spend_count)'];

						ticketlist.push(ticket);
					}

					res.send({"status":"success","ret":ticketlist});				
				}
			});
		}
	});
};


exports.createCart = function(req, res){
	base.executeRest(req, res, function(err, req, res, conn){
		if (err) {
			res.send({"status":"error","error":err});		
		} else {
			cartDao.insertCart(req.body, conn, function(err, rows){
				console.log('[createCart] createCart callback');
				console.log('err:' + err);
				console.log('rows: ' + rows);
				if(err){
					res.send({"status":"error","error":err});
				} else {
					var cart_id = rows.insertId;
					var item_in_cart = req.body.item_in_cart;

					for (var index in item_in_cart) {
						// console.log('item_info: ' + item_in_cart[index]);
						var query_info = item_in_cart[index];
						query_info['cart_id'] = cart_id;
						cartDao.insertItemInCart(query_info, conn, function(err, rows) {
							console.log('[createCart] insertItemInCart callback');
							console.log('err:' + err);
							console.log('rows: ' + rows);
							if (err) {
								res.send({"status":"error","error":err});
							}
						});
					}
					res.send({"status":"success","ret":rows});
				}
			});
		}
	});
};

