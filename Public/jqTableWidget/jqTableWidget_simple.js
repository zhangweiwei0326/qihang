/*******************************************************************************
* jqTableWidget - WYSIWYG HTML Editor for Internet
* Copyright (C) 2012-2013 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @website http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
* @version 4.1.2 (2012-07-21)

* 1. sel_load()//载入下拉项；
* 2. $.fn.jqTableWidget.add_filter('default')//载入下拉项 //需要传入过滤器项数据
* 3. $.fn.jqTableWidget.renovate();//载入默认数据
* 4. row_load();//载入默认列显示隐藏控制器
* 5. $.fn.jqTableWidget.group_load();// 载入分组控制
* 6. $.fn.jqTableWidget.page(120,6);//分页
* 7. $.fn.jqTableWidget.renovate = //载入数据
* Version: 2.5
* Requires jQuery 1.6.4+
| body_load 
*******************************************************************************/
(function($) {
    $.fn.serializeJSON = function() {//返回josn数据
        var json = {};
        $.map($(this).serializeArray(), function(n, i){
            json[n['name']] = n['value'];
        });
        return json;
    };
    
    function alertTest(obj){
    	var str = JSON.stringify(obj)           
    	alert(str); //用于测试      	   	
    }
	
	//获取页面路径
	var scripts = document.scripts || document.getElementsByTagName("script");
	for(i=0; i<scripts.length;i++){
		if(scripts[i].src.indexOf("jqTableWidget_simple")!=-1){
			var pagePath = scripts[i].src.substring(0,scripts[i].src.lastIndexOf("/"));
		}
	}	
	
	//动态载入JS、CSS文件
	function loadjscssfile(filename,filetype){
		if(filetype == "js"){
			var fileref = document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src",filename);
		}else if(filetype == "css"){	
			var fileref = document.createElement('link');
			fileref.setAttribute("rel","stylesheet");
			fileref.setAttribute("type","text/css");
			fileref.setAttribute("href",filename);
		}
		if(typeof fileref != "undefined"){
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}   
	}
	
	//判断数组中是否包含某个元素
    Array.prototype.contains = function(element) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] == element) {
                return true;
            }
        }
        return false;
    }
	
	//删除数组中重复字段
    Array.prototype.unique5 = function() {
        var res = [], hash = {};
        for(var i = 0, elem; ( elem = this[i]) != null; i++) {
            if(!hash[elem]) {
                res.push(elem);
                hash[elem] = true;
            }
        }
        return res;
    }
			
    $.fn.jqTableWidget = function(options) {
        var opts = $.extend({}, $.fn.jqTableWidget.defaults, options);       
        window.setting = opts.setting;
		window.filterKeep = opts.filterKeep;
		window.treeShow = opts.treeShow;
        window.data_url = opts.data_url;
        window.del_url = opts.del_url;
        window.edit_url = opts.edit_url;
        window.save_url = opts.save_url;
        window.close_url = opts.close_url;
		window.save_filter_url = opts.save_filter_url;
		window.pageSize = opts.pageSize;
        window.data_key = opts.data_key;
        window.edit_switch = opts.edit_switch;
        window.do_switch = opts.do_switch;
		window.ifShowFiles = opts.ifShowFiles;
        window.callbacks = opts.callbacks;
		window.operate = opts.operate; 
		
		loadjscssfile(pagePath+"/js/My97DatePicker/WdatePicker.js","js"); 
		loadjscssfile(pagePath+"/skin/default/css/table.css","css");     
      
        return this.each(function() {
        	var $this = $(this);
      	    var id = $this.attr("id");
            
            frame_load(id);// 载入表单页面框架
            
            if(opts.sel_switch == 'on') {
                sel_box();// 载入搜索box
                sel_load(opts.setting,opts.filterKeep);// 载入下拉选项
                $.fn.jqTableWidget.add_filter('default');
            }
            
            if(opts.row_switch == 'on' || opts.group_switch == 'on') {
                show_box();
            }

            if(opts.row_switch == 'on') {
                row_box();
                row_load(opts.setting);// 载入默认列显示隐藏
            }

            if(opts.group_switch == 'on') {
               group_load(opts.setting);// 载入分组控制
            }

            if(opts.sel_switch == 'on' || opts.row_switch == 'on' || opts.group_switch == 'on') {
                row_botton(opts.do_switch);// 载入操作按钮
                $("legend.leg_title").click(function() {
                    $(this).parent().toggleClass("collapsed");
                    $(this).next("div").toggle();
                });
            }

            $("#myform").ready(function() {				
				$("#app_btn").click();
            });
            
            // 双击编辑
            if(opts.edit_switch == 'on') {
                $.fn.jqTableWidget.edit(edit_url);
            }
            // 全选
            $("#sel_all").click(function() {
                $.fn.jqTableWidget.checkAll();
            });
            // 全不选
            $("#sel_none").click(function() {
                $.fn.jqTableWidget.sel_none();
            });
            // 反选
            $("#sel_fan").click(function() {
                sel_fan();
            });
            
            //选择下拉项,添加、移除过滤器
            $("#sel_box").delegate("select", "change", function() {
                $.fn.jqTableWidget.add_filter(this);
            });
            //点击input:checkbox隐藏显示
            $("#filter_box").delegate("input:checkbox", "click", function() {
                var tr_length = $("#filter_box tr").length;
                if(tr_length > 1) {
                    var id = $(this).val();
                    //$("#add_filter_select #"+id).attr("disabled", false); //把已经禁用的下来项设为可用
                    $("#add_filter_select").find("#" + id).removeAttr('disabled');
                    //兼容ie7;
                    $(this).parents("tr").remove();
                } else {
                    alert("至少留一个选项");
                    $(this).attr('checked', 'checked');
                }
            });
      	    
    	})//返回一个jquery对象
    };
	
        
	$.fn.jqTableWidget.defaults = {
		frame_id : 'tb_box',
		data_key : "id",
		setting : '',
		operate : {
		  showInput:true,
		},
		data_url : '',
		del_url : '',
		edit_url : '',
		save_url : '',
		save_filter_url : '',
		pageSize : '30',
		sel_switch : 'on',
		row_switch : 'on',
		group_switch : 'on',
		edit_switch : 'on',
		ifShowFiles : false,
		callbacks : null
	 }
      
/*==================控件框架盒子载入==================*/
    function frame_load(boxId){
        frame_box = '<div id="table_plugin_box">';
        frame_box += '<div class="control_box"><form action="" id="myform" method="post"></form></div>';
        frame_box += '<div id="tb_list_show"><form action="" id="change_data" method="post"><table class="list issues"><thead></thead></div><tbody></tbody></table></form></div>';
        frame_box += '<div id="ontrol" >' + '<input name="" type="button" id="sel_all" value="全选" />' + '<input name="" type="button" id="sel_fan" value="反选" />' + '<input name="" type="button" id="sel_none" value="全不选" />' + '</div>';
        frame_box += '<div id="page" class="page"></div>';
        frame_box += '</div>';
        $("#" + boxId).html(frame_box);
		if(treeShow.enable){
			treeShowButton();
		}
    }
	
	function treeShowButton(){
		var html = '<div><a id="treeShow" href="javascript:void(0);">切换至树形显示</a></div>';
		$(".control_box").before(html);		
		$("#treeShow").live("click",function(){
		   if($(this).text() == "切换至树形显示"){
				$.fn.jqTableWidget.renovate(data_url,"",true);
				$(".control_box").hide();
				$(this).text("切换至普通显示");
		   }else{
				$.fn.jqTableWidget.renovate(data_url,"",false);
				$(".control_box").show();
				$(this).text("切换至树形显示");
		   }			 
		});		
	}
	
 /*==================过滤器盒子载入==================*/
    function sel_box () {
        var html_str = '';
        html_str += '<fieldset class="collapsible">';
        html_str += '<legend class="leg_title">过滤器</legend>';
        html_str += '<div class="control">';
        html_str += '<div id="filter_box" class="filter_box"><table><tbody></tbody></table></div>';
        html_str += '<div id="sel_box" class="sel_box"></div>';
        html_str += '</div>';
        html_str += '</fieldset>';
        $("#table_plugin_box .control_box form").append(html_str);
    }

    function show_box() {
        var html_str = '';
        html_str += '<fieldset class="collapsible collapsed">';
        html_str += '<legend class="leg_title">选项</legend>';
        html_str += '<div class="show_group" style="display: none;">';
        html_str += '<div id="row_control" class="row_control"></div>';
        html_str += '<div id="group_control" class="group_control"></div>';
        html_str += '</div>';
        html_str += '</fieldset>';
        $("#table_plugin_box .control_box form").append(html_str);
    }

    $.fn.jqTableWidget.checkAll = function(txt) {
        $("#tb_list_show  tbody tr").find("input[type='checkbox']").each(function(i) {
            $(this).attr("checked", true);
        });
    }

    $.fn.jqTableWidget.sel_none = function(txt) {
        $("#tb_list_show  tbody tr").find("input[type='checkbox']").each(function(i) {
            $(this).attr("checked", false);
        });
    }
	
 /*==================更新数据保存==================*/
    $.fn.jqTableWidget.update = function(edit_data) {      	               
        $.ajax({
            type : "POST",
            url : edit_url,
            dataType:"html",
            data : edit_data,
            success : function(msg) {
                //alert("Data Saved: " + msg);
                $(".changedataDiv").remove();
                var condition = $('#myform').serialize();
                $.fn.jqTableWidget.renovate(data_url, condition);
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            }
        });   
    }
	
 /*==================点击清除功能==================*/
	$.fn.jqTableWidget.clear = function(){
		//$("#add_filter_select").find("option:disabled").attr("disabled", false); //把已经禁用的下来项设为可用
		sel_load(setting,filterKeep);// 载入下拉选项
		$.fn.jqTableWidget.add_filter('default');
		row_load(setting);//恢复默认显示列表项
		$("#group_select option:first").attr('selected', 'selected');//清除分组
		var condition = $('#myform').serialize();
		var initialConditionJson = initialCondition();
		var condition = {"condition" : ""};
		$.fn.jqTableWidget.renovate(data_url,initialConditionJson);
	}
	   
    $.fn.jqTableWidget.del = function(del_url,del_id) {
        var del = 'id='+del_id;
        $.ajax({
            type : "POST",
            url : del_url,
            data : del, 
            success : function(msg) {
                //alert("Data Saved: " + msg);
                $(".doneDiv").remove();
                $("tr[row_id="+del_id+"]").remove();
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                alert("ajax error");
            }
        });                      
    }
    
    $.fn.jqTableWidget.close = function(close_url,close_id) {
        var close = 'id='+close_id;
        $.ajax( {
            type : "POST",
            url : close_url,
            data : close,
            success : function(msg) {
                //alert("修改成功！");
                var condition = $('#myform').serialize();
                $.fn.jqTableWidget.renovate(data_url, condition);
            },
            complete : function(XMLHttpRequest, textStatus) {
            },
            error : function() {
                alert("wrong!");
            }
        });                       
    }   
    
    function sel_fan() {
        $("#tb_list_show  tbody tr").find("input[type='checkbox']").each(function(i) {
            if($(this).attr("checked")) {
                $(this).attr("checked", false);
            } else {
                $(this).attr("checked", true);
            }
        });
    }

