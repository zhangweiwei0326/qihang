/**
YUIDoc 会认这个
*/
$(document).ready(function() {

	$("#user-nav li a").click(function() {
		var key = $(this).attr('data-key');
		$("#"+key).siblings().hide().end().show();
	});

	//取消收藏
	$(".delete-collect").click(function() {
		var t = $(this);
		var articleId = t.attr('data-id');
		var userId = t.attr('data-user-id');
		$.ajax({
          type:"GET",
          url: APP + "/Article/deleteCollect",
          data:{userId:userId,articleId:articleId},
          dataType:"json",
          success:function (data) {
          	if(data){
          		location.reload();
          	}
          }
		});
	});


});