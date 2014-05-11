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
