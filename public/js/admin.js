// admin.js

window.onload = function(){
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

var onchange_search_type = function(){
	var search_type = $("#search_type_select option:selected").val();
	console.log(search_type);
	if(parseInt(search_type)==1){
		var str = "<form class='form-inline' onsubmit='return false;'> User Name <input class='form-control input-sm' id='username' />";
		str += " <button class='btn btn-success btn-sm' onclick='search1();'> 조회 </button> </form>";

		$("#search_method_div").html(str);
	}else if(parseInt(search_type)==2){
		var str = "<input class='form-control' />";
		$("#search_method_div").html(str);
	}else{

	}

};


var search1 = function(){
	var name = $("#username").val();
	$.ajax({
		type:"get",
		url:'/admin/user?name='+name, 
		dataType:'JSON',
		success : function(data){
			console.log("ret=", data);
			var str ="<table class='table table-condensed table-hover '><thead><tr>";
			str+="<td>id</td>";
			str+="<td>userid</td>";
			str+="<td>username</td>";
			str+="<td>role</td>";
			str+="<td></td>";
			str+="</tr></thead>"
			for(var idx in data){
				var item = data[idx];
				str+="<tr>";
				str+="<td>"+item.id+"</td>";
				str+="<td>"+item.userid+"</td>";
				str+="<td>"+item.username+"</td>";
				str+="<td>"+item.role+"</td>";
				str+="<td>";
				if(item.role!="admin"){
					str+="<button class='btn btn-xs btn-success' onclick=\"changeUserRole("+item.id+",\'"+item.role+"\',\'user\');\">to User</button> ";
					str+="<button class='btn btn-xs btn-success' onclick=\"changeUserRole("+item.id+",\'"+item.role+"\',\'ready\');\">to Ready</button>";
				}
				str+="</td>";
				str+="</tr>";
			}
			str+="</table>";
			$("#result_table").html(str);		
		},
		error:function(err){
			console.log("error=",err);
		}
	});
$("#result_table").html($("#result_table").html()+'<br/>query executed.');
}



var changeUserRole = function(id, fromrole, torole){
	var userinfo = {'id':id, 'fromrole':fromrole, 'torole':torole};
	$.ajax({
		type:"put",
		url:'/admin/userrole', 
		dataType:'JSON',
		data : userinfo,
		success:function(data){
			console.log(data);
			$("#result_msg").html("affected count = "+data.affectedRows);
		}
	});
};


































