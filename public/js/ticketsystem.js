

var timer_timecolumn = null;
var signedUser = null;
var selectedEmployee = null;
var master_item = null;
var itemcount = 0;
var curr_uid;
var curr_eid;

window.onresize = resizeLayout;
window.onload = function(){
	timer_timecolumn = setInterval(updateTimeColumn, 60*1000);

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
					$(".employee_item").each(function(idx,obj){
						$(obj).removeClass("success");
					});
					$(e.currentTarget).addClass("success")
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
				selectedEmployee = o;
				console.log("selectedEmployee", selectedEmployee);
				var str ="";
				str += "<tr><td>SN</td><td>"+o.sn+"</td></tr>";
				str += "<tr><td>Name</td><td>"+o.name+"</td></tr>";
				str += "<tr><td>Phone</td><td>"+o.phone+"</td></tr>";
				str += "<tr><td>Part</td><td>"+o.part+"</td></tr>";
				$("#employee_info_tbody").html(str);

				var hasitems = o.hasitems;
				var hi_str = "";
				var cnt_ticket =0;
				var cnt_cash = 0;
				var sum_cash= 0;
				for(var hii in hasitems){
					var hio = hasitems[hii];
					hi_str += "<tr>";
					hi_str += "<td title='"+hio.description+"'>"+hio.name+"</td>";
					hi_str += "<td>"+hio.type+"</td>";
					hi_str += "<td>"+hio.cnt+" ea";
					if(hio.money!=0){
						hi_str+=" / &#8361 "+hio.money*hio.cnt + "" ;
						cnt_cash += hio.cnt;
						sum_cash += (hio.cnt*hio.money);
					}else{
						cnt_ticket += hio.cnt;
					}
					hi_str += "</td>";
					hi_str += "</tr>";
				}
				$("#employee_hasitems_tbody").html(hi_str);

				var hi_status_str = "";
				hi_status_str += "남은 티켓 : " + cnt_ticket;
				hi_status_str += " / 현금티켓 : " + cnt_cash;
				hi_status_str += " / 현금입출금 : " + sum_cash;
				$("#employee_hasitems_status_td").html(hi_status_str);
			}
		}
	});


	// employee's carts history
	$.ajax({
		type:"get",
		url:"/employee/"+eid+"/carts",
		dataType :"JSON",
		success : function(data){
			console.log("rt", data.ret);
			if(data.status=="success"){
				var str = ""; 
				for(var oi in data.ret){
					var o = data.ret[oi];
					str += "<div class='panel panel-info'>"
					str += "<div class='panel-heading' >";
					str += "User : "+ o.user_name + " ( <span class='timecolumn' t="+(o.tmstmp*1000)+">" + getTimeColumnString(o.tmstmp*1000) +  "</span> )";
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

	
	var confirm_msg = "Message: " + cart_data['msg'] + '\n';
	for (var i in ticketinfo) {
		confirm_msg += 'item_id: ' + ticketinfo[i].item_id + ', spend_count: ' + ticketinfo[i].spend_count + '\n';
	}
	var final_confirm = confirm(confirm_msg, "티켓 적용 내역입니다. 정말 수행하시겠습니까?");

	if (final_confirm == true) {
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
	
}

var newItemIntoCart = function(item_id, cnt){
	console.log("newItemIntoCart");
	console.log("item_id: " + item_id);
	console.log("cnt: " + cnt);
	itemcount++;
	var initemcount = 0;
	if(typeof cnt =="undefined"){
		cnt = 0;
	}
	var str ="";
	str += "<tr class='itemincart_tr' value='"+itemcount+"'>";
	str += "<td style='vertical-align:middle;'>";
	str += "	<button class='close' onclick='deleteItemInCart(parentNode.parentNode.rowIndex);'>&#10006;</button>";
	str += "</td>";

	// item type
	str += "<td>";
	str += "	<select id='item_type_"+itemcount+"' class='form-control input-sm'>";
	for(var i in master_item){
		var item = master_item[i];
		str += " <option value="+item.id;
		if(item_id==item.id) {
			str+=" selected ";
			initemcount = item.money * cnt;
		}
			str += " >"+item.name+"</option>";
	}
	str += "	</select>";
	str += "</td>";
	// count
	str += "<td>";
	str += "	<input id='item_count_"+itemcount+"' onkeyup='onchange_item_count();' type='text' class='form-control input-xm col-xs-1 item_count' value="+cnt+" />";
	str += "</td>";
	// count inout toggle
	str += "<td style='vertical-align:middle;'>";
	str += "	<span class='glyphicon glyphicon-open item_toggle' id='item_inout_toggle' onclick='toggle_item_count("+itemcount+")'>Out</span>";
	str += "</td>";
	// money
	str += "<td style='vertical-align:middle;'>";
	str += "<span id='item_money_"+itemcount+"' >"+initemcount+"</span>원";
	str += "</td>";
	str += "</tr>";

	$("#item_in_cart_tbody").append(str);
}

var onchange_item_count = function(){
	console.log("onchange_item_count");
	$(".itemincart_tr").each(function(idx, obj){
		console.log($(obj).attr("value"));
	});
}
var toggle_item_count = function(itemcountnumber){
	console.log(itemcountnumber);
	console.log($("#item_type_"+itemcountnumber).val());
	console.log($("#item_money_"+itemcountnumber).val());
	console.log($("#item_count_"+itemcountnumber).val());

}

var deleteItemInCart = function(row) {
	console.log("deleteItemInCart");
	console.log("row: " + row);
	var tbl = document.getElementById('item_in_cart_tbody');
	tbl.deleteRow(row-1); 
}

var applyAllTicketsToCart = function(){
	console.log("selectedEmployee",selectedEmployee);
	if(selectedEmployee && selectedEmployee.hasitems.length!=0){
		for(var idx in selectedEmployee.hasitems){
			var item = selectedEmployee.hasitems[idx];
			if(item.type=="ticket" && item.cnt > 0 ){
				newItemIntoCart(item.id, 0-item.cnt);
			}
		}
	}
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

function updateTimeColumn(){
	//console.log("every 1 minutes to updateTimeColumn. ");
	$(".timecolumn").each(function(idx, obj){
		var t = $(obj).attr("t");
		$(obj).html(getTimeColumnString(t));
	});
}
function getTimeColumnString(tm){
	tm= parseInt(tm);
	var now = new Date();
	var tdate = new Date(tm);
	var diffmin = Math.floor(( now.getTime() - tdate.getTime() ) /1000/60);
	var str = ""+tdate.getHours() + ":"+tdate.getMinutes()+" / ";
	if(diffmin==0){
		str += " 방금 ";
	}else if(diffmin > 60) {
		var h = Math.floor(diffmin/60);
		var m = diffmin - h*60;
		str += h +"시간 " + m + "분전" ;
	}else{
		str += diffmin +"분전";
	}
	return str;
}