/*==================过滤器下拉框选项载入==================*/
	function sel_load (data,filterKeeps){
		var sel_data = data.filterData.selection;  
		var selectOptionArr = new Array();	
		for(var key in sel_data){      
			var tempItemArr = {id:sel_data[key].id, name:sel_data[key].name};
			selectOptionArr.push(tempItemArr);	   
		} 	
		var Disableds = filterKeeps.filterSearch;//默认已经打开的选项
	
		var sel_html = '<select id="add_filter_select" temp_num="0">';
			sel_html += '<option value="">请选择</option>';
	
		$.each(selectOptionArr, function(i, item){
			var ifDisabled = Disableds.contains(item.id);//判断是为已经选中
			if(ifDisabled) {
				sel_html += '<option value=' + item.id + ' id="' + item.id + '" disabled="disabled"  selected="selected">' + item.name + '</option>';
			} else {
				sel_html += '<option value=' + item.id + ' id="' + item.id + '" >' + item.name + '</option>';
			}
		});
		sel_html += ' </select>';      
		$("#sel_box").html(sel_html);
	}		
	
/*==================动态显示过滤器项==================*/
    $.fn.jqTableWidget.add_filter = function(obj) {
        var $bj = $(obj);//Dom对象转换成jquery对象用 $( ) 把对象包装起来
        var sel_id = $bj.val();//选中的sel项id

        var filter_data = setting.filterData;
        $bj.find("option:selected").attr("disabled", "disabled");//设置已选择的项为不可用

		function defaultFilterLoad(id,filterItem){//载入默认过滤器项		
		    var serial = 0;       
            var temp_num = $("#add_filter_select").attr("temp_num");  
            var serial = parseInt(temp_num) + 1; 
			$("#add_filter_select").attr("temp_num",serial);
			
			$("#add_filter_select").find("option[value='"+id+"']").attr("disabled", "disabled");//设置已选择的项为不可用
			
            eval("filter_obj = filter_data.selection." + id);
            var filter_html = '<tr>';			
            filter_html += '<td style="width:100px; min-width:100px;">';
			filter_html += '<input type="hidden" name="name_'+ serial + '"  value="' + id + '_'+ serial + '" />';
            filter_html += '<input type="checkbox" value="' + id + '" id="' + id + '" tye="' + filter_obj.type + '" checked="checked">';
            filter_html += '<label for="' + id + '">' + filter_obj.name + '</label></td>';
            filter_html += '<td class="select_1" style="width:200px;min-width:200px;"><div class="' + id + '"><select name="sign_'+ serial + '" style="min-width:180px;">';
			var defaultCondition = filterItem.defaultCondition;
            var sel_length = filter_obj.condition.length;
            for(var i = 0; i < sel_length; i++) {
                if(filter_obj.condition[i].value == defaultCondition) {
                    if(filter_obj.condition[i].hasOption == false) {
                        var disabled = true;
                    }
                    filter_html += '<option value=' + filter_obj.condition[i].value + ' hasOption="' + filter_obj.condition[i].hasOption + '" selected="selected" >' + filter_obj.condition[i].name + '</option>';
                } else {
                    filter_html += '<option value=' + filter_obj.condition[i].value + ' hasOption="' + filter_obj.condition[i].hasOption + '" >' + filter_obj.condition[i].name + '</option>';
                }
            }
            filter_html += '</select></div></td>';
           
            var type_load = function(diplay) {//根据类型载入相应html
                filter_html += '<td class="select_2" style="display:' + diplay + '; width:200px; min-width:200px;"><div class="' + id + '">';
				var defaultOption = filterItem.defaultOption;
                switch (filter_obj.type) {
                    case 'select':
                        filter_html += '<select name="value_'+ serial + '" style="min-width:180px;">';
                        for(var i = 0; i < filter_obj.option.length; i++) {
                            if(filter_obj.option[i].value == defaultOption) {
                                filter_html += '<option value=' + filter_obj.option[i].value + ' selected="selected">' + filter_obj.option[i].name + '</option>';
                            } else {
                                filter_html += '<option value=' + filter_obj.option[i].value + '>' + filter_obj.option[i].name + '</option>';
                            }
                        }
                        filter_html += '</select>';
                        break
                    case 'text':
                        filter_html += '<input name="value_'+ serial + '" type="text" value="' + defaultOption + '"  />';
                        break
                    case 'date':
                        filter_html += '<input name="value_' + id + '" class="Wdate" type="text" value="' + defaultOption + '" onClick="WdatePicker({readOnly:true})" />';
                        break
                    case 'userAutoComplete':
                        var defaultOption = filter_obj.defaultOption;
                        var defaultName = filter_obj.defaultName;
                        if(defaultName == "undefined"||defaultName == null){
                            filter_html += '<input name="value_' + id + '" type="hidden" id="value_' + id + '" /><input name="value_'+id+'_autocomplete" value="" id="value_'+id+'_autocomplete"/>';                                            
                        }else{
                            filter_html += '<input name="value_' + id + '" type="hidden" id="value_' + id + '" value="'+ defaultOption +'" /><input name="value_'+id+'_autocomplete" value="' + defaultName + '" id="value_'+id+'_autocomplete"/>';                      
                        }
                        break;
                    default:
                        filter_html += '';
                }
                filter_html += '</div></td>';
            }
            if(disabled) {
                type_load("none");
            } else {
                type_load("block");
            }
            filter_html += '</tr>';
            $("#filter_box table tbody").append(filter_html);
        }
				
        var addFilterItem = function(id) {//动态添加过滤器项方法			
		    var serial = 0;       
            var temp_num = $("#add_filter_select").attr("temp_num");  
            var serial = parseInt(temp_num) + 1; 
			$("#add_filter_select").attr("temp_num",serial);
			
            eval("filter_obj = filter_data.selection." + id);
            var filter_html = '<tr>';			
            filter_html += '<td style="width:100px; min-width:100px;">';
			filter_html += '<input type="hidden" name="name_'+ serial + '"  value="' + id + '_'+ serial + '" />';
            filter_html += '<input type="checkbox" value="' + id + '" id="' + id + '" tye="' + filter_obj.type + '" checked="checked">';
            filter_html += '<label for="' + id + '">' + filter_obj.name + '</label></td>';
            filter_html += '<td class="select_1" style="width:200px;min-width:200px;"><div class="' + id + '"><select name="sign_'+ serial + '" style="min-width:180px;">';
            var defaultCondition = filter_obj.defaultCondition;
            var sel_length = filter_obj.condition.length;
            for(var i = 0; i < sel_length; i++) {
                if(filter_obj.condition[i].value == defaultCondition) {
                    if(filter_obj.condition[i].hasOption == false) {
                        var disabled = true;
                    }
                    filter_html += '<option value=' + filter_obj.condition[i].value + ' hasOption="' + filter_obj.condition[i].hasOption + '" selected="selected" >' + filter_obj.condition[i].name + '</option>';
                } else {
                    filter_html += '<option value=' + filter_obj.condition[i].value + ' hasOption="' + filter_obj.condition[i].hasOption + '" >' + filter_obj.condition[i].name + '</option>';
                }
            }
            filter_html += '</select></div></td>';
           
            var type_load = function(diplay) {//根据类型载入相应html
                filter_html += '<td class="select_2" style="display:' + diplay + '; width:200px; min-width:200px;"><div class="' + id + '">';
			    var defaultOption = filter_obj.defaultOption;
                switch (filter_obj.type) {
                    case 'select':
                        filter_html += '<select name="value_'+ serial + '" style="min-width:180px;">';
                        for(var i = 0; i < filter_obj.option.length; i++) {
                            if(filter_obj.option[i].value == defaultOption) {
                                filter_html += '<option value=' + filter_obj.option[i].value + ' selected="selected">' + filter_obj.option[i].name + '</option>';
                            } else {
                                filter_html += '<option value=' + filter_obj.option[i].value + '>' + filter_obj.option[i].name + '</option>';
                            }
                        }
                        filter_html += '</select>';
                        break
                    case 'text':
                        filter_html += '<input name="value_'+ serial + '" type="text" value="' + defaultOption + '"  />';
                        break
                    case 'date':
                        filter_html += '<input name="value_' + id + '" class="Wdate" type="text" value="' + defaultOption + '" onClick="WdatePicker({readOnly:true})" />';
                        break
                    case 'userAutoComplete':
                        var defaultOption = filter_obj.defaultOption;
                        var defaultName = filter_obj.defaultName;
                        if(defaultName == "undefined"||defaultName == null){
                            filter_html += '<input name="value_' + id + '" type="hidden" id="value_' + id + '" /><input name="value_'+id+'_autocomplete" value="" id="value_'+id+'_autocomplete"/>';                                            
                        }else{
                            filter_html += '<input name="value_' + id + '" type="hidden" id="value_' + id + '" value="'+ defaultOption +'" /><input name="value_'+id+'_autocomplete" value="' + defaultName + '" id="value_'+id+'_autocomplete"/>';                      
                        }
                        break;
                    default:
                        filter_html += '';
                }
                filter_html += '</div></td>';
            }
			
            if(disabled) {
                type_load("none");
            } else {
                type_load("block");
            }
            filter_html += '</tr>';
            $("#filter_box table tbody").append(filter_html);
        }
		
        if(obj == 'default') {
            $("#filter_box table tbody").empty();
			var defaultedSearch = setting.defaultedFilter.defaultedSearch;
            $.each(defaultedSearch, function(i, item) {
                defaultFilterLoad(item.id,item);
            });
        }
        else {
			var sel_id = obj.value;
			addFilterItem(sel_id);
        }

        $(".select_1 select").change(function() {                    
            var tye = $(this).parents("tr").find('input').attr('tye');
            if(tye == 'userAutoComplete'){
                var field = $(this).parents("tr").find('input').val();
                userAutoComplate("value_" + field, "value_" + field + "_autocomplete");                 
            }

            var ifDisabled = $(this).find("option:selected").attr("hasoption");

            if(ifDisabled == "false") {
                $(this).parents("tr").find(".select_2").hide();
                $(this).parents("tr").find(".select_2 select").attr("disabled", "disabled");
                $(this).parents("tr").find(".select_2 input").attr("disabled", "disabled");
            } else {
                $(this).parents("tr").find(".select_2").show();
                $(this).parents("tr").find(".select_2 select").removeAttr('disabled');
                $(this).parents("tr").find(".select_2 input").removeAttr('disabled');
            }
        })
    }
	
