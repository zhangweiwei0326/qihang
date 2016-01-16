var setting = {

	"filterData": {

		"selection": {

			"id": {

				"id": "id",

				"name": "ID",

				"defaultName": "",

				"defaultCondition": "equal",

				"condition": [{

						"hasOption": false,

						"name": "[所有]",

						"value": "all"

					}, {

						"hasOption": true,

						"name": "等于",

						"value": "equal"

					}, {

						"hasOption": true,

						"name": "包含",

						"value": "include"

					}, {

						"hasOption": false,

						"name": "[未设置]",

						"value": "none"

					}

				],

				"type": "text",

				"defaultOption": "",

				"option": []

			},

			"type": {

				"id": "type",

				"name": "类型",

				"defaultName": "",

				"defaultCondition": "equal",

				"condition": [{

						"hasOption": false,

						"name": "[所有]",

						"value": "all"

					}, {

						"hasOption": true,

						"name": "等于",

						"value": "equal"

					}, {

						"hasOption": true,

						"name": "不等于",

						"value": "notequal"

					}, {

						"hasOption": false,

						"name": "[未设置]",

						"value": "none"

					}

				],

				"type": "select",

				"defaultOption": "bug",

				"option": [{

					"id": "2",

					"name": "普通任务",

					"value": "daily"

				}, {

					"id": "1",

					"name": "Bug任务",

					"value": "bug"

				}]

			},

			"status": {

				"id": "status",

				"name": "状态",

				"defaultName": "",

				"defaultCondition": "equal",

				"condition": [{

					"hasOption": false,

					"name": "[所有]",

					"value": "all"

				}, {

					"hasOption": true,

					"name": "等于",

					"value": "equal"

				}, {

					"hasOption": true,

					"name": "不等于",

					"value": "notequal"

				}],

				"type": "select",

				"defaultOption": "新提交",

				"option": [{

					"name": "新提交",

					"value": "new"

				}, {

					"name": "进行中",

					"value": "ing"

				}, {

					"name": "已解决",

					"value": "fixed"

				}, {

					"name": "已关闭",

					"value": "closed"

				}, {

					"name": "暂停中",

					"value": "suspend"

				}, {

					"name": "已拒绝",

					"value": "refuse"

				}]

			},

			"priority": {

				"id": "priority",

				"name": "优先级",

				"defaultName": "",

				"defaultCondition": "all",

				"condition": [{

					"hasOption": false,

					"name": "[所有]",

					"value": "all"

				}, {

					"hasOption": true,

					"name": "等于",

					"value": "equal"

				}, {

					"hasOption": true,

					"name": "不等于",

					"value": "notequal"

				}],

				"type": "select",

				"defaultOption": "p1",

				"option": [{

					"name": "P1",

					"value": "p1"

				}, {

					"name": "P2",

					"value": "p2"

				}, {

					"name": "P3",

					"value": "p3"

				}, {

					"name": "P4",

					"value": "p4"

				}]

			},

			"title": {

				"id": "title",

				"name": "主题",

				"defaultName": "",

				"defaultCondition": "all",

				"condition": [{

						"hasOption": false,

						"name": "[所有]",

						"value": "all"

					}, {

						"hasOption": true,

						"name": "等于",

						"value": "equal"

					}, {

						"hasOption": true,

						"name": "包含",

						"value": "include"

					}, {

						"hasOption": false,

						"name": "[未设置]",

						"value": "none"

					}

				],

				"type": "text",

				"defaultOption": "",

				"option": []

			},

			"assignee": {

				"id": "assignee",

				"name": "指派给",

				"defaultName": "",

				"defaultCondition": "all",

				"condition": [{

						"hasOption": false,

						"name": "[所有]",

						"value": "all"

					}, {

						"hasOption": true,

						"name": "等于",

						"value": "equal"

					}, {

						"hasOption": true,

						"name": "不等于",

						"value": "notequal"

					}, {

						"hasOption": false,

						"name": "[我的]",

						"value": "mine"

					}, {

						"hasOption": false,

						"name": "[不是我的]",

						"value": "notmine"

					}, {

						"hasOption": false,

						"name": "[未设置]",

						"value": "none"

					}

				],

				"type": "select",

				"defaultOption": "孟天",

				"option": [{

					"id": "-4",

					"name": "孟天",

					"value": "-4"

				}, {

					"id": "-3",

					"name": "柳堂",

					"value": "-3"

				}, {

					"id": "28578",

					"name": "传鹰",

					"value": "28578"

				}]

			},

			"manHours": {

				"id": "manHours",

				"name": "人时",

				"defaultName": "",

				"defaultCondition": "all",

				"dataType": "float",

				"condition": [{

						"hasOption": false,

						"name": "[所有]",

						"value": "all"

					}, {

						"hasOption": true,

						"name": "等于",

						"value": "equal"

					}, {

						"hasOption": true,

						"name": "包含",

						"value": "include"

					}, {

						"hasOption": false,

						"name": "[未设置]",

						"value": "none"

					}

				],

				"type": "text",

				"defaultOption": "",

				"option": []

			},

			"startDate": {

				"id": "startDate",

				"name": "开始日期",

				"defaultName": "",

				"defaultCondition": "all",

				"condition": [{

						"hasOption": false,

						"name": "[所有]",

						"value": "all"

					}, {

						"hasOption": true,

						"name": "等于",

						"value": "equal"

					}, {

						"hasOption": true,

						"name": "不等于",

						"value": "notequal"

					}, {

						"hasOption": true,

						"name": "小于 ",

						"value": "lessthan"

					}, {

						"hasOption": true,

						"name": "大于",

						"value": "morethan"

					}, {

						"hasOption": true,

						"name": "小于或等于",

						"value": "lessthan_equal"

					}, {

						"hasOption": true,

						"name": "大于或等于",

						"value": "morethan_equal"

					}, {

						"hasOption": false,

						"name": "[未设置]",

						"value": "none"

					}

				],

				"type": "date",

				"defaultOption": "",

				"option": []

			},

			"endDate": {

				"id": "endDate",

				"name": "完成日期",

				"defaultName": "",

				"defaultCondition": "all",

				"condition": [{

						"hasOption": false,

						"name": "[所有]",

						"value": "all"

					}, {

						"hasOption": true,

						"name": "等于",

						"value": "equal"

					}, {

						"hasOption": true,

						"name": "不等于",

						"value": "notequal"

					}, {

						"hasOption": true,

						"name": "小于 ",

						"value": "lessthan"

					}, {

						"hasOption": true,

						"name": "大于",

						"value": "morethan"

					}, {

						"hasOption": true,

						"name": "小于或等于",

						"value": "lessthan_equal"

					}, {

						"hasOption": true,

						"name": "大于或等于",

						"value": "morethan_equal"

					}, {

						"hasOption": false,

						"name": "[未设置]",

						"value": "none"

					}

				],

				"type": "date",

				"defaultOption": "",

				"option": []

			},

			"percent": {

				"id": "percent",

				"name": "完成(%)",

				"defaultName": "",

				"defaultCondition": "all",

				"dataType": "int",

				"condition": [{

						"hasOption": false,

						"name": "[所有]",

						"value": "all"

					}, {

						"hasOption": true,

						"name": "等于",

						"value": "equal"

					}, {

						"hasOption": true,

						"name": "包含",

						"value": "include"

					}, {

						"hasOption": false,

						"name": "[未设置]",

						"value": "none"

					}

				],

				"type": "text",

				"defaultOption": "",

				"option": []

			}

		}

	},



	"row": [{

		"id": "id",

		"name": "ID",

		"width": "",

		"edit": false,

		"group": false,

		"nullable": false,

		"type": "text",

		"options": {}

	}, {

		"id": "title",

		"name": "标题",

		"width": "22%",

		"edit": true,

		"group": false,

		"nullable": false,

		"type": "text",

		"options": {}

	}, {

		"id": "description",

		"name": "描述",

		"width": "",

		"edit": true,

		"group": false,

		"nullable": false,

		"type": "text",

		"options": {}

	}, {

		"id": "status",

		"name": "状态",

		"width": "",

		"edit": true,

		"group": true,

		"nullable": true,

		"type": "select",

		"options": {

			"new": "新提交",

			"ing": "进行中",

			"pause": "暂停中",

			"finished": "已完成",

			"closed": "已关闭"

		}

	}, {

		"id": "projectId",

		"name": "所属项目",

		"width": "",

		"edit": true,

		"group": true,

		"nullable": true,

		"type": "select",

		"options": {

			"1": "驿站网络平台开发",

			"2": "进行中"

		}

	}, {

		"id": "priority",

		"name": "优先级",

		"width": "",

		"edit": true,

		"group": true,

		"nullable": false,

		"type": "select",

		"options": {

			"p1": "p1",

			"p2": "p2",

			"p3": "p3",

			"p4": "p4"

		}

	}, {

		"id": "type",

		"name": "类型",

		"width": "",

		"edit": true,

		"group": true,

		"nullable": true,

		"type": "select",

		"options": {

			"daily": "普通任务",



			"bug": "bug修复"

		}

	}, {

		"id": "add_date",

		"name": "提交日期",

		"width": "",

		"edit": true,

		"group": false,

		"nullable": false,

		"type": "date",

		"options": {}

	}, {

		"id": "plan_start_date",

		"name": "计划开始日期",

		"width": "",

		"edit": true,

		"group": false,

		"nullable": false,

		"type": "date",

		"options": {}

	}, {

		"id": "plan_end_date",

		"name": "计划结束日期",

		"width": "",

		"edit": true,

		"group": false,

		"nullable": false,

		"type": "date",

		"options": {}

	}, {

		"id": "start_date",

		"name": "实际开始日期",

		"width": "",

		"edit": true,

		"group": false,

		"nullable": false,

		"type": "date",

		"options": {}

	}, {

		"id": "end_data",

		"name": "实际完成日期",

		"width": "",

		"edit": true,

		"group": false,

		"nullable": false,

		"type": "date",

		"options": {}

	}, {

		"id": "percent",

		"name": "完成比(%)",

		"width": "",

		"edit": true,

		"group": true,

		"nullable": false,

		"type": "percent",

		"options": {

			"0": "0%",

			"10": "10%",

			"20": "20%",

			"30": "30%",

			"40": "40%",

			"50": "50%",

			"60": "60%",

			"70": "70%",

			"80": "80%",

			"90": "90%",

			"100": "100%"

		}

	}],



	"defaultedFilter": {

		"defaultedSearch": [

			{
				"id": "status",
				"defaultCondition": "equal",
				"defaultOption": "ing",
				"idSerial": 1
			}

		],

		"column": {
			"id": false,
			"title": true,
			"description": false,
			"status": true,
			"priority": true,
			"priority": true,
			"type": true,
			"add_date": true,
			"plan_start_date": true,
			"plan_end_date": true,
			"start_date": false,
			"end_data": false,
			"percent": true
		},

		"group": ""

	}



}