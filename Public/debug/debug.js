/**
 * @Debug Js调试工具
 * @author yangxiaoxu
 * @email lihuazhai_com@163.com
 * @website www.lihuazhai.com
 * @date 2015-03-19
 */
(function(mod) {
	if ( typeof exports == "object" && typeof module == "object")// CommonJS
		module.exports = mod();
	else if ( typeof define == "function" && define.amd)// AMD
		return define([], mod);
	else// Plain browser env
		this.Validator = mod();
})(function() {"use strict";

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
		if ( typeof fun != "function") {
			throw new TypeError();
		}
		for (var i = 0, l = arr.length; i < l; i++) {
			if ( i in arr && fn.call(obj, arr[i], i, arr)) {
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
	var Debugger = function() {
	};
	Debugger.log = function() {
		try {
			console.log(message);
		} catch (exception) {
			return;
		}
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
	var Debug = function(formId) {
		this.formId = formId;
		this.itemClass = 'form-item';
		this.tipClass = 'form-tip';
		this.successClass = 'form-item-success';
		this.warningClass = 'form-item-warning';
		this.errClass = 'form-item-error';
		this.defaultTriggerMethod = 'blur';
		this.breakWhenError = true;
		this._init();
	}
	Validator.prototype = {
		_init : function() {
			if (!this.formId || !$('#' + this.formId).length) {
				try {
					throw new Error(this.formId + '表单元素不存在，请检查');
				} catch (e) {
					alert(e);
				}
			}
			this.form = $('#' + this.formId);
			this.validators = this._collectValidator();
			this.itemList = this._collectItemList();
			this._bindEvent();
			this._action();
		}
	}
	// THE END
	Validator.version = "1.0.0";
	return Validator;
}); 