/*==================表格列显示隐藏功能载入==================*/
    function row_box() {
        var html_str = "";
        html_str += '<div id="selectLeft" class="row1"></div>';
        html_str += '<div id="row_show" class="row_show"><input type="button" value="→" id="toRight"/><br/><input type="button" value="←" id="toLeft"/> </div>';
        html_str += '<div id="selectRight" class="row2"></div>';
        html_str += '<div id="row_order" class="row_order"></div>';
        html_str += '<div style="clear:both;"></div>';

        $("#row_control").html(html_str);
        $("#toRight").click(function() {
            $("#selectLeft option:selected").each(function() {
                $("#selectRight select").append("<option value=" + $(this).val() + ">" + $(this).html() + "</option>");
                var id = $(this).val();
                //显示表格列
                var index = $("th[row_s=" + id + "]").index();
                $("th:eq(" + index + ")", $("#tb_list_show tr")).show();
                $("td:eq(" + index + ")", $("#tb_list_show tr")).show();
                $(this).remove();
            });
        });

        $("#toLeft").click(function() {
            $("#selectRight option:selected").each(function() {
                $("#selectLeft select").append("<option value=" + $(this).val() + ">" + $(this).html() + "</option>");
                var id = $(this).val();
                var index = $("th[row_s=" + id + "]").index();
                $("th:eq(" + index + ")", $("#tb_list_show tr")).hide();
                $("td:eq(" + index + ")", $("#tb_list_show tr")).hide();
                $(this).remove();
            });
        });
    }
    
/*==================载入默认列显示隐藏控制器==================*/
    function row_load(data) {
        var row_html1 = '<select multiple style="width:180px;min-height:160px;">';
        var row_html2 = '<select multiple style="width:180px;min-height:160px;">';
        var row_data = data.row;
		var defaultedColumn = data.defaultedFilter.column;
        $.each(row_data, function(i, item) {
            var id = item.id;
			eval("ifColumnShow = defaultedColumn." + id);
            if(ifColumnShow == false) {
                row_html1 += '<option value=' + id + '>' + item.name + '</option>';
            } else {
                row_html2 += '<option value=' + id + '>' + item.name + '</option>';
            }
        });
        row_html1 += '</select>';
        row_html2 += '</select>';

        $("#selectLeft").html(row_html1);
        $("#selectRight").html(row_html2);
    }
    
 /*==================分组控制载入==================*/
    function group_load(data) {
		var groupFields = new Array(); 
		var rowMsgs = data.row;		
	  	for (var i in rowMsgs) {
		   if(rowMsgs[i].group){
			   groupFields.push(rowMsgs[i]);
			}
		}
        var group_html = '根据此条件分组 <select id="group_select" style="width:180px">';
	    group_html += '<option value=""></option>';
		var defaultedGroup = data.defaultedFilter.group;//默认分组字段
	    $.each(groupFields, function(i, item) {
	        if(item.id == defaultedGroup) {
	            group_html += '<option value=' + item.id + ' selected="selected">' + item.name + '</option>';
	        } else {
	            group_html += '<option value=' + item.id + ' >' + item.name + '</option>';
	        }
	    });
	    group_html += '</select>';
	    $("#group_control").html(group_html);
    }
	
/*---------------- function-creatFilterJson ---------------*/
	function creatFilterJson(){
		//resetSerial();
        function strToObj(str){  
			str = str.replace(/&/g,"','");  
			str = str.replace(/=/g,"':'");  
			str = "({'"+str +"'})";  
			obj = eval(str);   
			return obj;  
		}           
		var total = $("#total").val();	
        var condition = $('#myform').serialize(); 
        condition = decodeURIComponent(condition,true);//解码

		var ob = strToObj(condition); 			
		var search_json = {};			
		for ( var i = 1,j = 1; i <= total; j++) {
			var name = ob['id_'+j];
			var sign = ob['sign_'+j];
			var value = ob['value_'+j];	
			if(value == undefined){
				value = "";
			}						
            if (sign == null || sign == "") {
                if (j > 100) {
                    break;
                }
                continue;
            }                
			var temp = {
    		        "name": name,
    			    "defaultCondition" : sign,
    			    "defaultOption" : value,
    		      };
			search_json[name] = temp;
			i++;
		} 
		
		var column_json = {};
		$("#selectRight select option").each(function(){				
			column_json[$(this).val()] = true;
		});	
		$("#selectLeft select option").each(function(){				
			column_json[$(this).val()] = false;
		});	
		
		var group_val = $("#group_select").val();
		
        var filterDate = {};
		filterDate['filterSearch'] = search_json;
		filterDate['filterColumn'] = column_json;
		filterDate['filterGroup'] = group_val;
		
	  return filterDate;		 
	}	
	
/*---------------- function-initialCondition ---------------*/	
	function initialCondition(){
   	   var filterJson = creatFilterJson();
		var pageAttr = {
			"pageCount" : 1,
			"pageSize" : 30,				
			"orderBy" : "id",
			"order" : "desc"
		}
	   var filterStr = JSON.stringify(filterJson);
	   var pageAttrStr = JSON.stringify(pageAttr);
	   var total = $("#total").val();
	   
	   var conditionJson = {"filterData" : filterStr,"total" : total, "pageAttr" : pageAttrStr};
	   return conditionJson;				
	}
    
