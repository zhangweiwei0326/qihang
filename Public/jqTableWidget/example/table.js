jQuery(function($) {
    
    var setting = {
        "selectOption":[
        {
            "id":"id",
            "name":"ID"
        },

        {
            "id":"status",
            "name":"状态"
        },

        {
            "id":"subject",
            "name":"主题"
        },

        {
            "id":"priority",
            "name":"优先级"
        },

        {
            "id":"definition",
            "name":"类型"
        },

        {
            "id":"assignee",
            "name":"指派给"
        },

        {
            "id":"manHours",
            "name":"人时"
        },

        {
            "id":"startDate",
            "name":"开始日期"
        },

        {
            "id":"endDate",
            "name":"完成日期"
        },

        {
            "id":"points",
            "name":"完成(%)"
        }
        ],

        "filterData" : {
            "defaulted":["status"],
            "selection" : {
                "id":{
                    "defaultName":"",
                    "defaultCondition":"all",
                    "condition":[
                    {
                        "id":"all",
                        "hasOption":false,
                        "name":"[所有]",
                        "value":"all"
                    },

                    {
                        "id":"equal",
                        "hasOption":true,
                        "name":"等于",
                        "value":"equal"
                    },

                    {
                        "id":"include",
                        "hasOption":true,
                        "name":"包含",
                        "value":"include"
                    },

                    {
                        "id":"none",
                        "hasOption":false,
                        "name":"[未设置]",
                        "value":"none"
                    }
                    ],
                    "name":"ID",
                    "type":"text",
                    "defaultOption":"",
                    "option":[]
                },
                "definition":{
                    
                    "defaultName":"",
                    "defaultCondition":"all",
                    "condition":[
                    {
                        "id":"all",
                        "hasOption":false,
                        "name":"[所有]",
                        "value":"all"
                    },

                    {
                        "id":"equal",
                        "hasOption":true,
                        "name":"等于",
                        "value":"equal"
                    },

                    {
                        "id":"notequal",
                        "hasOption":true,
                        "name":"不等于",
                        "value":"notequal"
                    },

                    {
                        "id":"none",
                        "hasOption":false,
                        "name":"[未设置]",
                        "value":"none"
                    }
                    ],
                    "name":"类型",
                    "type":"select",
                    "defaultOption":"普通任务",
                    "option":[
                    {
                        "id" : "2",
                        "name" : "普通任务",
                        "value" : "2"
                    }, 

                    {
                        "id" : "1",
                        "name" : "评审任务",
                        "value" : "1"
                    }]
                },

                "status":{
                    "defaultName":"",
                    "defaultCondition":"all",
                    "condition":[
                    {
                        "id":"all",
                        "hasOption":false,
                        "name":"[所有]",
                        "value":"all"
                    },

                    {
                        "id":"equal",
                        "hasOption":true,
                        "name":"等于",
                        "value":"equal"
                    },

                    {
                        "id":"notequal",
                        "hasOption":true,
                        "name":"不等于",
                        "value":"notequal"
                    },

                    {
                        "id":"none",
                        "hasOption":false,
                        "name":"[未设置]",
                        "value":"none"
                    }
                    ],
                    "name":"状态",
                    "type":"select",
                    "defaultOption":"新提交",
                    "option":[
                    {
                        "id":"31",
                        "name":"新提交",
                        "value":"31"
                    },

                    {
                        "id":"32",
                        "name":"进行中",
                        "value":"32"
                    },

                    {
                        "id":"33",
                        "name":"已解决",
                        "value":"33"
                    },

                    {
                        "id":"34",
                        "name":"已关闭",
                        "value":"34"
                    },

                    {
                        "id":"35",
                        "name":"已拒绝",
                        "value":"35"
                    },

                    {
                        "id":"73",
                        "name":"暂停中",
                        "value":"73"
                    }]
                },

                "priority":{
                    "defaultName":"",
                    "defaultCondition":"all",
                    "condition":[
                    {
                        "id":"all",
                        "hasOption":false,
                        "name":"[所有]",
                        "value":"all"
                    },

                    {
                        "id":"equal",
                        "hasOption":true,
                        "name":"等于",
                        "value":"equal"
                    },

                    {
                        "id":"notequal",
                        "hasOption":true,
                        "name":"不等于",
                        "value":"notequal"
                    },

                    {
                        "id":"none",
                        "hasOption":false,
                        "name":"[未设置]",
                        "value":"none"
                    }],
                    "name":"优先级",
                    "type":"select",
                    "defaultOption":"P1",
                    "option":[{
                        "id":"21",
                        "name":"P1",
                        "value":"21"
                    },

                    {
                        "id":"22",
                        "name":"P2",
                        "value":"22"
                    },{
                        "id":"23",
                        "name":"P3",
                        "value":"23"
                    },{
                        "id":"24",
                        "name":"P4",
                        "value":"24"
                    },{
                        "id":"25",
                        "name":"P5",
                        "value":"25"
                    },

                    {
                        "id":"26",
                        "name":"P6",
                        "value":"26"
                    },{
                        "id":"27",
                        "name":"P7",
                        "value":"27"
                    },

                    {
                        "id":"28",
                        "name":"P8",
                        "value":"28"
                    }]
                },

                "subject":{
                    "defaultName":"",
                    "defaultCondition":"all",
                    "condition":[
                    {
                        "id":"all",
                        "hasOption":false,
                        "name":"[所有]",
                        "value":"all"
                    },

                    {
                        "id":"equal",
                        "hasOption":true,
                        "name":"等于",
                        "value":"equal"
                    },

                    {
                        "id":"include",
                        "hasOption":true,
                        "name":"包含",
                        "value":"include"
                    },

                    {
                        "id":"none",
                        "hasOption":false,
                        "name":"[未设置]",
                        "value":"none"
                    }
                    ],
                    "name":"主题",
                    "type":"text",
                    "defaultOption":"",
                    "option":[]
                },

                "assignee":{
                    "defaultName":"",
                    "defaultCondition":"all",
                    "condition":[
                    {
                        "id":"all",
                        "hasOption":false,
                        "name":"[所有]",
                        "value":"all"
                    },

                    {
                        "id":"equal",
                        "hasOption":true,
                        "name":"等于",
                        "value":"equal"
                    },

                    {
                        "id":"notequal",
                        "hasOption":true,
                        "name":"不等于",
                        "value":"notequal"
                    },

                    {
                        "id":"mine",
                        "hasOption":false,
                        "name":"[我的]",
                        "value":"mine"
                    },

                    {
                        "id":"notmine",
                        "hasOption":false,
                        "name":"[不是我的]",
                        "value":"notmine"
                    },

                    {
                        "id":"none",
                        "hasOption":false,
                        "name":"[未设置]",
                        "value":"none"
                    }
                    ],
                    "name":"指派给",
                    "type":"select",
                    "defaultOption":"孟天",
                    "option":[
                    {
                        "id":"-4",
                        "name":"孟天",
                        "value":"-4"
                    },

                    {
                        "id":"-3",
                        "name":"柳堂",
                        "value":"-3"
                    },

                    {
                        "id":"-1",
                        "name":"管理员",
                        "value":"-1"
                    },

                    {
                        "id":"8213",
                        "name":"末尘",
                        "value":"8213"
                    },

                    {
                        "id":"27934",
                        "name":"冰川",
                        "value":"27934"
                    },

                    {
                        "id":"28387",
                        "name":"若菲",
                        "value":"28387"
                    },

                    {
                        "id":"28578",
                        "name":"传鹰",
                        "value":"28578"
                    }]
                },

                "manHours":{
                    "defaultName":"",
                    "defaultCondition":"all",
                    "dataType":"float",
                    "condition":[
                    {
                        "id":"all",
                        "hasOption":false,
                        "name":"[所有]",
                        "value":"all"
                    },

                    {
                        "id":"equal",
                        "hasOption":true,
                        "name":"等于",
                        "value":"equal"
                    },

                    {
                        "id":"include",
                        "hasOption":true,
                        "name":"包含",
                        "value":"include"
                    },

                    {
                        "id":"none",
                        "hasOption":false,
                        "name":"[未设置]",
                        "value":"none"
                    }
                    ],
                    "name":"人时",
                    "type":"text",
                    "defaultOption":"",
                    "option":[]
                }, "startDate":{
                    "defaultName":"",
                    "defaultCondition":"all",
                    "condition":[
                    {
                        "id":"all",
                        "hasOption":false,
                        "name":"[所有]",
                        "value":"all"
                    },

                    {
                        "id":"equal",
                        "hasOption":true,
                        "name":"等于",
                        "value":"equal"
                    },

                    {
                        "id":"notequal",
                        "hasOption":true,
                        "name":"不等于",
                        "value":"notequal"
                    },

                    {
                        "id":"lessthan",
                        "hasOption":true,
                        "name":"小于 ",
                        "value":"lessthan"
                    },

                    {
                        "id":"morethan",
                        "hasOption":true,
                        "name":"大于",
                        "value":"morethan"
                    },

                    {
                        "id":"lessthan_equal",
                        "hasOption":true,
                        "name":"小于或等于   ",
                        "value":"lessthan_equal"
                    },

                    {
                        "id":"morethan_equal",
                        "hasOption":true,
                        "name":"大于或等于",
                        "value":"morethan_equal"
                    },

                    {
                        "id":"none",
                        "hasOption":false,
                        "name":"[未设置]",
                        "value":"none"
                    }
                    ],
                    "name":"开始日期",
                    "type":"date",
                    "defaultOption":"",
                    "option":[]
                },

                "endDate":{
                    "defaultName":"",
                    "defaultCondition":"all",
                    "condition":[
                    {
                        "id":"all",
                        "hasOption":false,
                        "name":"[所有]",
                        "value":"all"
                    },

                    {
                        "id":"equal",
                        "hasOption":true,
                        "name":"等于",
                        "value":"equal"
                    },

                    {
                        "id":"notequal",
                        "hasOption":true,
                        "name":"不等于",
                        "value":"notequal"
                    },

                    {
                        "id":"lessthan",
                        "hasOption":true,
                        "name":"小于 ",
                        "value":"lessthan"
                    },

                    {
                        "id":"morethan",
                        "hasOption":true,
                        "name":"大于",
                        "value":"morethan"
                    },

                    {
                        "id":"lessthan_equal",
                        "hasOption":true,
                        "name":"小于或等于   ",
                        "value":"lessthan_equal"
                    },

                    {
                        "id":"morethan_equal",
                        "hasOption":true,
                        "name":"大于或等于",
                        "value":"morethan_equal"
                    },

                    {
                        "id":"none",
                        "hasOption":false,
                        "name":"[未设置]",
                        "value":"none"
                    }
                    ],
                    "name":"完成日期",
                    "type":"date",
                    "defaultOption":"",
                    "option":[]
                },
                "points":{
                    "defaultName":"",
                    "defaultCondition":"all",
                    "dataType":"int",
                    "condition":[
                    {
                        "id":"all",
                        "hasOption":false,
                        "name":"[所有]",
                        "value":"all"
                    },

                    {
                        "id":"equal",
                        "hasOption":true,
                        "name":"等于",
                        "value":"equal"
                    },

                    {
                        "id":"include",
                        "hasOption":true,
                        "name":"包含",
                        "value":"include"
                    },

                    {
                        "id":"none",
                        "hasOption":false,
                        "name":"[未设置]",
                        "value":"none"
                    }
                    ],
                    "name":"完成(%)",
                    "type":"text",
                    "defaultOption":"",
                    "option":[]
                }                        
            }
        },
        "row":[{
            "id":"id",
            "linkPath":true,
            "name":"ID",
            "width":"5%",
            "edit":false,
            "nullable":false,
            "show":false,
            "type":"text",
            "options":{}
        },{
            "id":"title",
            "linkPath":true,
            "name":"标题",
            "width":"5%",
            "edit":true,
            "nullable":false,
            "show":true,
            "type":"text",
            "options":{}
        },{
            "id":"description",
            "linkPath":false,
            "name":"描述",
            "width":"5%",
            "edit":false,
            "nullable":false,
            "show":true,
            "type":"text",
            "options":{}
        },{
            "id":"status",
            "linkPath":false,
            "name":"状态",
            "width":"5%",
            "edit":true,
            "nullable":true,
            "show":true,
            "type":"select",
            "options":{
                "32":"进行中",
                "31":"新提交",
                "35":"已拒绝",
                "33":"已解决",
                "34":"已关闭",
                "73":"暂停中"
            }
        },{
            "id":"subject",
            "linkPath":false,
            "name":"所属项目",
            "width":"5%",
            "edit":true,
            "nullable":true,
            "show":true,
            "type":"text",
            "options":{}
        },{
            "id":"priority",
            "linkPath":false,
            "name":"优先级",
            "width":"5%",
            "edit":true,
            "nullable":false,
            "show":true,
            "type":"select",
            "options":{
                "21":"P1",
                "22":"P2",
                "23":"P3",
                "24":"P4",
                "25":"P5",
                "26":"P6",
                "27":"P7",
                "28":"P8"
            }
        },{
            "id":"type",
            "linkPath":false,
            "name":"类型",
            "width":"5%",
            "edit":false,
            "nullable":true,
            "show":true,
            "type":"select",
            "options":{
                "2":"普通任务",
                "1":"评审任务"
            }
        },{
            "id":"startDate",
            "linkPath":false,
            "name":"开始日期",
            "width":"5%",
            "edit":true,
            "nullable":false,
            "show":true,
            "type":"date",
            "options":{}
        },{
            "id":"endDate",
            "linkPath":false,
            "name":"完成日期",
            "width":"5%",
            "edit":true,
            "nullable":false,
            "show":true,
            "type":"date",
            "options":{}
        },{
            "id":"points",
            "linkPath":false,
            "name":"完成(%)",
            "width":"5%",
            "edit":true,
            "nullable":false,
            "show":true,
            "type":"percent",
            "options":{
                "20":"20%",
                "10":"10%",
                "0":"0%",
                "30":"30%",
                "40":"40%",
                "90":"90%",
                "70":"70%",
                "80":"80%",
                "60":"60%",
                "100":"100%",
                "50":"50%"
            }
        }
        ],

        "group":[
        {
            "id":"id",
            "selected":false,
            "name":"ID"
        },
        {
            "id":"status",
            "selected":false,
            "name":"状态"
        },
        {
            "id":"subject",
            "selected":false,
            "name":"主题"
        },
        {
            "id":"priority",
            "selected":false,
            "name":"优先级"
        },
        {
            "id":"definition",
            "selected":false,
            "name":"类型"
        },
        {
            "id":"assignee",
            "selected":false,
            "name":"指派给"
        },
        {
            "id":"manHours",
            "selected":false,
            "name":"人时"
        },
        {
            "id":"startDate",
            "selected":false,
            "name":"开始日期"
        },
        {
            "id":"endDate",
            "selected":false,
            "name":"完成日期"
        },
        {
            "id":"points",
            "selected":false,
            "name":"完成(%)"
        }]

    }

    jQuery.fn.TableCont({
        frame_id : 'table_box',
        setting : setting,
        data_url :'data/tbody_data.json',
        data_key : 'id',
        add_url : URL+"/add_ajax",
        del_url : URL+"/delData",
        edit_url : URL+"/update",
        batchClose_url : URL+"/batchClose",
        edit_switch : 'on',
        do_switch : 'on',
        callbacks :{
            "doneHtml":doneHtml,
            "batchClose":batchClose
        }
    });

    jQuery.fn.TableCont.page(1, 1);
    //分页 
    
    function doneHtml(tr_id){//本元素是动态生产的，要绑定事件需用bind要绑定；且方到Return语句之前才能生效； tr_id是数据ID    
        $("#tr_up").live("click",function(){                    
            alert("test");   
            window.open("http://www.zzjs.net","name","width=500,height=180,border=0");
        }); 
        var doneDiv = ""; 
        doneDiv  += '<li id="tr_up" doneId = '+tr_id+' ><a href="javascript:void(0);">上传附件</a></li>';
		doneDiv  += '<li id="tr_see" doneId = '+tr_id+' ><a href="singleShow?id='+tr_id+'">查看</a></li>';
        return doneDiv;     
    }
    
    function batchClose(close_url,doneId){
        var close = 'id='+doneId;
        $.ajax( {
            type : "POST",
            url : close_url,
            data : close,
            beforeSend : function(XMLHttpRequest) {
            // $("#dbutton")[0].value='正在删除...';
            },
            success : function(msg) {
                alert("修改成功！");
                var condition = $('#myform').serialize();
                $.fn.TableCont.renovate(data_url, condition);
            },
            complete : function(XMLHttpRequest, textStatus) {

            },
            error : function() {
                alert("wrong!");
            }
        });  
     
    }
        

});
