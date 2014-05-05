


var signedUser = null;
var master_item = null;
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
	$.ajax({
		type:"get",
		url:"/employee/"+eid,
		dataType:"JSON",
		success:function(data){
			console.log(data);
			if(data.status=="success"){
				var o = data.ret;
				var str ="";
					str += "<tr><td>SN</td><td>"+o.sn+"</td></tr>";
					str += "<tr><td>Name</td><td>"+o.name+"</td></tr>";
					str += "<tr><td>Phone</td><td>"+o.phone+"</td></tr>";
					str += "<tr><td>Part</td><td>"+o.part+"</td></tr>";

				$("#employee_info_tbody").html(str);

				var hi_str = "";
				for(var hii in o.hasitems){
					var hio = o.hasitems[hii];
					hi_str += "<tr>";
					hi_str += "<td>"+hio.name+"</td>";
					hi_str += "<td>"+hio.type+"</td>";
					hi_str += "<td>"+hio.cnt+"</td>";
					hi_str += "<td>"+hio.money+"</td>";
					hi_str += "</tr>";
				}
				$("#employee_hasitems_tbody").html(hi_str);
			}
		}
	});
}

var newItemIntoCart = function(item_id, cnt){
	
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
