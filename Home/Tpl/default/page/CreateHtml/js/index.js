/**
YUIDoc 会认这个
*/
$(document).ready(function() {
	if (document.body.clientWidth > 960) { //滚动变固定
		$("#ad-index-side").switchToFixed();
	}
	//tag搜索
	$(".tag-show a").click(function() {
		var tagId = $(this).attr("data-tagId");
		$.post(URL + "/tagSearch", {
			tagId: tagId
		}, function(data) {
			var newHtml = '';
			for (var i = 0; i < data.length; i++) {
				var articleItem = ['<ul style="position: relative;">',
					'<li class="list-title">',
					'<a href="' + APP + '/Article/showDetail/?id=' + data[i].id + '" target="_blank">' + data[i].title + '</a>',
					'</li>',
					'<li class="list-text">' + data[i].summary + '</li>',
					'</ul>'
				].join('');
				newHtml += articleItem;
			};
			$('.list').html(newHtml); //跟新页面
		}, "json"); //这里返回的类型有：json,html,xml,text
	});
	//移动端点击展示导航
	$(".m-nav .nenu").click(function() {
		$(this).next('ul').toggle();
	});
});