/*==================载入按钮==================*/
    row_botton = function(do_switch) {
        var html_str = '<div id="buttons" class="buttons" >';
        html_str += '<input type="hidden" name="defineName"  value="" /><input type="hidden" name="isPublic"  value="" />';
        html_str += '<label class="btn_title">查询条件操作：</label><div class="box"><a href="javascript:void(0);" id="app_btn" class="icon icon-checked">应用</a>';
        html_str += '<a href="javascript:void(0);" id="clear_btn" class="icon icon-reload">清除</a>';
        html_str += '<a href="javascript:void(0);" id="save_btn" class="icon icon-save">保存查询条件</a></div>';
        if(do_switch == 'on'){
            html_str += '<div style="float:right; margin-left:40px; "><label class="btn_title">工作项操作：</label><div class="box"><a href="javascript:void(0);" id="add_tr_btn"  style="display:none;" class="icon con-checked">添加一条</a>';
            html_str += '<a href="javascript:void(0);" id="close_tr_btn" class="icon con-checked">批量关闭</a>';
            html_str += '<a href="javascript:void(0);" id="del_tr_btn" class="icon con-checked">批量删除</a></div></div>';
        }
        html_str += '</div>';

        $("#table_plugin_box .control_box form").append(html_str);
        
        //点击应用功能
        $("#app_btn").click(function(){
			
			function strToObj(str){  
				str = str.replace(/&/g,"','");  
				str = str.replace(/=/g,"':'");  
				str = "({'"+str +"'})";  
				obj = eval(str);   
				return obj;  
			}
				
			var total = $("#add_filter_select").attr("temp_num");		
            var condition = $('#myform').serialize();
			var ob = strToObj(condition); 			
			var search_json = new Array();　//创建一个数组			
			for (var i = 1,j=1; i <= total; i++) {
				var name = ob['name_'+i];
				var sign = ob['sign_'+i];
				var value = ob['value_'+i];	
				if(value == undefined){
					value = "";
				}		
				var temp = {"name": name,"sign": sign,"value": value};
				search_json.push(temp);					
			}			
            $.fn.jqTableWidget.renovate(data_url,{"condition" : search_json});
			j++;
        });

        $("#clear_btn").click(function() {
            $.fn.jqTableWidget.clear();
        });

        $("#save_btn").click(function() {			
			save_define_box();
            var condition = $('#myform').serialize();
            //alert(condition);
            $.fn.jqTableWidget.renovate(data_url, condition);// 载入默认表格数据          			
			$("#filter_save_box").modal();
        });

        $("#add_tr_btn").click(function() {   
            if($(".changedataDiv").length>0){
                alert("不能一次同时增加两条数据！");
                return;
            }
            var td_num = $("#tb_list_show table thead th").length;               
            var str = '<td><input type="checkbox" /><input type="hidden" name="id" value="" /></td>';
            str += '<td>操作</td><td></td><td>id</td>';
            
            var arrWidth = new Array();//列宽度
            $.each(setting.row, function(i, item) {
                arrWidth[item.id] = item.width;
            });

            var arrNullable = new Array();//列是否必填
            $.each(setting.row, function(i, item) {
                arrNullable[item.id] = item.nullable;
            }); 
            
            var optionArr = new Array();
            $.each(setting.row, function(i, item) {
                optionArr[item.id] = item.options;
            }); 
            
            for (i=4;i<td_num;i++){
                var td_type = $("#tb_list_show table thead th").eq(i).attr("type");  
                var row_s = $("#tb_list_show table thead th").eq(i).attr("row_s");
                var td_width = arrWidth[row_s];
                var nullable = arrNullable[row_s];//是否必须填写
              
                if(nullable==true) {                
                    var input_bg = "need";
                }else{                 
                    var input_bg = "unneed";
                }
                if(td_type == "percent"){                    
                    td_type = "select";
                }
                switch(td_type){
                    case 'select':
                        html_sel = '<select name="'+ row_s +'" class="'+input_bg+'">';
                        var options = optionArr[row_s];
                        $.each(options, function(i, item) {
                            html_sel += '<option value="' + i + '">' + item + '</option>';
                        });
                        html_sel += "</select>";                  
                        str += '<td>'+ html_sel +'</td>'; 
                        break;
                    case 'date':
                        str += '<td><input type="text" class="Wdate '+input_bg+'" onClick="WdatePicker()" name="'+ row_s +'" /></td>';  
                        break;
                    default:
                        str += '<td><input type="text" class="'+input_bg+'" name="'+ row_s +'" /></td>';      
                }                                     
            }         
            $("#tb_list_show table tbody tr#new_tr").append(str);           
                        
            var saveDiv  = '<div class="changedataDiv"><ul>';
            saveDiv  += '<li id="tr_save"><a href="javascript:void(0);">保存</a></li>';
            saveDiv  += '<li id="tr_cancel"><a href="javascript:void(0);">取消</a></li>';
            saveDiv  += '</ul></div>';
            
            var tableDiv =  $("#tb_list_show");       
            var tableTop  = tableDiv.offset().top;
                
            var obj = $("#tb_list_show table tbody tr:first"); 
            var objTop =  obj.offset().top;            
            var objWidth = obj.width();          
            
            var top   = objTop - tableTop + 32;
            var right = obj.width() - 30; 
            
            $(saveDiv).css({
                "position":"absolute",
                "display":"none",
                "top": top,
                "left": right
            }).appendTo("#tb_list_show").slideDown("slow");                  
                    
        });
        $("#tr_save").live("click",function(){//新增加一条保存
            var condition = $('#change_data').serializeJSON();           
            $.fn.jqTableWidget.update(condition);                                                           
        }); 
        
        $("#tr_cancel").live("click",function(){
            $(".changedataDiv").remove();
            var condition = $('#myform').serialize();
            //alert(condition);
            $.fn.jqTableWidget.renovate(data_url, condition);// 载入默认表格数据                                       
        }); 
        
        //批量关闭
        $("#close_tr_btn").click(function() {
            //判断是否至少选择了一项            
            var checked_num = $("#tb_list_show input[name='ids[]']:checked").length;             
            if (checked_num == 0) {
                alert("至少选择一项");
                return;
            }             
            if(confirm( "确定要批量关闭?" ))
            {
                var check_obj = $("#tb_list_show input[name='ids[]']:checked");
                for (var i = 0; i < check_obj.length; i++) {
                    if(check_obj.get(i).checked == true)
                    {                                          
                        $.fn.jqTableWidget.close(close_url,check_obj.get(i).value); 
                    }
                }
            }                    
                
        });
         
        //批量删除       
        $("#del_tr_btn").click(function() {
            //判断是否至少选择了一项            
            var checked_num = $("#tb_list_show input[name='ids[]']:checked").length;             
            if (checked_num == 0) {
                alert("至少选择一项");
                return;
            }             
            if(confirm( "确定要批量删除?" ))
            {
                var check_obj = $("#tb_list_show input[name='ids[]']:checked");
                for (var i = 0; i < check_obj.length; i++) {
                    if(check_obj.get(i).checked == true)
                    {   
                        $.fn.jqTableWidget.del(del_url,check_obj.get(i).value); 
                    }
                }
            }           
        });     
    }
    
    function body_load(td_body, row_num) {  
        var body_html = '';
        body_html += '<tr id="new_tr"></tr>';
        var colspan = row_num + 3;//需要合并的列数 即colspan值
        var group_id = $('#group_select').val();//分组字段ID

        if(!(group_id == null || group_id == '')) {
            var group_item = new Array();
            $.each(td_body, function(i, item) {
                eval("group_obj = item.data." + group_id);
                group_item.push(group_obj);
            });
            group_item = group_item.unique5();//删除数组中重复项，形成新数组
            var group_item_length = group_item.length;

            var st_num = new Array();
            for(var i = 0; i < group_item_length; i++) {
                var group_val = group_item[i];
                var num = 0;
                body_html += '<tr class="group open "><td colspan="' + colspan + '" style="text-align:left;"><span class="expander" onclick="jQuery.fn.TableCont.toggleRowGroup(this)">&nbsp;</span>' + group_item[i] + '<span class="count"></span></td></tr>';
                $.each(td_body, function(i, item) {
                    var body_attribute = item.attribute;
                    var bady_data = item.data;
                    var tr_class = body_attribute.tr_class;
                    var ifHasFile = body_attribute.hasFile;
                    var ifEdit = body_attribute.edit;
                    var hasFiles = ""; 
                    if(ifHasFile) {
                        hasFiles = "hasFiles";
                    } else {
                        hasFiles = ""; 
                    }
                    var objs_sv = '';
                    eval("objs_sv = bady_data." + group_id);
                    eval("id_only = bady_data." + data_key);//列唯一标志
					var tr_color = (i%2==0)?"odd":"even";//奇偶行颜
                    
                    if(objs_sv == group_val) { 
                        num++;
                        body_html += '<tr class = "'+tr_class+' '+tr_color+'" ifEdit= "'+ifEdit+'" row_id = "' + id_only + '" >';
                        body_html += '<td><input type="checkbox" value="' + bady_data.id + '" name="ids[]" id="' + bady_data.id + '"></td>';
                        if(do_switch == 'on'){
                            body_html += '<td><a href="javascript:void(0)" class="actDone">操作</a></td>';
                        }
						if(ifShowFiles){
                        	body_html += '<td class ="'+hasFiles+'"></td>';
						}
                        var j = 0;
                        $.each(setting.row, function(i,setVal) {
                            var field = setVal.id;
                            eval("td_text = item.data." + field );
                            var ifshow = showArr.contains(field);
                            //判断是否该隐藏
                            var display = "";
                            if(ifshow) {
                                display = "";
                            } else {
                                display = "none";
                            }
                           
                            eval("td_url = item.attribute.links." + field ); 
                            
                            //判断要加LINK
                            if(!(td_url == undefined)) {  
                                eval("td_url = item.attribute.links." + field );                           
                                body_html += '<td ty="' + field + '" style="display:' + display + ';"><a href=' + td_url +' title="' + td_text  + '">' + td_text  + '</a></td>';
                            } else {
                                var data_type = setVal.type;
                                switch(data_type) {
                                    case 'percent':
                                        body_html += '<td ty="' + field + '" style="display:' + display + ';"><a class="rank1" title="' + td_text  + '%" href="javascript:void(0);"><div style="width: ' + td_text  + '%;" class="inner1"></div></a> </td>';
                                        break;
                                    default:
                                        body_html += '<td ty="' + field + '" style="display:' + display + ';">' + td_text  + '</td>';
                                }
                            }
                            j++;
                        });
                        body_html += '</tr>';
                    }
                });
                st_num[i] = num;
            //记录分组数据条数；
            }
            $("#tb_list_show tbody").html(body_html);
            for(var i = 0; i < group_item_length; i++) {//注明每组的条数
                $(".count").eq(i).html('(' + st_num[i] + ')');
            }
        } else {
            $.each(td_body, function(i, item) {                                                              
                var body_attribute = item.attribute;
                var bady_data = item.data;  
				var level = item.level;
				var hasChild = item.hasChild;
                var tr_class = body_attribute.tr_class;
                var ifHasFile = body_attribute.hasFile;
                var ifEdit = body_attribute.edit;
                var hasFiles = ""; 
                if(ifHasFile) {
                    hasFiles = "hasFiles";
                } else {
                    hasFiles = ""; 
                }
				var tr_color = (i%2==0)?"odd":"even";//奇偶行颜
			                                    
                eval("id_only = bady_data." + data_key);//列唯一标志
				   
				body_html += '<tr class = "'+tr_class+' '+tr_color+'" level = "'+level+'" ifEdit= "'+ifEdit+'" row_id = "' + id_only + '" >';
				
			    if(operate.showInput == true){ 
            	 body_html += '<td><input type="checkbox" value="' + id_only + '" name="ids[]" id="' + id_only + '"></td>';
               }

                if(do_switch == 'on'){
                    body_html += '<td><a href="javascript:void(0)" class="actDone">操作</a></td>';
                }
				if(ifShowFiles){
                	body_html += '<td class ="'+hasFiles+'"></td>';
				}
                $.each(setting.row, function(i,setVal) {
                    var field = setVal.id;
                    eval("td_text = item.data." + field );
                    
                    var ifshow = showArr.contains(field);					
					
                    //判断是否该隐藏
                    var display = "";
                    if(ifshow) {
                        display = "";
                    } else {
                        display = "none";
                    }
					                                                      
                    eval("td_url = item.attribute.links." + field ); 
                                                        
                    //判断要加LINK
                    if(!(td_url == undefined)) {                    
                        eval("td_url = item.attribute.links." + field );
						if(level != undefined){
							if(field =="title"){
							  if(hasChild == true){
								var level_class = "level-"+level+" expand";//等级class名称
							  }else{
								var level_class = "level-"+level;//等级class名称
							  }							  
							  body_html += '<td ty="' + field + '" style="display:' + display + '; ">'
							  +'<a href="javascript:void(0);" class="'+level_class+' jia-jian" ></a>'
							  +'<a href="' + td_url + '" title="' + td_text + '">' + td_text + '</a></td>';
							}else{                        
							  body_html += '<td ty="' + field + '" style="display:' + display + '; "><a href="' + td_url + '" title="' + td_text + '">' + td_text + '</a></td>';
							}
						}else{                        
							body_html += '<td ty="' + field + '" style="display:' + display + '; "><a href="' + td_url + '" title="' + td_text + '">' + td_text + '</a></td>';
						}

                    } else {                    
                        var data_type = setVal.type;
                        switch(data_type) {
                            case 'percent':
                                if(item==null||item=="") item = 0;
                                body_html += '<td ty="' + field + '" style="display:' + display + ';"><a class="rank1" title="' + td_text + '%" href="javascript:void(0);"><div style="width: ' + td_text + '%;" class="inner1"></div></a> </td>';
                                break;
                            case 'select':                            	
                            	//eval("td_text = setVal.options." + td_text );//显示数据转换
                            	eval("td_text = setVal.options['"+td_text+"']" );//显示数据转换 ,兼容json的Key为数字情况
                            	body_html += '<td ty="' + field + '" style="display:' + display + ';">' + td_text + '</td>';
                                break;
                            default:
                                body_html += '<td ty="' + field + '" style="display:' + display + ';">' + td_text + '</td>';
                        }
                    }
                }); 
                body_html += '</tr>';
            });
            $("#tb_list_show tbody").html(body_html);                                                    
        }
        
        $(".actDone").click(function(e){ 
            e.stopPropagation(); //消除冒泡
            var doneId = $(this).parents('tr').attr("row_id"); 
            var relativeX = e.pageX - this.offsetLeft;  
            var relativeY = e.pageY - this.offsetTop;              
            if(!($(".doneDiv").length>0)){
                doneDivLoad(doneId,relativeX,relativeY);                   
            }  
                
            $(document).click(function(){ 
                //$(".doneDiv").fadeOut("fast").remove();
            })
            function doneDivLoad(doneId,relativeX,relativeY){                                          
                var doneDiv  = '<div class="doneDiv"><ul>';
                doneDiv  += '<li id = "tr_updata" doneId = '+doneId+'><span class="icon-updada"></span><a href="javascript:void(0);">更新</a></li>';
                doneDiv  += '<li id = "tr_close" doneId = '+doneId+' ><a href="javascript:void(0);">关闭</a></li>';
                doneDiv  += '<li id = "tr_del" doneId = '+doneId+' ><a href="javascript:void(0);">删除</a></li>';
				doneDiv  += '<li id = "tr_addSub" doneId = '+doneId+' ><a href="javascript:void(0);">添加子任务</a></li>';
				doneDiv  += '<li id = "tr_editTask" doneId = '+doneId+' ><a href="javascript:void(0);">编辑任务</a></li>';
                //doneDiv  += callbacks.doneHtml(doneId);
                doneDiv  += '</ul></div>';
               
                $(doneDiv).css({
                    "position":"absolute",
                    "display":"none",
                    "top": relativeY+10,
                    "left":relativeX+10
                }).appendTo("body").slideDown("slow");           
            }                          
        });       
    }
		
	
	$(".jia-jian").live("click",function(){ //加减号切换	
	   var trObj = $(this).parents("tr");
	   var thisLevel = trObj.attr("level");
	   if($(this).hasClass("expand")){
		$(this).removeClass("expand").addClass("collapse");
	   }else{
		$(this).removeClass("collapse").addClass("expand");
	   }
	   var levelInt = parseInt(thisLevel);
	   var nextAll = trObj.nextAll();
	   nextAll.each(function(i){
			var itemLevelInt = $(this).attr("level");
			if(itemLevelInt == levelInt || itemLevelInt < levelInt){
				return false; 
			}else{
				$(this).toggle();
			}		
	   });
	});
    
    $("#tr_updata").live("click",function(){        
        if($(".changedataDiv").length>0){
            alert("不能一次同时更新两条数据！");
            return;
        }
        
        var arrWidth = new Array();//列宽度
        $.each(setting.row, function(i, item) {
            arrWidth[item.id] = item.width;
        });

        var arrNullable = new Array();//列是否必填
        $.each(setting.row, function(i, item) {
            arrNullable[item.id] = item.nullable;
        }); 
            
        var optionArr = new Array();
        $.each(setting.row, function(i, item) {
            optionArr[item.id] = item.options;
        }); 
            
        var up_id = $(this).attr("doneId"); 
        var upObj = $("#"+up_id).parents("tr");
                    
        var td_num = $("#tb_list_show table thead th").length; 
        var str = '<td><input type="checkbox" /><input type="hidden" name="id" value="'+up_id+'" /></td>';         
        str += '<td>操作<input type="hidden" name="id" value="'+up_id+'" /></td>';   
        str += '<td></td><td>id</td>';
        for (i=4;i<td_num;i++){
            var td_type = $("#tb_list_show table thead th").eq(i).attr("type");  
            var row_s = $("#tb_list_show table thead th").eq(i).attr("row_s");            
            var td_width = arrWidth[row_s];
            var nullable = arrNullable[row_s];//是否必须填写
              
            if(nullable==true) {                
                var input_bg = "need";
            }else{                 
                var input_bg = "unneed";
            }
                        
            if(td_type == "percent"){
                td_type = "select";
            }
            switch(td_type){
                case 'select':
                    var oldOption =  upObj.find("td").eq(i).text();                               
                    html_sel = '<select name="'+ row_s +'" class="'+input_bg+'" >';
                    var options = optionArr[row_s];
                    $.each(options, function(i, item) {
                        if(i == oldOption){                                       
                            html_sel += '<option value="' + i + '" selected = "selected">' + item + '</option>';
                        }else{
                            html_sel += '<option value="' + i + '">' + item + '</option>'; 
                        }
                    });
                    html_sel += "</select>";                  
                    str += '<td>'+ html_sel +'</td>'; 
                    break;
                case 'date':
                    str += '<td><input type="text" class="Wdate '+input_bg+'" onClick="WdatePicker()" name="'+ row_s +'" /></td>';  
                    break;
                default:
                    var oldVal = upObj.find("td").eq(i).text();
                    str += '<td><input type="text" name="'+ row_s +'" value="'+ oldVal +'" class="'+input_bg+'" /></td>';      
            }                                     
        }

        upObj.find("td").remove();  
        upObj.append(str);  
                    
        var updataDiv  = '<div class="changedataDiv"><ul>';
        updataDiv  += '<li id="tr_up_btn" upId="'+up_id+'" ><a href="javascript:void(0);" >保存</a></li>';
        updataDiv  += '<li id="cancel_btn" upId="'+up_id+'" ><a href="javascript:void(0);" >取消</a></li>';
        updataDiv  += '</ul></div>';
              
        var tableDiv =  $("#tb_list_show");       
        var tableTop  = tableDiv.offset().top;
                
        var obj = upObj; 
        var objTop =  obj.offset().top;            
        var objWidth = obj.width();          
            
        var top   = objTop - tableTop + 32;
        var right = obj.width() - 30; 
    
        $(updataDiv).css({
            "position":"absolute",
            "display":"none",
            "top": top,
            "left": right
        }).appendTo("#tb_list_show").slideDown("slow");                                 
    });
    
    $("#tr_up_btn").live("click",function(){//正行修改保存      
        var upId = $(this).attr("upId");
        var condition = $("#change_data").serializeJSON();                   
        $.fn.jqTableWidget.update(condition);//数据插入数据库       
    }); 
    
    $("#cancel_btn").live("click",function(){ 
        $(".changedataDiv").remove();
        var condition = $('#myform').serialize();
        $.fn.jqTableWidget.renovate(data_url, condition);// 载入默认表格数据                  
    }); 
    
    $("#tr_close").live("click",function(){
        if(confirm('你确定要关闭此条数据吗？')) {
            var close_id = $(this).attr("doneId"); 
            $.fn.jqTableWidget.close(close_url,close_id);
        }
    });
    
    $("#tr_del").live("click",function(){
        if(confirm('你确定要删除此条数据吗？')) {
            var del_id = $(this).attr("doneId"); 
            $.fn.jqTableWidget.del(del_url,del_id);  
        }
    });
	
	$("#tr_addSub").live("click",function(){
         var del_id = $(this).attr("doneId"); 
		 if(callbacks.addSub != null){
       	    callbacks.addSub(do_id);//回调添加子任务操作   
         } 
    });
	
	$("#tr_editTask").live("click",function(){
         var do_id = $(this).attr("doneId"); 
		 if(callbacks.editTask != null){
       	    callbacks.editTask(do_id);//回调添加子任务操作   
         } 
    });
	
	function formatTree(treeDate,pId){   			 
	   var parentNodes = [];
	   var childNodes = [];
	   var arr_result = [];
	   	   
	   for(var i=0;i<treeDate.length;i++){	  
		 if(treeDate[i].data[pId] == 0){
			 parentNodes.push(treeDate[i]);
		 }else{
			 childNodes.push(treeDate[i]);
		 } 
	   }
	   
	  var  max_depth = 0;//记录递归层级
	  var parentLength = parentNodes.length
	  for(var i=0;i<parentLength;i++){	  
		 //document.write('<tr><td>'+parentNodes[i].data.id+'<td></tr>');
		 parentNodes[i].level = 0;
		 arr_result.push(parentNodes[i]);
		 getChildNodes(parentNodes[i].data.id,1);
	   }
	   
	  var  max_depth = 0;//记录递归层级		
	  function getChildNodes(parentNodeId,depth){
		 if( max_depth < depth ){
			max_depth = depth;
		 }
		 var childLength = childNodes.length;
		 for(var i=0;i<childLength;i++){
			if(childNodes[i].data[pId] == parentNodeId){
				//document.write('<tr><td style="padding-left:10px;">'+childNodes[i].data.id + "_"+depth+'<td></tr>');
				childNodes[i].level = depth;
				arr_result.push(childNodes[i]);
				getChildNodes(childNodes[i].data.id,depth+1);
			}	 
		 }	  
	  }	
	  
	  function ifhasChild(oldData){
		var length = oldData.length;
		for(var i=0;i<length;i++){
		   var ifhasChild = false;
		   for(var j=0;j<length;j++){
				if(oldData[i].data.id == oldData[j].data[pId]){
					ifhasChild = true;
				} 
		   }
		   oldData[i].hasChild = ifhasChild;		   
		} 
		return 	oldData;	
	   }
		
	   var new_result = ifhasChild(arr_result);		
       //alertTest(new_result);	  
	   return new_result;  	  
	}	
	
   /*==================表格数据刷新载入==================*/
    $.fn.jqTableWidget.renovate = function(url,params,toTreeShow) {
        $.post(url,params, function(data) { 	
            hideArr = new Array();
            showArr = new Array();
            linkArr = new Array();
            $("#selectLeft select option").each(function(i) {
                hideArr.push($(this).val());
            });

            $("#selectRight select option").each(function(i) {
                showArr.push($(this).val());
            });
            var head_html = '<tr>';
            if(operate.showInput == true){            
            	head_html += '<th style="width:2%;"><input type="checkbox" disabled=disabled></th>';
            }  
            if(do_switch == 'on'){
                head_html += '<th style="width:2%;">操作</th>';
            }
			if(ifShowFiles){
            	head_html += '<th style="width:2%;" class="hasFiles"></th>';
			}

            $.each(setting.row, function(i, item) {
                var field = item.id;
                var type = item.type;
                var edit = item.edit;
                var name = item.name;
                var th_width = item.width;
                var ifshow = showArr.contains(field);
                //判断是否该隐藏
                if(ifshow) {
                    head_html += '<th row_s="' + field + '" edit="' + edit + '" type="' + type + '" style="width:' + th_width + '" ><div><a class="sort" href=#" title="排序">' + name + '</a><a class="grid-hd-btn" href=#" title="搜索" style="display:none;"></a><p class="pp_div"></p></div</th>';
                } else {
                    head_html += '<th row_s="' + field + '" edit="' + edit + '" type="' + type + '" style="display:none; width:' + th_width + '"><div><a class="sort" href=#" title="排序">' + name + '</a><a class="grid-hd-btn" href=#" title="搜索"></a><p class="pp_div"></p></div</th>';
                }
            });
            head_html += '</tr>';
            $("#tb_list_show thead").html(head_html);
            //载入表格头部

            var td_body = data.tdBody;
			
			if(toTreeShow){
			   td_body = formatTree(td_body,"pId");//数据转换为属性格式				
			}
			 			 
            row_num = showArr.length;
            //body_load(td_body, row_num);
			$.fn.jqTableWidget.page(td_body, row_num, pageSize);//分页 
			                  
        }, "json");
         
        //排序
        $("#tb_list_show table > thead").delegate("th", "click", function() {
            var sort_id = $(this).attr("row_s");
            var if_asc = $(this).find(".sort").hasClass("asc");
            
            $.post(data_url, params, function(data) {
                var td_body = data.tdBody;  
                var compare = function(a, b) {
                    eval("one = a.data." + sort_id);                   
                    eval("two = b.data." + sort_id);
                    /* return one > two ? 1 : -1;*/
                    if(one > two)
                        return 1;
                    if(one == two)
                        return 0;
                    if(one < two)
                        return -1;
                }
                var compare1 = function(a, b) {
                    eval("one = a.data." + sort_id);
                    eval("two = b.data." + sort_id);
                    /*return two > one ? 1 : -1;*/
                    if(two > one)
                        return 1;
                    if(two == one)
                        return 0;
                    if(two < one)
                        return -1;
                }
                if(if_asc) {
                    td_body.sort(compare1);
                } else {
                    td_body.sort(compare);
                }

                body_load(td_body, row_num);

            }, "json");
            
            var className;
            if($(this).find(".sort").hasClass("asc")) {
                className = "desc";
            } else {
                className = "asc";
            }
            $("#tb_list_show table .sort").removeClass("desc").removeClass("asc");
            $(this).find(".sort").addClass(className);

        //基于后台排序的方法
        /*	    var project = $(this).parents("th").attr("row_s");
			 var data;
			 if(className == "asc"){
			 data = {"project":"'+project+'","by":"desc"};
			 }else{
			 data = {"project":"'+project+'","by":"asc"};
			 }
			 alert(data);
			 此处传条件参数到后台并获取数据从新排数据顺序
			 $.fn.jqTableWidget.renovate(data_url,data);*/
        });
        //列内搜索
        /*   $("#tb_list_show table > thead ").delegate(".grid-hd-btn", "click",function(ev) {

		 ev.stopPropagation(); //阻止冒泡事件触发
		 var row_s = $(this).parents("th").attr("row_s");

		 $("#tb_list_show table thead th .pp").hide();

		 var type = $(this).parents("th").attr("type");

		 switch (type){
		 case 'text':
		 var input_html = $('<p class="pp"><input name="" type="text" /><input name="" value="" type="submit" class="go_btn" /></p>');

		 $(this).next(".pp_div").html(input_html);

		 $(".pp input[type='submit']").click(function() {
		 var row = $(this).parents("th").attr("row_s");
		 //var type = $(this).parents("th").attr("type");
		 var type = 'text';
		 var val = $(this).prev().val();
		 var data = {"search":{"row":"'+row+'","type":"'+type+'","val":"'+val+'"}};
		 //alert(data);
		 //$.fn.jqTableWidget.renovate(data_url,data);

		 var condition = "row=" +row+ "&type=" +type+ "&var=" +val;
		 alert(data);
		 $.fn.jqTableWidget.renovate(data_url,condition);

		 });

		 break
		 case 'time':
		 var input_html = $('<p class="pp"><input name="" type="text" onClick="WdatePicker({readOnly:true,dateFmt:\'yyyy年MM月dd日 HH时mm分ss秒\'})" id="time_start" />&nbsp;到&nbsp;<input name="" type="text" onClick="WdatePicker({readOnly:true,dateFmt:\'yyyy年MM月dd日 HH时mm分ss秒\'})" id="time_end" /><input name="" value="" type="submit" class="go_btn" /></p>');

		 $(this).next(".pp_div").html(input_html);

		 $(".pp input[type='submit']").click(function() {
		 var row = $(this).parents("th").attr("row_s");
		 var type = 'time';
		 var time_start = $(this).parent().find("#time_start").val();
		 var time_end = $(this).parent().find("#time_end").val();
		 var data = {"search":{"row":"'+row+'","type":"'+type+'","val":{"time_start":"'+time_start+'","time_end":"'+time_end+'"}}};
		 //alert(data);
		 //$.fn.jqTableWidget.renovate(data_url,data);

		 var condition = "row=" +row+ "&type=" +type+ "&time_start=" +time_start+ "&time_end=" +time_end ;
		 //alert(condition);
		 //$.fn.jqTableWidget.renovate(data_url,condition);

		 });
		 break
		 case 'checkbox':
		 var $this = $(this);
		 //alert(row_s);
		 var group_arr = new Array();
		 $.post(url,function(data){
		 $.each(data.td_body,function(i, item){
		 eval("search_data = item." + row_s);
		 group_arr.push(search_data);
		 });

		 Array.prototype.unique5 = function() {
		 var res = [], hash = {};
		 for(var i=0, elem; (elem = this[i]) != null; i++) {
		 if (!hash[elem]){
		 res.push(elem);
		 hash[elem] = true;
		 }
		 }
		 return res;
		 }

		 group_arr = group_arr.unique5();
		 var group_arr_length = group_arr.length;

		 var input_html = '<div class="pp"><dl style="min-width: 110px">';
		 for(var i=0;i<group_arr_length;i++){
		 input_html += '<dd><input name="" type="checkbox" value="'+group_arr[i]+'" id="" /><span>'+group_arr[i]+'</span><input name="" value="" type="submit" class="go_btn" /></dd>';
		 }
		 input_html += '</dl></div>';

		 $this.next(".pp_div").html(input_html);

		 $(".pp dd").click(function() {
		 var check = $(this).find("input[type='checkbox']").attr("checked");
		 if (!check) {
		 $(this).find("input[type='checkbox']").attr("checked", true);
		 $(this).find("input[type='submit']").show();
		 } else {
		 $(this).find("input[type='checkbox']").attr("checked", false);
		 $(this).find("input[type='submit']").hide();
		 }
		 });

		 $(".pp input[type='submit']").click(function() {
		 var row = $(this).parents("th").attr("row_s");
		 var type = 'checkbox';
		 var val = $(this).prev().text();

		 var length = $(this).parents("dl").find("input:checked").length-1;
		 var data = '{"search":';

		 data += '{"row":"'+row+'","type":"'+type+'","val":[';

		 $(this).parents("dl").find("input:checked").each(function(index, element){
		 if (index == length) {
		 data +='{"id":"'+$(this).attr("id")+'","name":"'+$(this).val()+'"}';
		 } else {
		 data +='{"id":"'+$(this).attr("id")+'","name":"'+$(this).val()+'"},';
		 }
		 })

		 data +=']}}';
		 alert(data);
		 $.fn.jqTableWidget.renovate(data_url,data); //?多选

		 });

		 }, "json");

		 break
		 default:

		 }

		 $(".pp_div").click(function() {
		 return false;
		 });

		 $(document).one("click",function(event) {
		 $(".pp").hide(300);
		 });

		 });  */
        $("#tb_list_show table > tbody").delegate("tr", "mouseover", function() {
            $(this).addClass("tr-hover");
        });

        $("#tb_list_show table > tbody").delegate("tr", "mouseout", function() {
            $(this).removeClass("tr-hover");
        });
    }
    /*表格分组显示展开、关闭*/
    $.fn.jqTableWidget.toggleRowGroup = function(el) {
        $(el).parents("tr").toggleClass("open");
        $(el).parents("tr").nextUntil('.group').toggle();
    }
    
