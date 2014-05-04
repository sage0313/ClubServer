


var signedUser = null;

window.onresize = resizeLayout;
window.onload = function(){
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
	$("title").html(query+" by "+type);
	$.ajax({
		type:"get",
		url:'/employee',
		dataType:"JSON",
		success:function(data){
			// TODO search returns
		},
		error:function(err){
			console.log("error=",err);
		}
	});
	return false;
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
