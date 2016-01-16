!(function($) {
	//判断数组中是否包含某个元素
    Array.prototype.contains = function(element) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] == element) {
                return true;
            }
        }
        return false;
    }
	$.lhz_table = {
		alertTest: function (obj){
	    	var str = JSON.stringify(obj)           
	    	alert(str); //用于测试      	   	
   		},
		createHtml: function() {
			return ['<div class="lhz-tb-frame">',
				'<div class="lhz-filter-box clearfix"></div>',
				'<div class="lhz-list-show"></div>',
				'<div class="lhz-page"></div>',
				'</div>'].join('');
		},
		createTestBox: function() {
			$('.lhz-tb-frame').before('<div class="test-msg-box"><p>测试信息显示如下：<p/></div');
		},
		showTestMsg:function(msg){
			try {
			var msgBox = $(".test-msg-box");
			 if(msgBox.length > 0){
				 if(!msg){
				   msgBox.text('没人参入错误信息');
				 }else{
				   msgBox.text(msg);
				 }
			 }else{
				throw new Error("调试模式没打开!");
			 }
			} catch (e) {
			 alert("提示" + ": " + e.message);
			}
		}
	};
    //生成分页
	$.fn.page = function(options){
        var defaults = {
            totalItem: '',
            currentPage : '',
            pageSize : '30'
        }
		var opts = $.extend({}, defaults, options); 				
		return this.each(function(){
			var totalItem = opts.totalItem;
		 	var pageSize  = opts.pageSize;
		 	var totalPage = Math.ceil(totalItem/pageSize);
		 	var currentPage = opts.currentPage;
		 	var showPageNum = 5;
		 	var showPageNum_min = Math.ceil(showPageNum/2);

		    $(this).html($.fn.page.createPage(totalItem,pageSize,totalPage,currentPage,showPageNum,showPageNum_min));
		    $.fn.page.changePage(totalItem,pageSize,totalPage,currentPage,showPageNum,showPageNum_min,$(this));
		});
	};

	// 定义暴露createPage函数    
	$.fn.page.createPage = function(totalItem,pageSize,totalPage,currentPage,showPageNum,showPageNum_min) { 
	var pageHtml = "";
	    pageHtml += '<a href="javascript:void(0);">上一页</a>';
        if(totalPage<=showPageNum){
         for (var i = 1; i <= showPageNum; i++) {
           if(i == currentPage){
		  		pageHtml += '<a href="javascript:void(0);" class="currentPage">'+i+'</a>';
           }else{
				pageHtml += '<a href="javascript:void(0);">'+i+'</a>';
           }
         };
        }else{
        var beginPage = currentPage-showPageNum_min>1 ? currentPage-showPageNum_min : 1;
        var endPage   = beginPage+showPageNum-1<totalPage ?  beginPage+showPageNum-1 : totalPage;
        pageHtml += '<a href="javascript:void(0);">1</a>';
        pageHtml += '<span>...</span>';
            for (var i = beginPage; i <= endPage; i++) {
               if(i == currentPage){
			  		pageHtml += '<a href="javascript:void(0);" class="currentPage">'+i+'</a>';
               }else{
					pageHtml += '<a href="javascript:void(0);">'+i+'</a>';
               }
            };
        }
        pageHtml += '<span>...</span>';
        pageHtml += '<a href="javascript:void(0);">'+totalPage+'</a>';
	    pageHtml += '<a href="javascript:void(0);">下一页</a>';
	    pageHtml += '共<span class="num">'+totalItem+'</span> 条';
	    return pageHtml;
	};  

	// 定义暴露changePage函数    
	$.fn.page.changePage = function(totalItem,pageSize,totalPage,currentPage,showPageNum,showPageNum_min,obj) {  	
	    $(".lhz-page a").live("click", function(){
	        var currentPage = parseInt($(".lhz-page a.currentPage").text()); //转化为数字类型
	        var clickValue = $(this).text();
	    	if(clickValue == "下一页"){
             	var currentPageNew = currentPage + 1 ;

	    	}else if(clickValue == "上一页"){
				var currentPageNew = currentPage - 1 ;
	    	}else{
				var currentPageNew = $(this).text();
	    	}
	    	obj.html($.fn.page.createPage(totalItem,pageSize,totalPage,currentPageNew,showPageNum,showPageNum_min));	    	
	    });   
	};  

})(jQuery);
/*lhz_talbe插件*/
!(function($) {
	$.fn.lhz_table = function(options) {
	 	var opts = $.extend({}, $.fn.lhz_table.defaults, options); 
		return this.each(function() {  		  
		    $this = $(this); 
		  	var frame = $.lhz_table.createHtml();
			$this.html(frame);  

		  	//是否开放测试开关
			if(opts.ifTest){$.lhz_table.createTestBox();}

		    $('.lhz-filter-box').html(getFiler()); 
		    $('.lhz-list-show').html(getTbody());

		    $('.lhz-page').page({totalItem: '306',currentPage : '12',pageSize : '20'});

			bindEvent();
			//$.lhz_table.showTestMsg();
			//$.lhz_table.alertTest(filterJson);
	    }); 
		/**
		* 初始化过滤条件
		*/
		function getFiler(){
	        var filterHtml = ''
			for (var i = 0; i < opts.filterJson.length; i++) {
					filterHtml += '<dl>';
	 				filterHtml += '<dt>'+opts.filterJson[i].name+'</dt>';
	 				filterHtml += '<dd>';
	 				var cdtLength = opts.filterJson[i].condition.length;
	 				for (var j = 0; j < cdtLength; j++) {
	 					filterHtml += '<a href="javascript:void(0);" data-id="'+opts.filterJson[i].condition[j].value+'">'+opts.filterJson[i].condition[j].name+'</a>';
	 				};
	 				filterHtml += '</dd>';
	 				filterHtml += '<dd data-id="'+opts.filterJson[i].id+'">';
	 				var optLength = opts.filterJson[i].option.length;
	 				for (var k = 0; k < optLength; k++) {
	 					filterHtml += '<a href="javascript:void(0);" data-id="'+opts.filterJson[i].option[k].value+'">'+opts.filterJson[i].option[k].name+'</a>';
	 				};
	 				filterHtml += '</dd>';
	 				filterHtml += '</dl>';
			}; 
			return filterHtml;
		};
		/**
		*获取数据
		*/
		function getTbody(conditionStr){
	      var tbodyHtml = '<table>';
		  $.ajax({
		    async: false,type: "post",dataType: "json", url: opts.getDataUrl,
		    data:  {"condition" : conditionStr},//要发送的数据
            complete :function(){
            	//$("#load").hide();
            },//AJAX请求完成时隐藏loading提示
            success: function(data){
                //$.lhz_table.alertTest(data);
                var thead_key_arr = new Array();//需要显示的字段
                
				var theadObj = data.thead;
				tbodyHtml += '<thead><tr>';
				for(var i in theadObj){
					 tbodyHtml += '<td>'+theadObj[i]+'</td>';
					 thead_key_arr.push(i);
				};
				tbodyHtml += '</tr></thead>';				

				var tbodyObj = data.tbody;
				tbodyHtml += '<tbody>';
  				for (var i = 0,l = tbodyObj.length; i < l; i++) {
  				 tbodyHtml += '<tr>';
  				  var tdObj = tbodyObj[i].data;
  				  for (var j = 0; j < thead_key_arr.length; j++) {
  				  	tbodyHtml += '<td>'+tdObj[thead_key_arr[j]]+'</td>';
  				  };
				 tbodyHtml += '</tr>';
				};
				tbodyHtml += '</tbody>';
			 }
            });
			tbodyHtml += '</table>';
			return tbodyHtml;
		}
		/**
		*过滤事件
		*/
		function bindEvent(){
			$('.lhz-filter-box dl dd a').click(function(){
			   var conditionKey = $(this).parent().attr('data-id');
			   var conditionValue = $(this).attr('data-id');
			   var conditionStr = '{"'+conditionKey+'" : "'+conditionValue+'"}';
			   //var conditionJson = eval("(" + conditionStr + ")");
			   //$.lhz_table.alertTest(conditionJson);
			   $('.lhz-list-show').html(getTbody(conditionStr));
			});
		}

	};
	// 插件的defaults  
	$.fn.lhz_table.defaults = {    
		ifTest: true,   
		filterJson : [{
			"id": "status",
			"name": "状态",
			'condition':[{
						"name": "[所有]",
						"value": "all"
					},{
						"name": "等于",
						"value": "equal"
					}],
			"option": [{
						"name": "新提交",
						"value": "new"
					},{
						"name": "进行中",
						"value": "ing"
					},{
						"name": "已解决",
						"value": "resolved"
					},{
						"name": "已关闭",
						"value": "closed"
					},{
						"name": "已拒绝",
						"value": "refuse"
					},{
						"name": "暂停中",
						"value": "pause"
					}]
		},{
			"id": "priority",
			"name": "优先级",
			'condition':[{
						"hasOption": false,
						"name": "[所有]",
						"value": "all"
					},{
						"hasOption": true,
						"name": "等于",
						"value": "equal"
					},{
						"hasOption": true,
						"name": "不等于",
						"value": "notequal"
					}],
			"option": [{
                        "name":"P1",
                        "value":"p1"
                    },{
                        "name":"P2",
                        "value":"p2"
                    },{
                        "name":"P3",
                        "value":"p3"
                    },{
                        "name":"P4",
                        "value":"p4"
                    }]
		}],
		"getDataUrl": './lhz_table.json'

	};  

})(jQuery);