/*======================表格数据编辑功能==============================*/    
    $.fn.jqTableWidget.edit = function(url) {             
        $("#tb_list_show tbody td").live("hover",function(){
            var index = $(this).index();
            var columnIfedit = $("#tb_list_show thead tr th").eq(index).attr("edit");
			var rowIfedit = $(this).parents("tr").attr("ifEdit");
            if(columnIfedit == "true" && rowIfedit == "true"){
                $(this).css("cursor","text");
            }else{
                this.style.cursor = "not-allowed";
            }         
        });                
        
        $("#tb_list_show tbody").delegate("tr:not('.group') td:gt(0)", "dblclick", function() {
            var tdobj = $(this);
            if(tdobj.children("input").length > 0) {//禁止重复点击
                return false;
            }
            var text = tdobj.text();
            var index = $(this).index();
            var ty = tdobj.attr("ty");            
            var columnIfedit = $("#tb_list_show thead tr th").eq(index).attr("edit");
 		    var rowIfedit = $(this).parents("tr").attr("ifedit");
            var type = $("#tb_list_show thead tr th").eq(index).attr("type");
            
            if(columnIfedit == "true" && rowIfedit == "true") {
                switch(type) {
                    case 'date':   
                        dateEdit();
                         break;
                    case 'select':
                        selEdit();                      
                         break;
                    case 'percent':
  					 var text = $(this).find(".rank1").attr("title");
                       selEdit();                      
                         break;
                    case 'userAutoComplete':
                     	 userAuto();                      
                         break; 
                    default:
                     	 textEdit();                       
                   }               
             }else{             
              //alert("此数据不能编辑！")
             }
            
            function dateEdit(){  
         	   var html_new = '<input type="text" class="Wdate" value="'+ text +'" onClick="WdatePicker()" />';
                html_new += '<a class="icon-table icon-checked update_btn" href="javascript:void(0);" title="提交更新"></a>';
                html_new += '<a class="icon-table icon-reload cancel_btn" href="javascript:void(0);" title="撤消操作"></a>';
                html_new += '<input type="hidden" value="'+ text +'">';
                tdobj.html(html_new); 
                
               $(".update_btn").bind("click", {type: "date"}, update);                
             }            
            
            function selEdit(){ 
                var optionArr = new Array();
                $.each(setting.row, function(i, item) {
                    optionArr[item.id] = item.options;
                });                    
            
                var options = optionArr[ty];
                
                var html_sel = "<select><option value=''>--请选择--</option>";             
                $.each(options, function(i, item) {
                    if(item == text){
                        html_sel += '<option value="' + i + '" selected>' + item + '</option>';
                    }else{
                        html_sel += '<option value="' + i + '">' + item + '</option>';   
                    }
                });
                html_sel += "</select><a class='icon icon-checked update_btn' href='javascript:void(0);' title='提交更新'></a>" +
                		"<a class='icon icon-reload cancel_btn' href='javascript:void(0);' title='撤消操作'></a>" +
                		"<input type='button' style='display:none;' value='更新' />";
                html_sel += '<input type="hidden" value="'+ text +'">'; 
                tdobj.html(html_sel);
                
                $(".update_btn").bind("click", {type: "select"}, update);                     
                                
                $(window).keydown(function(e){//按esc键取消
                    var kNo = window.event?e.keyCode:e.which;
                    if(kNo==27){
                        var condition = $('#myform').serialize();
                        $.fn.jqTableWidget.renovate(data_url, condition);// 重载表格数据
                    }
                });
            }
            
            function textEdit(){        	   
          	  var url = tdobj.find("a").attr("href");       	 
                 if(url == undefined){         	   
                  var if_a = "false";
                 }else{
               	 var if_a = "true";           	   
                 }
          	   
                 var html_new = '<input type="text" value="' + text + '" class="editInput" />'; 
                 html_new += '<a class="icon-table icon-checked update_btn" href="javascript:void(0);" title="提交更新"></a>';
                 html_new += '<a class="icon-table icon-reload cancel_btn" href="javascript:void(0);" title="撤消操作"></a>';
                 if(if_a == "true"){           	   
              	   html_new += '<input type="hidden" value="'+ text +'" href="'+url+'">';   
                 }else{
                     html_new += '<input type="hidden" value="'+ text +'">';
                 }
                 var inputobj = $(html_new);              
                  //inputobj.width(tdobj.width());//获取原宽度;
                  tdobj.html(inputobj);  
                  //inputobj.get(0).select();
                  inputobj.get(0).focus();//添加选中焦点

                   //阻止文本框二次双击的事件
                   inputobj.dblclick(function() {
                       return false;
                   });
                  
                  $(".update_btn").bind("click", {type: "text",ifa:if_a}, update);  	
            }
            
            function update(event){       	  
         	   var $this = $(event.target);//获取当前jquery对象
         	                	      	  
                var edit_id = $this.parents('tr').attr("row_id");
                var key = $this.parent('td').attr("ty");
                var new_val = $this.parent('td').children().first().val();             
                
                var need_update = false;
                
                if(event.data.type == "userAuto"){
             	   if(text != $this.prev().val()){
             		   need_update = true; 
             	   }            	   
                }else{
             	   if(text != new_val){
             		   need_update = true;            		   
             	   }            	   
                }
                             
                if(!need_update) {
                    var obj = $this.parent("td");
                    obj.html($this.prev().val());
                }else{  
                	var edit_data = '{id : edit_id, '+key+' : new_val}';
                    var edit_data = eval('('+ edit_data +')'); 
                    //var str = JSON.stringify(edit_data);
                    //alert(str);
                    
                  $.fn.jqTableWidget.update(edit_data);//数据插入数据库          
                  
                  var obj = $this.parent("td");            
                   if(event.data.type == "select"){
                 	 obj.html($this.prev().find("option:selected").text());              	 
                   }else{              	 
                 	 if(event.data.ifa == "true"){
                 		 var href = obj.children().last().attr("href"); 
                 		 obj.html('<a href="'+href+'">'+$this.prev().val()+'</a>');
                 	 }else{               		 
                 		 obj.html($this.prev().val()); 	 
                 	 }

                   }
                                                                            
                  var showType = $("#tb_list_show thead th[row_s="+ key +"]").attr("type");            
                  if(showType=="percent"){//百分比显示需要更新显示
                   var condition = $('#myform').serialize();
                   $.fn.jqTableWidget.renovate(data_url, condition);// 重载表格数据
                   }   
                }
            }
            
            $(".cancel_btn").live("click",function(){ //取消操作   	
                var td_obj = $(this).parent().children(":last");
                var text = td_obj.val(); 
                var href = td_obj.attr("href");
                if(href!=undefined){               	
                $(this).parent().html('<a href="'+href+'">'+text+'</a>');	
                }else{
                 $(this).parent().html(text);	
                }             
            });
                                            
        });
    }
    
