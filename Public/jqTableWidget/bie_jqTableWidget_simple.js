/* 1. jQuery.fn.TableCont.sel_load()//载入下拉项；
 * 2. jQuery.fn.TableCont.add_filter('default')//载入下拉项 //需要传入过滤器项数据
 * 3. jQuery.fn.TableCont.renovate();//载入默认数据
 * 4. jQuery.fn.TableCont.row_load();//载入默认列显示隐藏控制器
 * 5. jQuery.fn.TableCont.group_load();// 载入分组控制
 * 6. jQuery.fn.TableCont.page(120,6);//分页
 * Version: 2.5
 * Requires jQuery 1.6.4+
 | body_load 
 */
(function($) {
    $.fn.serializeJSON = function() {//返回josn数据
        var json = {};
        $.map($(this).serializeArray(), function(n, i){
            json[n['name']] = n['value'];
        });
        return json;
    };
    $.fn.jqTableWidget = function(options) {
        var defaults = {
            frame_id : 'tb_box',
            setting : '',
            data_url : '',
            del_url : '',
            edit_url : '',
            save_url : '',
            sel_switch : 'on',
            row_switch : 'on',
            group_switch : 'on',
            edit_switch : 'on',
            callbacks : null
        }

        var opts = $.extend(defaults, options);        
        
        window.formObject = opts.formObject;
        window.setting = opts.setting;
        window.data_url = opts.data_url;
        window.del_url = opts.del_url;
        window.edit_url = opts.edit_url;
        window.save_url = opts.save_url;
        window.close_url = opts.close_url;
        window.data_key = opts.data_key;
        window.edit_switch = opts.edit_switch;
        window.do_switch = opts.do_switch;
        window.callbacks = opts.callbacks;
       
        //var strSetting = JSON.stringify(setting)           
        //alert(strSetting); //用于测试     
        
        $.fn.jqTableWidget.frame_load(opts.frame_id);
        // 载入表单页面框架

        if(opts.sel_switch == 'on') {
            $.fn.jqTableWidget.sel_box();
            // 载入box
            $.fn.jqTableWidget.sel_load(opts.setting);
            // 载入下拉选项
            $.fn.jqTableWidget.add_filter('default');
        }

        if(opts.row_switch == 'on' || opts.group_switch == 'on') {
            $.fn.jqTableWidget.show_box();
        }

        if(opts.row_switch == 'on') {
            $.fn.jqTableWidget.row_box();
            $.fn.jqTableWidget.row_load(opts.setting);
        // 载入默认列显示隐藏
        }

        if(opts.group_switch == 'on') {
            $.fn.jqTableWidget.group_load(opts.setting);
        // 载入分组控制
        }

        if(opts.sel_switch == 'on' || opts.row_switch == 'on' || opts.group_switch == 'on') {
            $.fn.jqTableWidget.row_botton();
            $("legend.leg_title").click(function() {
                $(this).parent().toggleClass("collapsed");
                $(this).next("div").toggle();
            });
        }

        $('#app_btn').ready(function() {
            var condition = $('#myform').serialize();
            //alert(condition);
            $.fn.jqTableWidget.renovate(data_url, condition);// 载入默认表格数据
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
        //点击清除功能
        $.fn.jqTableWidget.clear = function() {
            // 载入默认过滤器
            //$("#add_filter_select").find("option:disabled").attr("disabled", false); //把已经禁用的下来项设为可用
            $.fn.jqTableWidget.sel_load(opts.setting);
            // 载入下拉选项
            $.fn.jqTableWidget.add_filter('default');
            $.fn.jqTableWidget.row_load(opts.setting);
            //恢复默认显示列表项
            $("#group_select option:first").attr('selected', 'selected');
            //清除分组
            $.fn.jqTableWidget.renovate(data_url);
        }
        return this //返回一个jquery对象
    };
    /*报表控件框架盒子载入*/
    $.fn.jqTableWidget.frame_load = function(boxId) {
        frame_box = '<div id="table_plugin_box">';
        frame_box += '<div class="control_box"><form action="" id="myform" method="post"></form></div>';
        frame_box += '<div id="tb_list_show"><form action="" id="change_data" method="post"><table class="list issues"><thead></thead></div><tbody></tbody></table></form></div>';
        frame_box += '<div id="ontrol" >' + '<input name="" type="button" id="sel_all" value="全选" />' + '<input name="" type="button" id="sel_fan" value="反选" />' + '<input name="" type="button" id="sel_none" value="全不选" />' + '</div>';
        frame_box += '<div id="page" class="page"></div>';
        frame_box += '</div>';

        $("#" + boxId).html(frame_box);
    }

    $.fn.jqTableWidget.sel_box = function() {
        var sel_box = '';
        sel_box += '<fieldset class="collapsible">';
        sel_box += '<legend class="leg_title">过滤器</legend>';
        sel_box += '<div class="control">';
        sel_box += '<div id="filter_box" class="filter_box"><table><tbody></tbody></table></div>';
        sel_box += '<div id="sel_box" class="sel_box"></div>';
        sel_box += '</div>';
        sel_box += '</fieldset>';

        $("#table_plugin_box .control_box form").append(sel_box);
    }

    $.fn.jqTableWidget.show_box = function() {
        var show_box = '';
        show_box += '<fieldset class="collapsible collapsed">';
        show_box += '<legend class="leg_title">选项</legend>';
        show_box += '<div class="show_group" style="display: none;">';
        show_box += '<div id="row_control" class="row_control"></div>';
        show_box += '<div id="group_control" class="group_control"></div>';
        show_box += '</div>';
        show_box += '</fieldset>';

        $("#table_plugin_box .control_box form").append(show_box);
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
    /*更新数据保存*/
    $.fn.jqTableWidget.update = function(edit_data) {      	
        //var str = JSON.stringify(edit_data);?
        //var data ='data=' + str; ? 
        $.ajax({
            type : "POST",
            url : edit_url,
            dataType:"html",
            data : edit_data,
            success : function(msg) {
                //alert("Data Saved: " + msg);
                //alert("保存成功！");
                $(".changedataDiv").remove();
                var condition = $('#myform').serialize();
                $.fn.jqTableWidget.renovate(data_url, condition);
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            }
        });   
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

    /*过滤器下拉框选项载入*/
    $.fn.jqTableWidget.sel_load = function(data) {
        var sel_data = data.selectOption;

        var Disabled = new Array();
        Disabled = data.filterData.defaulted;
        //默认已经打开的选项

        var sel_html = '<select id="add_filter_select">';
        sel_html += '<option value=""></option>';

        $.each(sel_data, function(i, item) {
            var ifDisabled = Disabled.contains(item.id);
            //判断是为可选

            if(ifDisabled) {
                sel_html += '<option value=' + item.id + ' id="' + item.id + '" disabled="disabled"  selected="selected">' + item.name + '</option>';
            } else {
                sel_html += '<option value=' + item.id + ' id="' + item.id + '" >' + item.name + '</option>';
            }
        });
        sel_html += ' </select>';      
        $("#sel_box").html(sel_html);
    }
    /*动态显示过滤器项*/
    $.fn.jqTableWidget.add_filter = function(obj) {
        var $bj = $(obj);
        //Dom对象转换成jquery对象用 $( ) 把对象包装起来
        var sel_id = $bj.val();
        //选中的sel项id

        var filter_data = setting.filterData;

        $bj.find("option:selected").attr("disabled", "disabled");
        //设置已选择的项为不可用

        var default_load = function(id) {//动态添加过滤器项方法
            eval("filter_obj = filter_data.selection." + id);
            var filter_html = '<tr>';
            filter_html += '<td style="width:100px; min-width:100px;">';
            filter_html += '<input type="checkbox" value="' + id + '" id="' + id + '" tye="' + filter_obj.type + '" checked="checked">';
            filter_html += '  <label for="' + id + '">' + filter_obj.name + '</label></td>';
            filter_html += '<td class="select_1" style="width:200px;min-width:200px;"><div class="' + id + '"><select name="sign_' + id + '" style="min-width:180px;">';
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
                switch (filter_obj.type) {
                    case 'select':
                        filter_html += '<select name="value_' + id + '" style="min-width:180px;">';
                        var defaultOption = filter_obj.defaultOption;
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
                        var defaultOption = filter_obj.defaultOption;
                        filter_html += '<input name="value_' + id + '" type="text" value="' + defaultOption + '"  />';
                        break
                    case 'date':
                        var defaultOption = filter_obj.defaultOption;
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
            var default_id = filter_data.defaulted;
            $.each(default_id, function(i, item) {
                default_load(item);
            });
        }
        else {
            var sel_id = obj.value;
            default_load(sel_id);
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
    /*表格列显示隐藏功能载入*/
    $.fn.jqTableWidget.row_box = function() {
        var row_control = "";
        row_control += '<div id="selectLeft" class="row1"></div>';
        row_control += '<div id="row_show" class="row_show"><input type="button" value="→" id="toRight"/><br/><input type="button" value="←" id="toLeft"/>  </div>';
        row_control += '<div id="selectRight" class="row2"></div>';
        row_control += '<div id="row_order" class="row_order"></div>';
        row_control += '<div style="clear:both;"></div>';

        $("#row_control").html(row_control);
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
    
    //载入默认列显示隐藏控制器
    $.fn.jqTableWidget.row_load = function(data) {
        var row_html1 = '<select multiple style="width:180px;min-height:160px;">';
        var row_html2 = '<select multiple style="width:180px;min-height:160px;">';
        var row_data = data.row;
        $.each(row_data, function(i, item) {
            var id = item.id;
            if(item.show == false) {
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
    
    /*分组控制载入*/
    $.fn.jqTableWidget.group_load = function(data) {
        var group_html = '根据此条件分组 <select id="group_select" style="width:180px">';
        group_html += '<option value=""></option>';
        var group_data = data.group;
        $.each(group_data, function(i, item) {
            if(item.selected == false) {
                group_html += '<option value=' + item.id + '>' + item.name + '</option>';
            } else {
                group_html += '<option value=' + item.id + ' selected="selected">' + item.name + '</option>';
            }
        });
        group_html += ' </select>';

        $("#group_control").html(group_html);
    }

    
    /*载入按钮*/
    $.fn.jqTableWidget.row_botton = function() {
        var row_botton = '<div id="buttons" class="buttons" >';
        row_botton += '<input type="hidden" name="defineName"  value="" /><input type="hidden" name="isPublic"  value="" />';
        row_botton += '<label class="btn_title">查询条件操作：</label><div class="box"><a href="javascript:void(0);" id="app_btn" class="icon icon-checked">应用</a>';
        row_botton += '<a href="javascript:void(0);" id="clear_btn" class="icon icon-reload">清除</a>';
        row_botton += '<a href="javascript:void(0);" id="save_btn" class="icon icon-save">保存查询条件</a></div>';
        if(do_switch == 'on'){
            row_botton += '<div style="float:right; margin-left:40px; "><label class="btn_title">工作项操作：</label><div class="box"><a href="javascript:void(0);" id="add_tr_btn"  style="display:none;" class="icon con-checked">添加一条</a>';
            row_botton += '<a href="javascript:void(0);" id="close_tr_btn" class="icon con-checked">批量关闭</a>';
            row_botton += '<a href="javascript:void(0);" id="del_tr_btn" class="icon con-checked">批量删除</a></div></div>';
        }
        row_botton += '</div>';

        $("#table_plugin_box .control_box form").append(row_botton);
        //点击应用功能
        $("#app_btn").click(function() {
            var condition = $('#myform').serialize();
            alert(condition);
            $.fn.jqTableWidget.renovate(data_url, condition);
        });

        $("#clear_btn").click(function() {
            $.fn.jqTableWidget.clear();
        });

        $("#save_btn").click(function() {
            var condition = $('#myform').serialize();
            //alert(condition);
            $.fn.jqTableWidget.renovate(data_url, condition);// 载入默认表格数据          
            $("#myModal_saveReportDefine").modal();
        });

        $("#add_tr_btn").click(function() {   
            if($(".changedataDiv").length>0){
                alert("不能一次同时增加两条数据！");
                return;
            }
            var td_num = $("#tb_list_show table thead th").length;               
            var str = '<td><input type="checkbox" /><input type="hidden" name="formObject" value="'+ formObject +'" /><input type="hidden" name="id" value="" /></td>';
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
            //var str = JSON.stringify(condition)           
            //alert(str); //用于测试           
            $.fn.jqTableWidget.update(condition);              
        /*$.ajax({
                type : "POST",
                url : edit_url,
                data : condition, 
                success : function(msg) {
                    //alert("Data Saved: " + msg);
                    $(".saveDiv").remove();
                    var condition = $('#myform').serialize();
                    $.fn.jqTableWidget.renovate(data_url, condition);
                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("ajax error");
                }
            });  */                                              
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
    //判断数组中是否包含某个元素
    Array.prototype.contains = function(element) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] == element) {
                return true;
            }
        }
        return false;
    }
    
    function body_load(td_body, row_num) {       
        var body_html = '';
        body_html += '<tr id="new_tr"></tr>';
        var colspan = row_num + 3;
        //需要合并的列数 即colspan值
        var group_id = $('#group_select').val();//分组字段ID
        if(!(group_id == null || group_id == '')) {
            var group_item = new Array();
            $.each(td_body, function(i, item) {
                eval("group_obj = item.data." + group_id);
                group_item.push(group_obj);
            });
            group_item = group_item.unique5();
            //删除数组中重复项，形成新数组
            var group_item_length = group_item.length;
            var st_num = new Array();
            for(var i = 0; i < group_item_length; i++) {
                var group_val = group_item[i];
                var num = 0;
                body_html += '<tr class="group open "><td colspan="' + colspan + '" style="text-align:left;"><span class="expander" onclick="jQuery.fn.TableCont.toggleRowGroup(this)">&nbsp;</span>' + group_item[i] + '<span class="count"></span></td></tr>';
                $.each(td_body, function(i, item) {
                    var body_attribute = item.attribute;
                    var bady_data = item.data;
                    var tr_class = body_attribute.bgColor;
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
                    eval("id_only = bady_data." + data_key);                    
                    //列唯一标志
                    
                    if(objs_sv == group_val) { 
                        num++;
                        body_html += '<tr class = "'+tr_class+'" ifEdit= "'+ifEdit+'" row_id = "' + id_only + '" >';
                        body_html += '<td><input type="checkbox" value="' + bady_data.id + '" name="ids[]" id="' + bady_data.id + '"></td>';
                        if(do_switch == 'on'){
                            body_html += '<td><a href="javascript:void(0)" class="actDone">操作</a></td>';
                        }
                        body_html += '<td class ="'+hasFiles+'"></td>';
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
                var tr_class = body_attribute.bgColor;
                var ifHasFile = body_attribute.hasFile;
                var ifEdit = body_attribute.edit;
                var hasFiles = ""; 
                if(ifHasFile) {
                    hasFiles = "hasFiles";
                } else {
                    hasFiles = ""; 
                }
                                    
                eval("id_only = bady_data." + data_key);
                //列唯一标志
                
                body_html += '<tr class = "'+tr_class+'" ifEdit= "'+ifEdit+'" row_id = "' + id_only + '" >';
                body_html += '<td><input type="checkbox" value="' + id_only + '" name="ids[]" id="' + id_only + '"></td>';
                if(do_switch == 'on'){
                    body_html += '<td><a href="javascript:void(0)" class="actDone">操作</a></td>';
                }
                body_html += '<td class ="'+hasFiles+'"></td>';
                               
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
                        body_html += '<td ty="' + field + '" style="display:' + display + '; "><a href="' + td_url + '" title="' + td_text + '">' + td_text + '</a></td>';
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
                $(".doneDiv").fadeOut("fast").remove();
            })
            function doneDivLoad(doneId,relativeX,relativeY){                                          
                var doneDiv  = '<div class="doneDiv"><ul>';
                doneDiv  += '<li id = "tr_updata" doneId = '+doneId+'><a href="javascript:void(0);">更新</a></li>';
                doneDiv  += '<li id = "tr_close" doneId = '+doneId+' ><a href="javascript:void(0);">关闭</a></li>';
                doneDiv  += '<li id = "tr_del" doneId = '+doneId+' ><a href="javascript:void(0);">删除</a></li>';
                // doneDiv  += '<li id="tr_up" doneId = '+doneId+' ><a href="javascript:void(0);">上传附件</a></li>';
                doneDiv  += callbacks.doneHtml(doneId);
                doneDiv  += '</ul></div>';
               
                $(doneDiv).css({
                    "position":"absolute",
                    "display":"none",
                    "top": relativeY+10,
                    "left":relativeX+10
                }).appendTo("#table_plugin_box").slideDown("slow");           
            }                          
        });       
    }
    
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
        var str = '<td><input type="checkbox" /><input type="hidden" name="formObject" value="'+ formObject +'" /><input type="hidden" name="id" value="'+up_id+'" /></td>';         
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
        //var str = JSON.stringify(condition)           
        //alert(str); //用于调试                      
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
	

    /*表格数据刷新载入*/
    $.fn.jqTableWidget.renovate = function(url, params) {
        $.post(url, params, function(data) { 
            //var str = JSON.stringify(data)           
            //alert(str); //用于测试
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
            head_html += '<th style="width:2%;"><input type="checkbox" disabled=disabled></th>';
            if(do_switch == 'on'){
                head_html += '<th style="width:2%;">操作</th>';
            }
            head_html += '<th style="width:2%;" class="hasFiles"></th>';

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
            row_num = showArr.length;
            body_load(td_body, row_num);                   
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
            $(this).addClass("color3");
        });

        $("#tb_list_show table > tbody").delegate("tr", "mouseout", function() {
            $(this).removeClass("color3");
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
    $.fn.jqTableWidget.page = function(totalData, pageSize) {
        var totalData = totalData;
        //共多少条数据
        var pageSize = pageSize;
        //一次显示多少页
        var pageNum = 8;
        //一次显示多少页
        var totalPageCount = totalPageCount;
        //总页数
        var currentPageIndex = 1;
        //导航当前页索引
        if(totalData <= pageSize) {
            totalPageCount = 1;
        } else if(parseInt(totalData / pageSize) > 1 && totalData % pageSize == 0) {
            totalPageCount = totalData / pageSize;
        } else {
            totalPageCount = parseInt(totalData / pageSize) + 1;
        }

        function overPage(event) {
            if(($(event.target).text() !== "下一页") && ($(event.target).text() !== "上一页")) {
                $(event.target).addClass("pagenumberselected");
            }
        }

        function outPage(event) {
            $(event.target).removeClass("pagenumberselected");
        }

        function selectPage(event) {

            var txt = $(event.target).text();
            switch (txt) {
                case '上一页':
                    currentPageIndex = parseInt($(".pagenumberselected").text()) - 1;
                    if(currentPageIndex < 1) {
                        return;
                    }
                    break
                case '下一页':
                    currentPageIndex = parseInt($(".pagenumberselected").text()) + 1;
                    if(currentPageIndex > totalPageCount) {
                        return;
                    }
                    break
                default:
                    currentPageIndex = $(event.target).text();
            }

            var page_data = {
                "current" : "'+currentPageIndex+'",
                "pageSize" : "'+pageSize+'"
            };
            //alert(page_data);
            $.fn.jqTableWidget.renovate(data_url, page_data);
            createPage();
        }

        function createPage() {
            if(totalPageCount < 1 || pageNum < 1) {
                return;
            }
            $("#page").html("");
            var start = currentPageIndex - (Math.ceil(pageNum / 2) - 1);
            //限制开始页数，每页数小于总页数时
            if(pageNum < totalPageCount) {
                if(start < 1) {
                    start = 1;
                } else if(start + pageNum > totalPageCount) {
                    start = totalPageCount - pageNum + 1;
                }
            } else {
                start = 1;
            }
            var end = start + pageNum - 1;
            //限制结束页数，当结束页数大于总页数时
            if(end > totalPageCount) {
                end = totalPageCount;
            }
            var page_html;
            page_html = "<span><a href=\"#\" id='prev' class=\"pagenumber\">上一页</a></span>";

            for(var i = start; i <= end; i++) {

                if(i == currentPageIndex) {
                    page_html += "<a href=\"#\" class=\"pagenumber pagenumberselected\">" + i + "</a>";
                } else {
                    page_html += "<a href=\"#\" class=\"pagenumber\">" + i + "</a>";
                }

            }
            page_html += "<span><a href=\"#\" id='next' class=\"pagenumber\">下一页</a></span>";
            page_html += "<span>共" + totalPageCount + "页</span>";

            $("#table_plugin_box #page").html(page_html);
            //给所有项绑定事件
            $("#table_plugin_box .pagenumber").bind("click", selectPage).hover(overPage, outPage);
            //当前页不绑定事件
            $("#table_plugin_box .pagenumberselected").unbind("click").unbind("mouseenter").unbind("mouseleave");
        }
        
        window.onload = createPage;
    }
})(jQuery);
