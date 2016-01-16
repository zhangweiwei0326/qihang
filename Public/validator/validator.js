/**
 * @validator 表单验证组件
 * @author yangxiaoxu
 * @email lihuazhai_com@163.com
 * @website www.lihuazhai.com
 * @date 2015-02-03
 */
(function(mod) {
	if (typeof exports == "object" && typeof module == "object") // CommonJS
		module.exports = mod();
	else if (typeof define == "function" && define.amd) // AMD
		return define([], mod);
	else // Plain browser env
		this.Validator = mod();
})(function() {
	"use strict";
	/*
	*验证规则及对应提示信息
	*/
	var RULES = {
		required: {
			rule: function(ele) {
				var t = ele.attr("type");
				switch (t) {
					case "checkbox":
					case "radio":
						var n = ele.attr("name");
						var eles = this.formNode.find('input[name="' + n + '"]');
						return util.some(ele, function(item) {
							return item.attr("checked");
						});
					default:
						var v = ele.val();
						if (!v) {
							return false;
						}
						return true;
				}
			},
			triggerMethod: ['blur'],
			tip: '请输入%s'
		},
		trimAll: {
			rule: function(ele) {
				var val = ele.val().replace(/\s+/g, '');
				ele.val(val);
				return true;
			},
			tip: ' %s去除空格'
		},
		minLength: {
			rule: function(ele, num) {
				return ele.val().length >= num;
			},
			tip: '输入的%s长度不能小于%s位'
		},
		maxLength: {
			rule: function(ele, num) {
				return ele.val().length <= num;
			},
			tip: '输入的%s长度不能大于%s位'
		},
		minValue: {
			rule: function(ele, num) {
				return parseFloat(ele.val()) >= num;
			},
			tip: '%s不能小于%s'
		},
		name: {
			rule: /^[\u2FFF-\u9FFF]+(?:·[\u2FFF-\u9FFF]+)*$/,
			tip: '%s格式不正确'
		},
		identity: {
			rule: function(ele) {
				var val = ele.val().replace(/\s+/g, '');
				ele.val(val);
				if (/^\d{15}$|^\d{17}[0-9a-zA-Z]$/.test(val)) {
					return true;
				}
				return false;
			},
			tip: '%s格式为15或18位数字'
		},
		email: {
			rule: /^([a-zA-Z0-9]+[_|\_|\.\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/,
			tip: '邮箱格式错误'
		},
		mobile: {
			rule: /^1[34578]\d{9}$/,
			tip: '手机号码格式错误'
		},
		number: {
			rule: /^[0-9]+$/,
			tip: '%s必须为数字'
		},
		integer: {
			rule: /^[0-9]+$/,
			tip: '%s必须为整数'
		},
		pwd: {
			rule: /^[\w\~\!\@\#\$\%\^\&\*\(\)\+\`\-\=\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?0-9a-zA-z]{6,20}$/,
			tip: '%s由6-20个英文字母、数字或符号组成'
		},
		confirm: {
			rule: function(a, b) {
				return a.val() == b.val();
			},
			tip: '两次%s输入不一致'
		},
		trueName: {
			rule: {
				type: ['trimAll', 'required', 'name', ['minLength', 2],
					['maxLength', 20]
				],
				desc: '姓名'
			}
		},
		buyAmount: {
			rule: {
				type: ['required', 'integer', ['minValue', 1]],
				desc: '金额'
			}
		},
		identityCard: {
			rule: {
				type: ['required', 'identity'],
				desc: '身份证'
			}
		},
		mobileNo: {
			rule: {
				type: ['trimAll', 'required', ['minLength', 11],
					['maxLength', 11], 'mobile'
				],
				desc: '手机号码',
				triggerMethod: ['bulr', 'keyup']
			}
		},
		creditNo: {
			rule: {
				type: ['trimAll', 'required', 'number', ['minLength', 6],
					['maxLength', 19]
				],
				desc: '卡号'
			}
		},
		bankCode: {
			rule: {
				type: ['trimAll', 'required', ['minLength', 4],
					['maxLength', 4]
				],
				desc: '银行卡'
			}
		},
		vcodeNo: {
			rule: {
				type: ['trimAll', 'required', ['minLength', 4],
					['maxLength', 4]
				],
				desc: '验证码'
			}
		},
		payPwd: {
			rule: {
				type: ['required', 'pwd'],
				desc: '支付密码'
			}
		},
		payPwdConfirm: {
			rule: {
				type: ['required', ['confirm', $('#pay-pwd')], 'pwd'],
				desc: '支付密码'
			}
		},
		mailCode: {
			rule: {
				type: ['required', 'number', ['minLength', 6],
					['maxLength', 6]
				],
				desc: '邮政编码'
			}
		},
		answer: {
			rule: {
				type: ['required', ['minLength', 2],
					['maxLength', 20]
				],
				desc: '安全问题答案',
				triggerMethod: ['bulr', 'keyup']
			}
		}
	};
	/*
	*处理验证规则和提示的方法
	*/
	var ruleFactory = {
		getRule: function(ruleName) {
			return RULES[ruleName].rule || function() {
				return true;
			};
		},
		setRule: function(ruleName, rule) {
			RULES[ruleName] = rule;
		},
		getTip: function(ruleName) {
			return RULES[ruleName].tip || '';
		},
		setTip: function(ruleName, tip) {
			RULES[ruleName].tip = tip;
		}
	}
	/*
	*公用基础方法
	*/
	var util = util || {};
	util.isString = function(source) {
		return '[object String]' == Object.prototype.toString.call(source);
	};
	util.isArray = function(source) {
		return '[object Array]' == Object.prototype.toString.call(source);
	};
	util.isFunction = function(source) {
		return '[object Function]' == Object.prototype.toString.call(source);
	};
	util.some = function(arr, fn, obj) {
		if (Array.prototype.some) {
			return [].some.call(arr, fn, obj);
		}
		/*如果不支持，自定义来实现*/
		if (typeof fun != "function") {
			throw new TypeError();
		}
		for (var i = 0, l = arr.length; i < l; i++) {
			if (i in arr && fn.call(obj, arr[i], i, arr)) {
				return true;
			}
		}
		return false;
	};
	Array.prototype.inArray = function(e) {
			//处理空数组的情况
			if (!this.length) {
				return false;
			}
			for (var i = 0, l = this.length; i < l; i++) {
				if (this[i] == e)
					return true;
			}
			return false;
		}
	/**
	 * @name Validator
	 * @class 表单校验
	 * @constructor
	 * @requires jquery
	 * @param {Object} config 组件配置（下面的参数为配置项，配置会写入属性，详细的配置说明请看属性部分）
	 * @param {String} config.formId 表单id
	 * @param {String} config.tipClass 描述className
	 * @param {String} config.errClass 错误className
	 * @param {Boolean} config.checkBeforeSubmit 提交前是否校验
	 * @param {Boolean} config.breakWhenError 校验未通过时，是否停止校验
	 * @param {Object} config.rules 表单规则 {表单项id:{}}
	 * @example
	 * var validator = new Validator({...});
	 */
	var Validator = function(formId) {
		this.formId = formId;
		this.itemClass = 'form-item';
		this.tipClass = 'form-tip';
		this.successClass = 'form-item-success';
		this.warningClass = 'form-item-warning';
		this.errClass = 'form-item-error';
		this.defaultTriggerMethod = 'blur';
		this.breakWhenError = false;
		this.needSubumit = true;
		this._init();
	}
	Validator.prototype = {
			_init: function() {
				if (!this.formId || !$('#' + this.formId).length) {
					try {
						throw new Error(this.formId + '表单元素不存在，请检查');
					} catch (e) {
						alert(e);
					}
				}
				this.form = $('#' + this.formId);
				this.validators = this._collectValidator();
				this._bindEvent();
				this._action();
			},
			_action: function() {
				var V_this = this;
				this.form.bind('submit', function(event) {
					event.preventDefault();
					var isValid = V_this.validateAll();
					if (isValid) {
						V_this.submit();
					}
				});
			},
			/*收集需要验证的表单*/
			_collectValidator: function() {
				var V_this = this;
				var eles = V_this._collectItemList();
				var obj = {};
				$.each(eles, function(index, ele) {
					var id = V_this.formId + index;
					var ruleName = $(ele).attr('data-validator');
					var rule = ruleFactory.getRule(ruleName);
					if ('object' == typeof rule) {
						if (rule instanceof RegExp) {
							obj[id] = {
								type: ruleName
							};
						} else {
							obj[id] = rule;
						}
					} else if ('function' == typeof rule) {
						obj[id] = {
							type: ruleName
						};
					}
					obj[id]['ele'] = ele;
				});
				return obj;
			},
			_collectItemList: function() {
				var eles = this.form.find('[data-validator]');
				return eles;
			},
			/*
			*绑定事件
			*/
			_bindEvent: function() {
				var V_this = this;
				$.each(this.validators, function(itemId, validator) {
					var ele = $(validator.ele);
					//根据配置绑定事件
					var triggerMethod = validator[triggerMethod] ? validator[triggerMethod] : V_this.defaultTriggerMethod;
					triggerMethod = util.isString(triggerMethod) ? [triggerMethod] : triggerMethod;
					for (var i = 0, len = triggerMethod.length; i < len; i++) {
						ele.bind(triggerMethod[i], function() {
							V_this._validate(ele, validator);
						});
					}
					ele.bind('focus', function() {
						V_this.clearStatus(ele);
						V_this._getTipNode(ele).html('');
					});
				});
			},
			/*
			*单个表单验证
			*/
			_validate: function(ele, ruleConf) {
				var V_this = this;
				var flag = false;
				var rules = ruleConf.type;
				var ruleName = '';
				var msg = '';
				var msgData = '';
				if (util.isString(rules)) {
					rules = [rules];
				}
				flag = (!rules) ? true : !util.some(rules, function(rule) {
					ruleName = util.isArray(rule) ? rule[0] : rule;
					var ruleAction = ruleFactory.getRule(ruleName);
					msg = ruleFactory.getTip(ruleName);
					msgData = [ele.attr('data-desc') || ruleConf.desc || ''];
					if (util.isArray(rule)) {
						for (var i = 1, len = rule.length; i < len; i++) {
							msgData[msgData.length] = rule[i];
						}
					}
					var flagPrivate = util.isFunction(ruleAction) ? V_this._validateFunction(ele, rule) : V_this._validateReg(ele, ruleAction);
					return !flagPrivate;
				});
				V_this.defaultActionAfterValite(ele, flag, ruleName, ruleConf.errorMsg || V_this._dealMsg(msg, msgData));
				return flag;
			},
			/*
			*对于验证器是方面的处理
			*/
			_validateFunction: function(ele, rulecfg) {
				var args = [ele];
				if (util.isArray(rulecfg)) {
					var ruleName = rulecfg[0];
					for (var i = 1, l = rulecfg.length; i < l; i++) {
						args[args.length] = rulecfg[i];
					}
				} else {
					var ruleName = rulecfg;
					args[args.length] = ele;
				}
				var rule = ruleFactory.getRule(ruleName);
				return rule.apply(this, args)
			},
			/*
			*对应验证器是正则表达式的处理
			*/
			_validateReg: function(ele, rule) {
				if (!rule) {
					return true;
				}
				var val = ele.val();
				return rule.test(val);
			},
			validateAll: function() {
				var V_this = this;
				var flag = true;
				$.each(this.validators, function(itemId, validator) {
					var ele = $(validator.ele);
					var flagPrivate = V_this._validate(ele, validator);
					flag = (flag && flagPrivate);
					//如果设置了校验出错中断，跳出循环
					if (V_this.breakWhenError && !flagPrivate) {
						return false;
					}
				});
				return flag;
			},
			defaultActionAfterValite: function(ele, flag, ruleName, msg) {
				var formItem = this.getFormitem(ele);
				var formTip = this._getTipNode(ele);
				if (!flag) {
					if ('required' == ruleName) {
						formItem.addClass(this.warningClass);
					} else {
						formItem.addClass(this.errClass);
					}
					formTip.html(msg);
				} else {
					formItem.addClass(this.successClass);
					formTip.html('');
				}
			},
			defaultActionAfterValiteAll: function() {
				//避免重复提交，需要使用form.submit
				this.form[0].submit();
			},
			_dealMsg: function(msg, data) {
				var i = 0;
				while (msg && typeof data[i] !== "undefined") {
					msg = msg.replace(/%s/, data[i++]);
				}
				return msg;
			},
			getFormitem: function(ele) {
				return ele.parents('.' + this.itemClass);
			},
			_getTipNode: function(ele) {
				var formItem = ele.parents('.' + this.itemClass);
				return formItem.find('.' + this.tipClass).length ? formItem.find('.' + this.tipClass) : $('<span class="' + this.tipClass + '"></span>').appendTo(ele.parent());
			},
			clearStatus: function(ele) {
				this.getFormitem(ele).attr('class', this.itemClass);
			},
			submit: function() {
				//调用默认参数，提交表单
				this.defaultActionAfterValiteAll();
			}
		}
		// THE END
	Validator.version = "1.0.0";
	return Validator;
});