/*===========================分页功能=============================================*/
	$.fn.jqTableWidget.page = function(tbodyData, row_num, pageSize, cookiePageNum) {
		var currentPage;  
        if(cookiePageNum == undefined){          
            currentPage = 1;          
        }else{
            currentPage = cookiePageNum; 
        }
        
        newLoad(pageSize);//刷新载入
		
        function newLoad(pageSize){
            _currentData = ChangePager(tbodyData, pageSize, currentPage);        
             body_load(_currentData, row_num);//载入当前页数据;                       
            _createPageCode(tbodyData,pageSize,currentPage);//生成翻页的HTML代码   
        }
		
		       
        //rtnjson:所有数据，pageSize:一页显示多少个,currentPage:当前页码
        function ChangePager(rtnjson, pageSize, currentPage) {
            var allData = ProcessArray(rtnjson, pageSize);
            return allData[currentPage - 1];
        }		
                    
        //得到当前数据有多少页
        function GetPagecount(rtnjson, pageSize) {
            return ProcessArray(rtnjson, pageSize).length;
        }
		
		function ProcessArray(data, pageSize) {
            //计算出总页数
            var _pageTotal;
            if (data.length % pageSize == 0) {
                _pageTotal = data.length / pageSize;
            } else {
                _pageTotal = data.length / pageSize + 1;
            }            
            //整理成[ 
            //        [["name":"nyb"],["name":"lj"],["name":"yy"],...],
            //        [["name":"zx"],["name":"wg"],["name":"jl"],...],
            //        ... 
            //      ]
            //便于分页
            var parray = new Array();
            var lsdata = new Array();
            lsdata = data;
            for (var cp = 0; cp < parseInt(_pageTotal); cp++) {
                var stime = new Array();
                stime = lsdata.slice(0, pageSize);
                parray[cp] = stime;
                lsdata = lsdata.slice(pageSize, lsdata.length);
            }
            return parray;
        }
        
        //生成翻页的HTML代码
        function _createPageCode(allData, psize, currentPage) {
            var totalItem = allData.length;
            var totalPape = GetPagecount(allData, psize);
            $("#table_plugin_box #page a").die("click");
            $("#table_plugin_box #page").html("");
            $("#table_plugin_box #page").append("<a href='javascript:void(0);' class='prePage'>上一页</a> ");
            var str = "";
            for (var i = 0; i < totalPape; i++) {
                if (i + 1 == currentPage) {
                    str += "<a href='javascript:void(0);' class='currentPage'>" + (i + 1) + "</a> ";
                } else if (i + 1 == GetPagecount(allData, psize)) {
                    str += "<a href='javascript:void(0);'>" + (i + 1) + "</a> ";
                } else {
                    str += "<a href='javascript:void(0);'>" + (i + 1) + "</a> ";
                }
            }
            $("#table_plugin_box #page").append(str);
            $("#table_plugin_box #page").append("<a href='javascript:void(0);' class='nextPage'>下一页</a> &nbsp;&nbsp;&nbsp;");
            
            var str_select = '每页显示<select id="pageSize" class="page-size" name="pageSize">';
            
            if(psize == 10){               
                str_select += '<option value="10" selected = "selected">10</option>';              
            }else{
                str_select += '<option value="10">10</option>';       
            }
            
            if(psize == 20){               
                str_select += '<option value="20" selected = "selected">20</option>';              
            }else{
                str_select += '<option value="20">20</option>';       
            }
            
            if(psize == 30){               
                str_select += '<option value="30" selected = "selected">30</option>';              
            }else{
                str_select += '<option value="30">30</option>';       
            }
            
            if(psize == 50){               
                str_select += '<option value="50" selected = "selected">50</option>';              
            }else{
                str_select += '<option value="50">50</option>';       
            }
            
            if(psize == 100){               
                str_select += '<option value="100" selected = "selected">100</option>';              
            }else{
                str_select += '<option value="100">100</option>';       
            }
            
            str_select += '</select>条';    
            
            $("#table_plugin_box #page").append(str_select);
            $("#table_plugin_box #page").append("&nbsp;&nbsp;共<span><b>"+totalPape+"</b></span>页&nbsp;&nbsp;共<span><b>"+totalItem+"</b></span>条");
            
            $("#table_plugin_box #page a").live("click", function(){
                currentPage = $(this).text();  
                var cookiePageNum = $("#table_plugin_box #page").find("a.currentPage").text(); 
                if(currentPage == "下一页"){
                    currentPage = parseInt(cookiePageNum) + 1;
                    if(currentPage > totalPape) {
                        alert("没下一页了！")
                        return;                     
                    }
                }else if(currentPage == "上一页"){
                    currentPage = parseInt(cookiePageNum) - 1;
                    if(currentPage < 1) {
                        alert("没上一页了！")
                        return;
                    }
                }
                var _rtnjson = new Array();
                _rtnjson = ChangePager(allData, psize, currentPage);  
                
                showArr = new Array();
                $("#selectRight select option").each(function(i) {
                	showArr.push($(this).val());
                });
                
                body_load(_rtnjson, row_num);//载入数据！
                
                $("#table_plugin_box #page a:contains("+currentPage+")").attr("class", "currentPage");
                $("#table_plugin_box #page a:contains("+currentPage+")").siblings("a").removeAttr("class");
            });           
        }
        
        $("#table_plugin_box #page #pageSize").live("change", function(){  
            showArr = new Array();
            $("#selectRight select option").each(function(i) {
            	showArr.push($(this).val());
            });
            
            var newPageSize = $(this).val();         
            newLoad(newPageSize);
            $.cookie("pageSizeC",newPageSize, {expires: 7, path: '/aone2/project/'});
        });  
}	
	
