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

			/*
			console.log(err);
			console.log(rows);
			var cartlist = new Object();
			for(var i in rows){
				var o = rows[i];
				if(!cartlist[o.cart_id]){
					var cart = new Object();
					cart.cart_id = o.cart_id;
					cart.emp_id = o.emp_id;
					cart.user_id = o.user_id;
					cart.msg = o.msg;
					cart.tmstmp = o.tmstmp;
					cart.items = [];
					cartlist[o.cart_id] = cart;
				}
				var cart = cartlist[o.cart_id];
				var items = cart.items;

				var item = new Object();
				item.item_id = o.item_id;
				item.item_name = o.item_name;
				item.item_type = o.item_type;
				item.item_money = o.item_money;
				item.item_cnt = o.cnt;

				items.push(item);
				

			}

			res.send({"status":"success","ret":cartlist});
			*/
		});

	});
}


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

