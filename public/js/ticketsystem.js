


var signedUser = null;
var master_item = null;
var itemcount = 0;
var curr_uid;
var curr_eid;

window.onresize = resizeLayout;
window.onload = function(){
	
	curr_uid = -1;
	curr_eid = -1;

	$.ajax({
		type:"get",
		url:"/item",
		dataType:"JSON",
		success:function(data){
			if(data.status=="success"){
				master_item = data.ret;
			}
		}
	});

	$('.dropdown-toggle').dropdown();
	resizeLayout();
	$(document.body).keyup(function(e){
		if(e.keyCode==113){
			$("#newEmployeeSearchModal").modal({show:true, keyboard:true});
			console.log("F2 - new Search Employee");
			$('#newEmployeeSearchModal').on('shown.bs.modal', function () {
				$('#newEmployeeSearchModalInput').focus();
			})
		}
	});
	var querymap = parseQueryString(location.href);
	if(typeof querymap["query"]!= 'undefined'){
		console.log("new query");
		searchEmployee(querymap["type"], querymap["query"])
	}

	// signed in user load
	$.ajax({
		type:"get",
		url:'/user/signinuser',
		dataType:'JSON',
		success:function(data){
			console.log('signinuser', data);
			signedUser = data;
			setupSignedUser(signedUser);
		},
		error:function(err){
			console.log("error=",err);	
		}
	});
};

var resizeLayout = function(){
	var forFixedHeights = $(".forFixedHeight");

	forFixedHeights.each(function(bo){
		var elem = $(forFixedHeights[bo]);
		var computedHeight = elem.parents().outerHeight()-elem.prev().outerHeight();
		elem.css("height" ,computedHeight+"px");
	});
};

var searchEmployee = function(type,query){
	if(!query) {
		console.log("query and type is undefined. so research. ");
		query = $("#EmployeeSearchInput").val();
		type = $("#EmployeeSearchSelect").val();
	}
	$("#EmployeeSearchInput").val(query);	
	$("title").html(query+" by "+type);
	$.ajax({
		type:"get",
		url:'/employee?query='+query+"&type="+type,
		dataType:"JSON",
		// data:{"query":query, "type":type},
		success:function(data){
			console.log(data);
			if(data.status=="success"){
				var str ="";
				for(var oi in data.ret){
					var o = data.ret[oi];
					str += "<tr class='employee_item'"+o.id+" eid="+o.id+" >";
					str += "<td>"+o.sn+"</td>";
					str += "<td>"+o.name+"</td>";
					str += "<td>"+o.phone+"</td>";
					str += "<td>"+o.part+"</td>";
					str += "</tr>";
					
				}
				$("#search_result_tbody").html(str);
				$(".employee_item").on("click",function(e){
					selectEmployee($(e.currentTarget).attr("eid"));
				});
			}
		},
		error:function(err){
			console.log("error=",err);
		}
	});
	return false;
}

var selectEmployee = function(eid){
	console.log("selectEmployee "+eid);
	curr_eid = eid;
	// employee info 
	$.ajax({
		type:"get",
		url:"/employee/"+eid,
		dataType:"JSON",
		success:function(data){
			console.log("ajax result: " + data);
			if(data.status=="success"){
				var o = data.ret;
				var str ="";
				str += "<tr><td>SN</td><td>"+o.sn+"</td></tr>";
				str += "<tr><td>Name</td><td>"+o.name+"</td></tr>";
				str += "<tr><td>Phone</td><td>"+o.phone+"</td></tr>";
				str += "<tr><td>Part</td><td>"+o.part+"</td></tr>";

				$("#employee_info_tbody").html(str);
			}
		}
	});

	// employee's ticket info
	$.ajax({
		type: "get",
		url: "/cartinfo/"+eid,
		dataType: "JSON",
		success : function(data) {
			console.log('[ajax result] ticket - status: ' + data.status);
			console.log('[ajax result] ticket - ret: ' + data.ret);

			if (data.status == "success") {
				var hi_str = "";
				var o = data.ret;
				for(var hii in o){
					var hio = o[hii];
					console.log('hio: ' + hio.name);
					console.log('hio: ' + hio.type);
					console.log('hio: ' + hio.count);
					
					hi_str += "<tr>";
					hi_str += "<td>"+hio.name+"</td>";
					hi_str += "<td>"+hio.type+"</td>";
					hi_str += "<td>"+hio.count+"</td>";
					hi_str += "<td> </td>";
					hi_str += "</tr>";
				}
				$("#employee_hasitems_tbody").html(hi_str);
			}
		}
	});



	// employee's carts history
	$.ajax({
		type:"get",
		url:"/employee/"+eid+"/carts",
		dataType :"JSON",
		success : function(data){
			console.log(JSON.stringify(data.ret));
			if(data.status=="success"){
				var str = ""; 
				for(var oi in data.ret){
					var o = data.ret[oi];
					str += "<div class='panel panel-info'>"
					str += "<div class='panel-heading' >";
					str += "User : "+ o.user_id + " ( " + o.tmstmp + " )";
					str += "</div>";
					str += "<div class='panel-body'> ";
					str +=" Msg : "+ o.msg;
					str += "<table class='table table-condensed'>";
					str += "<tr><td>Item</td><td>Count</td></tr>";
					for(var ii in o.items){
						var item = o.items[ii];
						str +="<tr><td>"+item.item_name+"</td>";
						str +="<td>"+item.item_cnt+"</td></tr>";
					}
					str += "</table>"
					str += "</div>";
					str += "</div>";
				}

				console.log(str);
				$("#employee_carts_div").html(str);
			}
		}
	});
}

