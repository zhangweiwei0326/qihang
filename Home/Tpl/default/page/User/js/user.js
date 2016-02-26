/**
YUIDoc 会认这个
*/
$(document).ready(function() {

	$("#user-nav li a").click(function() {
		var key = $(this).attr('data-key');
		$("#"+key).siblings().hide().end().show();
	});
});