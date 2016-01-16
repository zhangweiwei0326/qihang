/*浮动添加、移除className*/
function hoverClass(obj) {
	obj.hover(function() {
		$(this).addClass("hover");
	}, function() {
		$(this).removeClass("hover");
	});
}

/*******************************************************************************
 * //超过固定的位置切换到可以随用户滚动而滚动
 * Copyright (C) 2012~2013梨花寨
 *
 * @author xyang <lihuazhai_com@163.com>
 * @site www.lihuazhai.com
 * @date 2013.7.9
 *******************************************************************************/
(function($) {
	$.fn.switchToFixed = function() {
		return this.each(function() {
			var $this = $(this);

			var objTop = $this.offset().top;
			var objWidth = $this.width();

			$(window).scroll(function() {
				if ($(window).scrollTop() > objTop) {
					$this.css({
						"position": "fixed",
						"width": objWidth,
						"top": "0px"
					});
				} else {
					$this.css({
						"position": "static"
					});
				}
			});
		});
	};
})(jQuery);

/*******************************************************************************
 * //textarea 随输入内容增多而高度增高
 * Copyright (C) 2012~2013梨花寨
 *
 * @author xyang <lihuazhai_com@163.com>
 * @site www.lihuazhai.com
 * @date 2013.7.15
 *******************************************************************************/
(function($) {
	$.fn.textareaAutoHeight = function(options) {
		var defaults = {
			minHeight: 120,
			maxHeight: 200 //可以设置为空 "" 或 null  
		};
		var opts = $.extend({}, defaults, options);

		var resetHeight = function() {
			var _minHeight = parseFloat($(this).attr("minHeight"));
			var _maxHeight = parseFloat($(this).attr("maxHeight"));

			if (!$.browser.msie) {
				$(this).height(0);
			}
			var h = parseFloat(this.scrollHeight);
			h = h < _minHeight ? _minHeight :
				h > _maxHeight ? _maxHeight : h;
			$(this).height(h).scrollTop(h);
			if (h >= _maxHeight) {
				$(this).css("overflow-y", "scroll");
			} else {
				$(this).css("overflow-y", "hidden");
			}
		};

		return this.each(function() {
			var $this = $(this);
			if (opts.minHeight == 0) {
				opts.minHeight = parseFloat($this.height());
			}
			for (var p in opts) {
				if ($(this).attr(p) == null) {
					$this.attr(p, opts[p]);
				}
			}
			$this.keyup(resetHeight).change(resetHeight).focus(resetHeight);
		});

	};
})(jQuery);

/*******************************************************************************
 * //ifRepeatSubmit 防止重复提交
 * Copyright (C) 2012~2013梨花寨
 *
 * @author xyang <lihuazhai_com@163.com>
 * @site www.lihuazhai.com
 * @date 2013.7.15
 *******************************************************************************/
function ifRepeatSubmit(e) {
	var theEvent = window.event || e;
	var theObj = theEvent.target || theEvent.srcElement;
	$this = $(theObj);

	if ($this.attr("repeatTime") === undefined) {
		$this.attr("repeatTime", 0);
	}

	Today = new Date();
	var NowHour = Today.getHours();
	var NowMinute = Today.getMinutes();
	var NowSecond = Today.getSeconds();
	var timestamp = (NowHour * 3600) + (NowMinute * 60) + NowSecond;

	if ((timestamp - $this.attr("repeatTime")) > 3) {
		$this.attr("repeatTime", timestamp);
	} else {
		alert('请勿重复提交！请耐心等待！');
		return true;
	}
}

/*******************************************************************************
 * //goTopEx 返回页面顶部
 * Copyright (C) 2012~2013梨花寨
 *
 * @author xyang <lihuazhai_com@163.com>
 * @site www.lihuazhai.com
 * @date 2013.7.15
 *******************************************************************************/
function goTopEx(id) {
	var obj = jQuery("#" + id);

	function setScrollTop(value) {
		document.documentElement.scrollTop = value;
	}
	window.onscroll = function() {
		if (jQuery(document).scrollTop() > 0) {
			obj.show();
		} else {
			obj.hide();
		}
	};

	obj.click(function() {
		var goTop = setInterval(scrollMove, 10);

		function scrollMove() {
			jQuery(document).scrollTop((jQuery(document).scrollTop() / 1.1));
			if (jQuery(document).scrollTop() < 1)
				clearInterval(goTop);
		}

	});
}