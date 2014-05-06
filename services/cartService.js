// cartService.js
'use strict';

var base = require('./base');
var cartDao = require('./dao/cartDao');


exports.getTicketInfofromCarts = function(req, res) {
	console.log('[getTicketInfofromCarts]');

	base.execute(req, res, function(req, res, conn){
		var eid = req.params.eid;
		cartDao.selectTicketStatusByEmployee(eid, conn, function(err, rows) {

			console.log('err:' + err);
			console.log('rows: ' + rows);

			if (err) {
				res.send({"status":"error","error":""+err});
			} else {
				var ticketlist = [];
				for (var i in rows) {
					var o = rows[i];
					console.log('ticket info: ' + o);

					for (var prop in o) {
						console.log('prop: ' + prop);
					}

					var ticket = {};
					ticket.name = o.name;
					ticket.type = o.type;
					ticket.count = o['sum(ic.spend_count)'];

					console.log('o.name: ' + o.name);
					console.log('o.type: ' + o.type);
					console.log('o.sumcount: ' + o['sum(ic.spend_count)']);


					ticketlist.push(ticket);
				}

				res.send({"status":"success","ret":ticketlist});				
			}

		});

	});
}


exports.createCart = function(req, res){
	base.execute(req, res, function(req, res, conn){

		console.log('createCart');
		console.log('args ' + JSON.stringify(req.body));

		cartDao.insertCart(req.body, conn, function(err, rows){
			console.log('createcart rows:' + rows);
			if(err){
				res.send({"status":"error","error":""+err});
			} else {
				var cart_id = rows.insertId;
				var item_in_cart = req.body.item_in_cart;

				for (var index in item_in_cart) {
					console.log('item_info: ' + item_in_cart[index]);
					var query_info = item_in_cart[index];
					query_info['cart_id'] = cart_id;
					cartDao.insertItemInCart(query_info, conn, function(err, rows) {
						if (err) {
							res.send({"status":"error","error":""+err});
						}
					});
				}
				res.send({"status":"success","ret":rows});
			}
		});
	});
}

