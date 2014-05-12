

/**
 * Module dependencies.
 */

 'use strict';

 var mysql = require('mysql');
 var fs = require('fs');

 // Services
 var userService = require('../services/userService');
 var employeeService = require('../services/employeeService');
 var itemService = require('../services/itemService');
 var cartService = require('../services/cartService');
 var notificationService = require('../services/notificationService');
 var initDBDataService = require('../services/initDBDataService');
 
 process.argv.forEach(function (val, index, array) {
 	console.log(index + ': ' + val);
 	if(index==2){
 		var file = val;
 		fs.readFile(file, 'utf8', function (err, data) {
 			if (err) {
 				console.log('Error: ' + err);
 				return;
 			}

 			data = JSON.parse(data);

 			// console.dir(data);
 			console.log(data);
 			for(var idx in data){
 				var empinfo = data[idx];
 				initDBDataService.createEmployee(empinfo);	
 			}



 		}); 		
 	}
 });






// clean up 
var cleanup = function() {
	console.log('cleanup');

};


process.on('SIGTERM', function() {
	server.close(function() {
		cleanup();
		process.exit();
	});
	setTimeout(function(){ process.exit(); }, 5000);
});
process.on('SIGINT', function() {
	server.close(function() {
		cleanup();
		process.exit();
	});
	setTimeout(function(){ process.exit(); }, 5000);
});