var createNewCart = function() {
	console.log('one action, one cart');
	var cart_data = {};

	var msgbox = document.getElementById('cart_message');
	var msg = msgbox.value;
	
	console.log('message: ' + msg);
	console.log('emp_id: ' + curr_eid);
	console.log('user_id: ' + curr_uid);
	cart_data['msg'] = msg;
	cart_data['emp_id'] = parseInt(curr_eid);
	cart_data['user_id'] = parseInt(curr_uid);

	var tbl = document.getElementById('item_in_cart_tbody');
	var rCount = tbl.rows.length;

	var ticketinfo = [];
	console.log('table rows: ' + rCount);	
	for (var i = 0; i < rCount; i++) {
		
		var select = tbl.rows.item(i).getElementsByTagName('select');
		var item_id = select[0].value;
		console.log('item_id: ' + parseInt(item_id));

		var input = tbl.rows.item(i).getElementsByTagName('input');
		var spend_count = input[0].value;
		console.log('spend_count: ' + parseInt(spend_count));
		
		ticketinfo.push({'item_id':item_id, 'spend_count':spend_count});
	}
	cart_data['item_in_cart'] = ticketinfo;
	console.log('cart_data: ' + JSON.stringify(cart_data));

	$.ajax({
			type:"post",
			url:"/cart",
			data : cart_data,
			success : function(data){
				console.log(data);
				if(data.status=="success") {
					alert('Process completed');

					msgbox.value = "";
					for (var i = 0; i < rCount; i++) {
						tbl.deleteRow(0);
					}
					
				} else {
					alert('Failed to be done');
				}
			}
	});	
}

var newItemIntoCart = function(item_id, cnt){
	console.log("newItemIntoCart");
	console.log("item_id: " + item_id);
	console.log("cnt: " + cnt);
	var str ="";
	str += "<tr>";
	str += "<td><select class='form-control'>";
	for(var i in master_item){
		var item = master_item[i];
		str += " <option value="+item.id;
		if(item_id==item.id) str+=" selected "
			str += " >"+item.name+"</option>"
	}
	str +=" </select></td>";
	str += "<td><input type='text' class='form-control'/></td>";
	str += "<td><span></span> W</td>";
	str += "<td><button class='close' onclick='deleteItemInCart(parentNode.parentNode.rowIndex);'>&#10006;</button></td>";
	str += "</tr>";

	$("#item_in_cart_tbody").append(str);
}


var deleteItemInCart = function(row) {
	console.log("deleteItemInCart");
	console.log("row: " + row);
	var tbl = document.getElementById('item_in_cart_tbody');
	tbl.deleteRow(row-1); 
}

var setupSignedUser = function(user){
	$("#span_loginusername").html(user.username);

	console.log('signedUser: ' + user);
	console.log('::: ' + JSON.stringify(user));
	curr_uid = user.id;
};

var newEmployeeSearch  = function(){
	console.log("newEmployeeSearch");
	var inputquery=$('#newEmployeeSearchModalInput').val();
	var inputtype = $('#newEmployeeSearchModalSelect').val();
	window.open("?query="+inputquery+"&type="+inputtype, '_blank');
};

var signout = function(){
	$.ajax({
		type:"get",
		url:'/user/signout',
		success:function(data){
			window.location.reload(true);
		},
		error:function(data){
			console.log("error=",data);	
		}
	});
}


// util js
function parseQueryString(url) {
	var queryStringIdx = url.indexOf('?');
	var pairs = url.substr(queryStringIdx + 1)
	.split('&')
	.map(function(p) { return p.split('='); });
	var result = { };
	for (var i = 0; i < pairs.length; i++) {
		result[decodeURIComponent(pairs[i][0])] = decodeURIComponent(pairs[i][1]);
	}

	return result;
}
