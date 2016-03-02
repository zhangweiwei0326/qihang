function fleshVerify() { //重载验证码
	var time = new Date().getTime();
	document.getElementById('verifyImg').src = URL + '/verify/' + time;
}
$(document).ready(function() {

	$("#commentText").focus(function() {
		$(this).html("");
	}).blur(function() {});
	jQuery("#commentText").textareaAutoHeight();
	
	jQuery("#add_comment").click(function() {
	  var id = 0;
	  var verify =  jQuery("#verify").val();
	  var type =  jQuery("#type").val();
	  var content =  jQuery("#commentText").val();
	  $.ajax({ 
	      type: "post", 
	      url : URL + "/requireAdd", 
	      dataType:'json',//从php返回的值以 JSON方式
	      data: 'id='+id+'&content='+content+'&verify='+verify+'&type='+type, 
	      success: function(data){ 
			    console.log(data);
	        if(data['flag'] == 0){
	          alert('发布成功!'); 
	          window.location.reload(); 
	        }else{
	          alert('验证码错误!');        
	        } 
	      }
	  });
	});
})
