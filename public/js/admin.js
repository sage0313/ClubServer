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
}

var onchange_search_type = function(){
	var search_type = $("#search_type_select option:selected").val();
	console.log(search_type);
	if(parseInt(search_type)==1){
		var str = "<form class='form-inline' > aaaaaaaaaaaaaa<br/>bbbbbbbbbbb</form>";
		$("#search_method_div").html(str);
	}else{

	}

}

var search1 = function(){
	$("#result_table").html('');
}