/*===============================*扩展功能所需要调用的方法 start*===================================*/
			
 /*================== function-过滤器保存框 ==================*/
    function save_define_box(){
        var new_html = '<div class="modal hide fade" id="filter_save_box" style="display:none;">';
        new_html += '<form action="" class="form-horizontal" name="myModal_save" id="myModal_save" method="post" >';
        new_html += '<div class="modal-header">';
        new_html += '<a class="close" data-dismiss="modal">×</a>';
        new_html += '<h3>保存过滤器</h3>';     	
        new_html += '</div>';
        new_html += '<div class="modal-body">';
		new_html += '<div class="control-group">';
		new_html += '<label for="defineName">条件名称:</label>';
		new_html += ' <div class="controls">';
		new_html += '<input type="text" name="defineName" />';
		new_html += ' </div>';
		new_html += ' </div> ';
		new_html += '<div class="control-group">';
		new_html += '<label for="isPublic">是否公开:</label>';
		new_html += '<div class="controls">';
		new_html += '   <input type="checkbox" name="isPublic" />';
		new_html += ' </div>';
		new_html += ' </div>  ';
        new_html += '</div>';
        new_html += '<div class="modal-footer">';
        new_html += '<input class="btn" data-dismiss="modal" name="commit" type="button" value="取消"/>';
        new_html += '<input class="btn btn-primary" type="button" name="save_btn"  value="确定"/>';
        new_html += '</div>';
        new_html += '</form>';
        new_html += '</div>';

        $("body").append(new_html);
	   
	    $("#filter_save_box input[name='save_btn']").live("click",function(){
			var defineName = $("#filter_save_box input[name='defineName']").val(); 
			var isPublic = $("#filter_save_box input[name='isPublic']:[checked]").val();  
             
			if($("#filter_save_box input[name='isPublic']").attr("checked")){
               isPublic = "true";  
			}else{
               isPublic = "false";
			}
			$("#myform input[name='defineName']").val(defineName);        
			$("#myform input[name='isPublic']").val(isPublic); 
         
			function strToObj(str){  
				str = str.replace(/&/g,"','");  
				str = str.replace(/=/g,"':'");  
				str = "({'"+str +"'})";  
				obj = eval(str);   
				return obj;  
			}
				
			var total = $("#add_filter_select").attr("temp_num");		
            var condition = $('#myform').serialize();
			var ob = strToObj(condition); 			
			var search_json = {};　					
			for ( var i = 1; i <= total; i++) {
				var name = ob['id_'+i];
				var leftParentheses =  ob['leftParentheses_'+i];
				var sign = ob['sign_'+i];
				var value = ob['value_'+i];	
				var rightParentheses =  ob['rightParentheses_'+i];
				var andor =  ob['andor_'+i];
				var temp = {
        		        "name": name,
        			    "leftParentheses": leftParentheses,
        			    "defaultCondition" : sign,
        			    "defaultOption" : value,
        			    "rightParentheses" : rightParentheses,
        			    "andor" : andor
        		        };
				search_json[name] = temp;					
			} 
			
			var column_show = {};
			$("#selectRight select option").each(function(){				
				column_show[$(this).val()] = true;
			});	
			$("#selectLeft select option").each(function(){				
				column_show[$(this).val()] = false;
			});				
				
			var group_val = $("#group_select").val();

            var filterDate = {};
				filterDate['search'] = search_json;
				filterDate['column'] = column_show;
				filterDate['group'] = group_val;								
			          
            $.ajax({
               type : "POST",
               url : save_filter_url,
               data : {"name" : defineName,"filter" : filterDate}, 
               dataType: "html",
               success : function(msg) {       	   
            	   if(msg == "true"){
                      alert("条件保存成功！");
                    }else{                    	
                      alert("条件保存失败！");	
                    }
                   location.reload();
               },
               error : function(XMLHttpRequest, textStatus, errorThrown) {
                   alert("ajax error");
               }
            });                 
        }); 			
	}
			
})(jQuery);