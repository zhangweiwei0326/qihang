$(document).ready(function() {
	//设置左边栏的高度
	(function() {
		var leftH = 67,
			rightH = 92;

		var pageHeight = $(window).height(); //浏览器当前窗口可视区域高度
		//var pageHeight = window.document.body.clientHeight;
		var leftObj = $("#sideBarLeft");

		var leftHeight = pageHeight - leftH;
		//var rightHeight = pageHeight - rightH;
		leftObj.height(leftHeight);

		$(window).resize(function() {
			leftObj.height($(window).height() - leftH);
		});
	}())

	// $("#sideBarRight .iframes iframe").load(function() {
	//     var thisheight = $(this).contents().find("body").height() + 30;
	//     var rightHeight = leftHeight - 30;
	//     //$(this).height(thisheight < rightHeight ? rightHeight : thisheight);//不显示滚动条  
	//     $(this).height(pageHeight - rightH);
	// });


	//tag选择和新建之间切换
	$('#to_add_tag').click(function() {
		if (!$('#newtag').length > 0) {
			$('.tagChoice').append(['<div id="newtag" >', '<input name="tag" style="margin-left:6px" />', '<span id="removeAddTag">取消新建标签</span>', '</div>'].join(''));
		}
	});

	$("#removeAddTag").die().live("click",
		function() { //为未来元素绑定事件 
			$('#newtag').remove();
		});

	//$("#container .menu li a").click(function(){  
	/* $("#container .menu li a").live("click",function(){
	    var textName = $(this).text();
	    var onlyNum = $(this).attr("a_onlyNum"); 
	    var href = $(this).attr("data-href");    
	    if(null == onlyNum || undefined == onlyNum){
	        var number = $.cookie('number'); //利用cookie生成连续数字
	        if(number=='undefined'){
	            number = 0;                         
	        }else{
	            number++;  
	        }                                                             
	        $.cookie("number", number); 
	        
	        $(this).attr("a_onlyNum",number);//赋值
	        
	        var liHtml = '<li id="tab_'+number+'" class="current"><span><a hidefocus="true" href="javascript:;" >'+textName+'</a><a class="del" href="javascript:;">关闭</a></span></li>';
	 
	        $("#B_history").append(liHtml); 
	        $("#B_history #tab_"+number).siblings().removeClass("current");
	    
	        $(".iframes div").hide();         
	        var ifremeHtml = '<div id="ifr-panel_'+number+'">';      
	        ifremeHtml += '<iframe scrolling="0" frameborder="0" style="height:100%; width:100%;" src="'+href+'"/>';
	        ifremeHtml += '</div>'; 
	      
	        $(".iframes").append(ifremeHtml);
	 
	        $("#ifr-panel_"+number+" iframe").load(function(){ 
	            var pageHeight = $(document).height();
	            var LeftHeight = pageHeight - 97;
	            var thisheight = $(this).contents().find("body").height()+30;
	            $(this).height(thisheight < LeftHeight ? LeftHeight : thisheight); 
	        });
	 
	    }else{

	        if($(".iframes #ifr-panel_"+onlyNum)[0].style.display == "none"){
	            $("#B_history #tab_"+onlyNum).css('display','block');
	            $("#B_history #tab_"+onlyNum).siblings().removeClass("current");
	            $("#B_history #tab_"+onlyNum).addClass("current");
	 
	            $(".iframes div").hide();                   
	            $(".iframes #ifr-panel_"+onlyNum).css('display','block');           
	        } 
	         
	    }
	  
	});*/

	$("#B_history li span").live("mouseover",
		function() {
			$(this).parents("li").addClass("hover");
		});

	$("#B_history li span").live("mouseout",
		function() {
			$(this).parents("li").removeClass("hover");
		});

	$("#B_history li span").live("click",
		function() {
			$(this).parents("li").addClass("current");
			$(this).parents("li").siblings().removeClass("current");

			var id = $(this).parents("li").attr("id");
			var strId = id.split("_");
			var number = strId[1];

			$(".iframes div").hide();
			$(".iframes #ifr-panel_" + number).show();

			var num = $(this).parents("li").attr('id');
			var strNum = num.split("_");
			var onlynum = strNum[1];
			if (onlynum !== 'default') { //指定左侧对应选中样式
				$(".menu li a").removeClass("Selected");
				$(".menu li a[a_onlynum=" + onlynum + "]").addClass("Selected");
			} else {
				$(".menu li a").removeClass("Selected");
			}

		});

	$("#B_history li .del").live("click",
		function(event) {
			event.stopPropagation();
			var id = $(this).parents("li").attr("id");
			var strId = id.split("_");
			var number = strId[1];

			$(".menu li a[a_onlynum=" + number + "]").removeAttr("a_onlynum"); //移除自定义属性
			$("#B_history #tab_" + number).hide();
			$("#B_history #tab_" + number).prev().addClass("current");
			$(".iframes #ifr-panel_" + number).css('display', 'none');
			$(".iframes #ifr-panel_" + number).prev().css('display', 'block');

			var num = $("#B_history #tab_" + number).prev().attr('id');
			var strNum = num.split("_");
			var onlynum = strNum[1];
			if (onlynum !== 'default') { //指定左侧对应选中样式
				$(".menu li a").removeClass("Selected");
				$(".menu li a[a_onlynum=" + onlynum + "]").addClass("Selected");
			} else {
				$(".menu li a").removeClass("Selected");
			}
		});

	$(".nav-sidebar .nav-title").live("click",
		function() {
			$(".nav-sidebar .menu").slideUp("slow");
			$(this).next().slideToggle("slow");
		});

	$(".menu li").live("click",
		function() { //左侧选中样式
			$(".menu li a").removeClass("selected");
			$(this).find("a").addClass("selected");
		});

	//ztree   
	$("#treeDemo span.switch").click(function() {
		if ($(this).next().next()[0].style.display == "none") {
			$(this).removeClass("center_close");
			$(this).addClass("center_open");
			$(this).next().find("span.button").removeClass("ico_close");
			$(this).next().find("span.button").addClass("ico_open");
		} else {
			$(this).removeClass("center_open");
			$(this).addClass("center_close");
			$(this).next().find("span.button").removeClass("ico_open");
			$(this).next().find("span.button").addClass("ico_close");
		}
		$(this).next().next().toggle();
	});

	$("#treeDemo a").click(function() {
		$("#treeDemo a").removeClass("curSelectedNode");
		$(this).addClass("curSelectedNode");
	});

	$(".sidebarRight .edit").live("click",
		function() {
			var name = $(this).parent().parent().find("a.name").text();
			var id = $(this).parent().parent().find("input[name='id']").val();

			var newHtml = '<p><input name="name" type="text" value="' + name + '" />';
			newHtml += '<input type="hidden" name="id" value="' + id + '" />';
			newHtml += '<a id="checked_btm" class="icon icon-checked" title="提交更新" href="javascript:void(0);"></a>';
			newHtml += '<a id="cancel_btn" class="icon icon-cancel" title="撤消操作" href="javascript:void(0);"></a></p>';
			$(this).parent().parent().after(newHtml);
		});

});

function openPage(obj) {
	var aobj = $(obj); //jQuery对象
	var url = aobj.attr("data-href");
	var type = aobj.attr("data-type");

	if (type == "ajax") {
		$("#sideBarRight .iframes").load(url);
		alert(url);
	} else {
		$("#sideBarRight .iframes iframe").attr("src", url);
	}
}