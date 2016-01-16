$(document).ready(function() {
	//搜索未发布文章
	$('#unpublished').click(function() {
		$.ajax({
			url: '/qihang/admin.php/Article/unpublishSearch',
			type: 'POST',
			dataType: 'json',
			success: function(data) {
				var newHtml = '';
				for (var i = 0; i < data.length; i++) {
					var articleItem = ['<li class="post-item">',
						'<div class="post-title"><a href="' + CONFIG.url + '/showDetail/?id=' + data[i].id + '" data-href="__APP__/Set/index#type=ajax"  data-type="ajax">' + data[i].title + '</a>',
						'</div>',
						'<div class="post-body">' + data[i].summary + '</div></li>'
					].join('');
					newHtml += articleItem;
				};
				$('.posts-list').html(newHtml); //跟新页面
			}
		});
	});
	//删除文章
	$('#to_delete').click(function() {
		var idstr = '';
		$('.posts-list input[type=checkbox]:checked').each(function(i) {
			if (i > 0) {
				idstr += ",";
			}
			idstr += $(this).val();
		});

		$.ajax({
			url: '/qihang/admin.php/Article/del',
			type: 'POST',
			data: {
				ids: idstr
			},
			dataType: 'json',
			success: function(data) {
				if (data.status == 1) {
					location.reload();
				} else {
					alert("删除失败~")
				}

			}
		});
	});
	//以标题搜索文章
	$('#to_search').click(function() {
		var keyName = $(this).prev().val();
		$.ajax({
			url: '/qihang/admin.php/Article/toSearch',
			type: 'POST',
			data: {
				keyName: keyName
			},
			dataType: 'json',
			success: function(data) {
				console.log(233);
				if (data != null) {
					var newHtml = '';
					for (var i = 0; i < data.length; i++) {
						var articleItem = ['<li class="post-item">',
							'<div class="post-title"><a href="' + CONFIG.url + '/showDetail/?id=' + data[i].id + '" data-href="__APP__/Set/index#type=ajax"  data-type="ajax">' + data[i].title + '</a>',
							'</div>',
							'<div class="post-body">' + data[i].summary + '</div></li>'
						].join('');
						newHtml += articleItem;
					};
				} else {
					var newHtml = ['<li class="post-item">',
						'<div class="post-title">没有匹配数据</div>',
						'</li>'
					].join('');
				}
				$('.posts-list').html(newHtml); //跟新页面
			}
		});
	});

});