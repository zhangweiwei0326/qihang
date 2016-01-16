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
		var verify = jQuery("#verify").val();
		var id = jQuery("#subject_id").val();
		var type = jQuery("#type").val();
		var content = jQuery("#commentText").val();
		$.ajax({
			type: "post",
			url: URL + "/commentAdd",
			dataType: 'json', //从php返回的值以 JSON方式
			data: 'id=' + id + '&content=' + content + '&verify=' + verify + '&type=' + type + '&parent_id=0',
			success: function(data) {
				if (data.flag == 0) {
					window.location.reload();
				} else {
					alert(data.msg);
				}
			}
		});
	});
})