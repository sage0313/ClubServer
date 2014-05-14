

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
			showNewEmployeeModal();
		}
	});
	var querymap = parseQueryString(location.href);
	if(typeof querymap["query"]!= 'undefined'){
		console.log("new query");
		searchEmployee(querymap["type"], querymap["query"]);
		window.history.pushState("string", "Title", "/");
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

var showNewEmployeeModal = function(){
	$("#newEmployeeSearchModal").modal({show:true, keyboard:true});
	console.log("F2 - new Search Employee");
	$('#newEmployeeSearchModal').on('shown.bs.modal', function () {
		$('#newEmployeeSearchModalInput').focus();
	});
}

var resizeLayout = function(){
	var forFixedHeights = $(".forFixedHeight");

	forFixedHeights.each(function(bo){
		var elem = $(forFixedHeights[bo]);
		var computedHeight = elem.parents().outerHeight()-elem.prev().outerHeight();
		if(computedHeight < 100){
			computedHeight = $(window).outerHeight() -110;
			elem.css("height" ,computedHeight+"px");	
			console.log("resize to "+computedHeight);
		}else{
			elem.css("height" ,computedHeight+"px");	
		}
		
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
	$("#employee_cartaddeditems_tbody").html('');
	$("#cart_sum_msg").html("0 Tickets  0 원");
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
				str += "<tr><td>신청자</td><td>"+o.name+" / "+o.phone+"</td></tr>";
				str += "<tr><td>수령자</td><td>"+o.rcv_name+" / "+o.rcv_phone+"</td></tr>";
				str += "<tr><td>부서</td><td>"+o.part+"</td></tr>";
				str += "<tr><td>결혼여부</td><td>"+o.ismarriage+"</td></tr>";
				str += "<tr><td>회원권(대인/소인)</td><td>연간( "+o.m_adult+" , "+o.m_child+" ) / 구매( "+o.p_adult+" , "+o.p_child+" )</td></tr>";
				str += "<tr><td>상태</td><td>"+o.status+"</td></tr>";
				str += "<tr><td>방문예정일자</td><td>"+o.visitdate+"</td></tr>";
				
				str += "<tr><td>ETC</td><td>"+o.msg+"</td></tr>";
				if((o.m_adult+o.m_child)>=0){
					str += "<tr><td colspan=2><div class='alert alert-danger'>연간회원권("+o.m_adult+","+o.m_child+") 확인하기</div></td></tr>";
				}
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
					hi_str += "<td>"+hio.cnt+"<span id='hasitem_cnt_change_"+hio.id+"' class='hasitem_cnt_change'></span> ea";
					if(hio.money!=0){
						hi_str+=" <br/> &#8361 "+hio.money*hio.cnt + " <span id='hasitem_money_change_"+hio.id+"' class='hasitem_money_change'></span>" ;
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

refreshEmployeeCartHistory(eid);
emptyCart();
}

var refreshEmployeeCartHistory = function(eid){
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
						str += "<table class='panel-body table table-condensed'>";
						{
							var sumcnt = 0, summoney=0;
							for(var ii in o.items){
								var item = o.items[ii];
								sumcnt +=item.item_cnt;
								summoney += item.item_cnt * item.item_money;
							}
							str += "<tr><td>Item</td><td>Count( "+sumcnt+" )</td><td>Money( "+summoney+" )</td></tr>";
						}
						for(var ii in o.items){
							var item = o.items[ii];
							str +="<tr><td>"+item.item_name+"</td>";
							str +="<td>"+item.item_cnt+"</td>";
							str +="<td>"+(item.item_cnt*item.item_money)+"</td>";
							str +="</tr>";
						}
						str += "<tr><td colspan=3><span class='glyphicon glyphicon-comment'></span> Message : "+o.msg+"</td></tr>";
						str += "</table>"
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
		var item = getItemFromMaster(ticketinfo[i].item_id);
		confirm_msg += 'item : ' + item.name + '  ' + ticketinfo[i].spend_count + '매 \n';
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
					//alert('Process completed');

					msgbox.value = "";
					for (var i = 0; i < rCount; i++) {
						tbl.deleteRow(0);
					}
					selectEmployee(selectedEmployee.id);
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
	str += "	<select id='item_type_"+itemcount+"' class='form-control input-sm' onchange='onchange_item_count();' >";
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
	str += "	<input id='item_count_"+itemcount+"' onkeyup='onchange_item_count();' type='text' class='form-control input-xm item_count' value="+cnt+" />";
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
	$(".hasitem_cnt_change").each(function(idx,obj){$(obj).html('');});
	$(".hasitem_money_change").each(function(idx,obj){$(obj).html('');});
	$("#employee_cartaddeditems_tbody").html('');


	var cartresult = {};
	var cartcountresult = 0;
	var cartmoneyresult =0;
	$(".itemincart_tr").each(function(idx, obj){
		var cntid = $(obj).attr("value");
		var typeid = $("#item_type_"+cntid+" option:selected").attr("value");
		var itemcnt = parseInt($("#item_count_"+cntid).val());
		if(isNaN(itemcnt)) itemcnt=0;
		var item = getItemFromMaster(typeid);
		if(item.money!=0){
			$("#item_money_"+cntid).html((item.money*itemcnt).format());
			cartmoneyresult += item.money*itemcnt;
		}
		cartcountresult+= itemcnt;
		
		console.log("cntid", cntid,"typeid", typeid,"itemcnt",itemcnt);
		if(!cartresult[typeid]){
			cartresult[typeid] = 0;
		};
		cartresult[typeid] += itemcnt;
	});

	$("#cart_sum_msg").html(""+cartcountresult+" Tickets & "+cartmoneyresult+" 원");

	var temp_hasitems = {};
	for(var idx in selectedEmployee.hasitems){
		temp_hasitems[selectedEmployee.hasitems[idx].id] = selectedEmployee.hasitems[idx];
	}


	for(var idx in cartresult){
		if(cartresult[idx]!=0){
			if(temp_hasitems[idx]){
				var tempitem = temp_hasitems[idx];
				$("#hasitem_cnt_change_"+idx).html("<span style='color:blue;'> &#187; "+(tempitem.cnt+cartresult[idx])+"</span>");
				if(tempitem.money!=0){
					$("#hasitem_money_change_"+idx).html("<span style='color:blue;'> &#187; "+((tempitem.cnt+cartresult[idx])*tempitem.money).format()+"</span>");
				}
			}else{				
				var hio = getItemFromMaster(idx);
				var str ="<tr style='color:blue;'>";	
				str += "<td title='"+hio.description+"'>"+hio.name+"</td>";
				str += "<td>"+hio.type+"</td>";
				str += "<td>"+cartresult[idx]+" ea";
				if(hio.money!=0){
					str+=" / &#8361 "+hio.money*cartresult[idx] + "" ;
				}
				str += "</td>";
				str += "</tr>";
				$("#employee_cartaddeditems_tbody").html($("#employee_cartaddeditems_tbody").html()+str);				
			}
		}
	}
	console.log(cartresult);
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
	onchange_item_count();
}

var emptyCart = function(){
	$("#item_in_cart_tbody").html('');
	onchange_item_count();

}

var setupSignedUser = function(user){
	$("#span_loginusername").html(user.username);

	console.log('signedUser: ' + user);
	console.log('::: ' + JSON.stringify(user));
	curr_uid = user.id;

	if(user.role=="admin"){
		var str = "<a href='/admin'>Admin Page</a>";
		$("#admin_button").html(str);
	}
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

function getItemFromMaster(idx){
	for( var i in master_item){
		if(master_item[i].id == idx ){
			return master_item[i];
		}
	}
}
Number.prototype.format = function(){
	if(this==0) return 0;

	var reg = /(^[+-]?\d+)(\d{3})/;
	var n = (this + '');

	while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

	return n;
};
String.prototype.format = function(){
	var num = parseFloat(this);
	if( isNaN(num) ) return "0";

	return num.format();
};
