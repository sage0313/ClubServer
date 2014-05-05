


var signedUser = null;
var master_item = null;
var itemcount = 0;

window.onresize = resizeLayout;
window.onload = function(){
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
				for(var hii in data.ret){
					var hio = data.ret[hii];
					console.log('hio: ' + hio.name);
					console.log('hio: ' + hio.type);
					console.log('hio: ' + hio.count);
					
					hi_str += "<tr>";
					hi_str += "<td>"+hio.name+"</td>";
					hi_str += "<td>"+hio.type+"</td>";
					hi_str += "<td>"+hio.count+"</td>";
					hi_str += "<td> null </td>";
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
			console.log(data);
			if(data.status=="success"){
				var str = ""; 
				for(var oi in data.ret){
					var o = data.ret[oi];
					str += "<div class='panel panel-info'>"
					str += "<div class='panel-heading' >";
					str += "User : "+ o.user_id ;
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

var newItemIntoCart = function(item_id, cnt){
	console.log("newItemIntoCart");
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
	str += "<td><input  type='text' class='form-control'/></td>";
	str += "<td><span></span> W</td>";
	str += "<td></td>";
	str += "</tr>";

	$("#item_in_cart_tbody").append(str);
}

var setupSignedUser = function(user){
	$("#span_loginusername").html(user.username);
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
