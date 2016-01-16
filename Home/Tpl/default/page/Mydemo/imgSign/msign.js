// JavaScript Document
(function() {
	var D = document,
	cvs = D.getElementById('J_Sign'),
	tip = D.getElementById('J_Tip'),
	ctx = null;

	if (!cvs.getContext || typeof FileReader == 'undefined') {
		tip.innerHTML = '此款浏览器不被支持，请使用<strong><a href="http://firefox.com.cn/" >火狐浏览器</a></strong>或<strong><a href="http://www.google.com/chrome/?hl=zh-TW">谷歌浏览器</a></strong>浏览本页面！';
		tip.className = 'showTip';
		return false;
	} else {
		ctx = cvs.getContext('2d');
	}

	var bgImg = new Image(),
	imgBase64 = null,
	get = function(s) {
		return D.querySelector(s)
	},
	getAll = function(s) {
		return D.querySelectorAll(s)
	},
	avatar = get('#J_Avatar'),
	nameInputs = getAll('.nameInfo input'),
	extraInputs = getAll('.extraInfo input'),
	inputs = getAll('.info input'),
	savBtn = get('#J_Save'),
	resetBtn = get('#J_Reset'),
	helpBtns = getAll('.avatar .j_goHelp'),
	fileUp = get('input[type="file"]'),
	suffix = get('#suffix'),
	avatarUrl = 'images/avatar.png',
	file = null,
	avatarPic = null,
	video = get('video'),
	$IMG = 'img',
	$T = 't',
	$R = 'r',
	$W = 'w',
	$H = 'h',
	$TOP = 'top',
	$LEFT = 'left';

	chkMobileShow = get("#chkMobileShow"); //显示手机号的Checkbox
	theMobile = get('#theMobile'); //手机号输入框的Div，控制是否显示


	suffix.onchange = function(){
	  var suffixVal = this.value;  
	  mailName = document.getElementById('mail');	
	  mailName.setAttribute("data-tail",suffixVal);	
	  
	  mailNew =  mailName.value;	  
	  wholeVlaue = "邮箱："+ mailNew + suffixVal;
	  
		ctx.font = '100 14px Tahoma,宋体';
		var namelen = nameInputs[0].value.length;
		var x = leftPosition;
		ctx.fillStyle = '#e5e3e2';
		ctx.fillRect(120, 82, 280, 22);
		ctx.fillStyle = '#2c2826';
		ctx.fillText(wholeVlaue, 120, 100);  	  
	}
	
	/**
	 * Normal upload
	 **/
	fileUp.onchange = function() {
		if (this.files && (file = this.files[0])) {
			afterFileUpload(file);
		}
	}
	
	/**
	 * Preview init
	 **/
	addEvent(bgImg, 'load',
	function() {
		ctx.drawImage(this, 0, 0);
		saveInit();
		resetInit();
		textUpdate();
	});
	bgImg.src = 'images/sign-bg.png';

	/**
	 * Avatar init
	 **/
	avatar.style.background = 'url(' + avatarUrl + ') 0 0';
	//avatar.draggable = true;
	addEvent(avatar, 'dragover', cancel);
	addEvent(avatar, 'dragend', cancel);

	addEvent(avatar, 'drop',
	function(e) {
		e.preventDefault();
		afterFileUpload(e.dataTransfer.files[0]);
		return false;
	});

	/**
	 * single instance
	 **/
	avatarPic = function() {
		var _map = {},
		_self = null;

		/**
		 * attrs change make canvas redraw
		 * img obj must be set every upload time
		 **/
		_map[$IMG] = null; //avatar img

		/**
		 * common attrs
		 **/
		_map[$TOP] = 0; //avatar img top
		_map[$LEFT] = 0; //avatar img left
		_map[$W] = 0; //img width
		_map[$H] = 0; //img height
		_map[$T] = 0; //step times
		_map[$R] = 1; //scale rate

		/**
		 * common apis
		 **/
		return {
			getValue: function(key) {
				return _map[key];
			},
			setValue: function(key, v) {
				if (key == $T) {
					if (v > 100) v = 100;
					if (v < -99) v = -99;
				} else if (key == $TOP || key == $LEFT) {
					var _img = this.getValue($IMG),
					edge = null,
					dis = 0;
					edge = key == $TOP ? 'clientHeight': 'clientWidth';
					dis = 70 - _img[edge];
					//limit edge
					v = v > 0 ? 0 : v < dis ? dis: v;
					_img['style'][key] = v + 'px';
				}

				_map[key] = v;
				this.onValueChange(key);
				if (_img) _img = null;
				if (edge) edge = null;
			},
			onValueChange: function(key) {
				_self = this;

				if (key == $T || key == $R) {
					switch (key) {
					case $T:
						_map[$R] = (1 + _map[$T] / 100 + '').substring(0, 4);
						break;
					case $R:
						_map[$T] = (_map[$R] - 1) * 100;
						break;
					}
					this.setWidth();
				} else {
					var _img = this.getValue($IMG),
					imgXStart = 0,
					imgYStart = 0,
					imgXEnd = 0,
					imgYEnd = 0,
					_time = 0;

					_img.draggable = true;
					_img.style.cursor = 'move';

					/**
					 * avatar img changed 
					 * rebind events
					 **/
					addEvent(_img, 'load',
					function() {

						if (!_img.reset) avatar.appendChild(_img);
						//ctx.globalCompositeOperation = 'destination-over';
						/**
						 * init
						 **/
						_self.setValue($W, _img.width);
						_self.setValue($H, _img.height);
						_self.setValue($R, 1);

						/**
						 * better than while
						 **/
						(function() {
							if (Math.max(_img.width, _img.height) < 70) {
								_self.setValue($T, _self.getValue($T) + 1);
								setTimeout(arguments.callee, 0);
							}
						})()
					});
					_img.isDragging = false; //bugfix for too many events fires
					addEvent(_img, 'dragstart',
					function(e) {
						if (!this.isDragging) {
							imgXStart = e.clientX;
							imgYStart = e.clientY;
							this.isDragging = true;
						}
					});
					addEvent(_img, 'dragover',
					function(e) {
						imgXEnd = e.clientX;
						imgYEnd = e.clientY;
					});
					addEvent(_img, 'dragend',
					function(e) {
						if (this.isDragging) {
							_self.setValue($LEFT, _img.offsetLeft + imgXEnd - imgXStart);
							_self.setValue($TOP, _img.offsetTop + imgYEnd - imgYStart);
							this.isDragging = false;
						}
					});
				}

				/**
				 * every change makes canvas drawing
				 * overwrite mode
				 * no need clearRect
				 **/
				//ctx.clearRect(294,53,70,70);
				try {
					drawScaleImg(this.getValue($IMG));
				} catch(e) {}
			},
			setWidth: function() {
				this.getValue($IMG).width = this.getValue($W) * this.getValue($R);
			},
			resetImg: function() {
				this.getValue($IMG).style.left = 0;
				this.getValue($IMG).style.top = 0;
				this.setValue($R, 1);
			},
			deleteImg: function() {
				avatar.removeChild(this.getValue($IMG));
				this.getValue($IMG).reset = true;
				this.setValue($T, 0);
				this.setImgSrc(avatarUrl);
			},
			init: function() {
				_self = this;

				/**
				 * window event,bind once only
				 **/
				addEvent(window, 'keydown',
				function(e) {
					var target = e.target,
					_img = _self.getValue($IMG),
					step = e.shiftKey ? 10 : 1;
					if (e.target.tagName != 'INPUT') {
						if ((e.keyCode > 36 && e.keyCode < 41) || (e.keyCode == 107 || e.keyCode == 109 || e.keyCode == 187 || e.keyCode == 189 || e.keyCode == 27 || e.keyCode == 46)) {
							e.preventDefault();
							e.returnValue = false;
						}

						if (e.keyCode > 36 && e.keyCode < 41) {
							switch (e.keyCode) {
							case 37:
								_self.setValue($LEFT, _img.offsetLeft - step);
								break;
							case 38:
								_self.setValue($TOP, _img.offsetTop - step);
								break;
							case 39:
								_self.setValue($LEFT, _img.offsetLeft + step);
								break;
							case 40:
								_self.setValue($TOP, _img.offsetTop + step);
								break;
							}
						} else if (e.keyCode == 107 || e.keyCode == 109 || e.keyCode == 187 || e.keyCode == 189) {
							if (e.keyCode == 107 || e.keyCode == 187) {
								_self.setValue($T, _self.getValue($T) + 1);
							} else {
								_self.setValue($T, _self.getValue($T) - 1);
							}
						} else if (e.keyCode == 27) {
							_self.resetImg();
						} else if (e.keyCode == 46) {
							_self.deleteImg();
						}
					}
				});
			},
			setImgSrc: function(src) {
				this.getValue($IMG).src = src;
			}
		}
	} ();

	avatarPic.init();

	/**
	 * Util
	 **/
	function addEvent(obj, type, handle) {
		if (obj.attachEvent) {
			obj[type + handle] = function(e) {
				handle.call(this, e);
			};
			obj.attachEvent('on' + type, obj[type + handle]);
		} else {
			obj.addEventListener(type, handle, false);
		}
	}

	function removeEvent(obj, type, handle) {
		if (obj.detachEvent) {
			obj.detachEvent('on' + type, obj[type + handle]);
			obj[type + handle] = null;
		} else {
			obj.removeEventListener(type, handle, false);
		}
	}

	function cancel(event) {
		if (event.preventDefault) {
			event.preventDefault();
		}
		return false;
	}

	function saveInit() {
		addEvent(savBtn, 'click',
		function() {
			//if(validAll()){
			imgBase64 = cvs.toDataURL();
			window.open(imgBase64, 'get url');
			//}
		});
	}

	function resetInit() {
		addEvent(resetBtn, 'click',
		function() {
			ctx.drawImage(bgImg, 0, 0);
			drawScaleImg(get('.avatarHolder > img'));
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].value = '';
			}
		});
	}
	
	var isMobileShow = false;  //手机号是否显示的标记，false不显示，true显示;
	var lnheight = 30; //行高度，显示手机号时需要调整大小，以适应整体高度
	var keyupHandlerTag = false; //输入框keyup事件绑定标记，避免多次绑定
	var mobileInputIndex = 3; //手机号输入框的序号(从0开始）
	var leftPosition = 120;
	var topp/* = [45,76,102,0,122]*/; //姓名，部门，电话，手机，邮箱
	
	function buildrealname(name) {
		var x = leftPosition;
		var v = name;
		ctx.font = '600 18px Tahoma,微软雅黑';
		if (v.length >= 4) {
			//ctx.font = '700 17px 微软雅黑';
			//x = 377;
		} else if (v.length == 3) {
			//x = 377;
		} else {
			v = v.split('').join(' ');
		}

		if(v.length > 4) v = v.substring(0,4); //拼音输入法输入时会超长
		if (valid(nameInputs[0]) || !name) {
			ctx.fillStyle = '#e5e3e2';
			ctx.fillRect(x-5, 14, 250, 26);
			ctx.fillStyle = '#f97003';
			ctx.fillText(v.substring(0, v.length >= 4 ? 4 : 3), x, topp[0]);
		}
	}

	function builddisplayname(displayname) {
		var v = "( "+ displayname +" )";
		ctx.font = '100 14px Tahoma,宋体';
		var namelen = nameInputs[0].value.length;
		if(namelen > 4) namelen = 4; //拼音输入法输入时会超长，做限制
		var x = leftPosition + namelen * 20 - 5;
		if(namelen == 2) x += 12;
		else if(namelen > 0) x += 6;

		if(v.length > 10) v = v.substring(0,12); //拼音输入法输入时会超长，做限制
		if (valid(nameInputs[1]) || !v) {
			ctx.fillStyle = '#e5e3e2';
			ctx.fillRect(x-2, 14, 160, 22);
			ctx.fillStyle = '#2c2826';
			ctx.fillText(v, x, topp[0]);
		}
	}
	function mobileDispHandler(){
		if(chkMobileShow.checked){
			lnheight = 20;
			isMobileShow = false;
			theMobile.style.display = 'none';
			topp = [30,60,80,0,100];
			//extraInputs = Array.prototype.slice.call(extraInputs);
			//console.log(Object.prototype.toString.call(extraInputs));
			//console.log(extraInputs.length);
		} else {
			lnheight = 18;
			isMobileShow = true;
			theMobile.style.display = 'block';
			topp = [30,68,89,106,123];
		}
		
		//清除底部背景
		ctx.fillStyle = '#f5f5f5';
		ctx.fillRect(leftPosition - 2, 52, 222, 83);
		textUpdate();
	}
	addEvent(chkMobileShow, 'click', mobileDispHandler);
	mobileDispHandler();

	
	function textUpdate() {
		//真名
		buildrealname(nameInputs[0].value);
		addEvent(nameInputs[0], 'keyup',
		function() {
			buildrealname(this.value);
			builddisplayname(nameInputs[1].value);
		});
		//职务
		builddisplayname(nameInputs[1].value);
		addEvent(nameInputs[1], 'keyup',
		function() {
			buildrealname(nameInputs[0].value);
			builddisplayname(this.value);
		});
		//部门
		displaydept(extraInputs[0]);
		addEvent(extraInputs[0], 'keyup',
		function() {
			displaydept(this);
		});
		addEvent(extraInputs[1], 'keyup',
		function() {
			displaydept(this);
		});
		
		function buildAll(obj, x) {
			//不显示手机时，忽略手机显示及邮箱显示往上一行。
			if(!isMobileShow && x == mobileInputIndex) return;

			if (valid(obj) || !obj.value) {
				ctx.fillStyle = '#e5e3e2';
				var top = topp[x];
				ctx.fillRect(obj.getAttribute('data-start') >> 0, top - 15 , obj.getAttribute('data-end') >> 0, 20);
				ctx.font = x ? '100 14px Tahoma,宋体': '700 14px Tahoma,宋体';
				ctx.fillStyle = (x == 0) ? "#2c2826": "#2c2826";
				ctx.fillText((obj.getAttribute('data-head') || '') + lowerCase(obj.value) + (obj.getAttribute('data-tail') || ''), obj.getAttribute('data-start') >> 0, top);
				//console.log(top);
			} 
		}
		
		//显示电话
		for (var i = 2; i < extraInputs.length; i++) {
			buildAll(extraInputs[i], i);
			if(keyupHandlerTag) continue;
			addEvent(extraInputs[i], 'keyup',
			function(x) {
				return function() {
					if (valid(this) || !this.value) {
						var nid = x; //电话为第一行
						ctx.fillStyle = '#e5e3e2';
						var top = topp[nid];
						ctx.fillRect(this.getAttribute('data-start') >> 0, top - 15, this.getAttribute('data-end') >> 0, 20);
						ctx.font = nid ? '100 14px Tahoma,宋体': '700 14px Tahoma,宋体';
						ctx.fillStyle = (nid == 0) ? "#666": "#2c2826";
						ctx.fillText((this.getAttribute('data-head') || '') + lowerCase(this.value) + (this.getAttribute('data-tail') || ''), this.getAttribute('data-start') >> 0, top);
					}
				}
			} (i));
		}
		keyupHandlerTag = true;
	}

	function lowerCase(val){
		if(val) return val.toLowerCase();
		return val;
	}
	
	function displaydept(obj){
		ctx.fillStyle = '#e5e3e2';
		//var top = isMobileShow ? 55 : 57;
		ctx.fillRect((obj.getAttribute('data-start') >> 0) - 2, topp[1] - 15, obj.getAttribute('data-end') >> 0, 25);
		ctx.font = '100 14px Tahoma,宋体';
		ctx.fillStyle = "#2c2826";
		ctx.fillText(getExtraValue(obj), obj.getAttribute('data-start') >> 0, topp[1]);
	}
	
	/**
	 * 部门信息改变时，合并两个输入框的值，一起显示.
	 */
	function getExtraValue(obj){
		var val = obj.value;
		var obj2 = obj;
		if(obj.getAttribute("data-mode") == "dept-base"){
			//部门信息第一个输入框时，显示完整的部门信息.
			obj2 = extraInputs[1];
			if(obj2.value != ''){
				val = obj.value + " - " +obj2.value;
			}
		} else if(obj.getAttribute("data-mode") == "dept-extend"){
			obj = extraInputs[0];
			val = obj.value;
			if(obj2.value != ''){
				val = obj.value + ((obj.value == "") ? "" : " - ") + obj2.value;
			}
		} 
		return (obj.getAttribute('data-head') || '') + val + (obj.getAttribute('data-tail') || '');
	}

	/**
	  * valid
	  */
	function isValid(obj) {
		var reg = new RegExp(obj.getAttribute('data-reg') || '');
		return reg.test(obj.value);
	}

	function valid(obj) {
		var result = isValid(obj);
		if (result) {
			obj.style.color = '#000';
		} else {
			obj.style.color = 'red';
		}
		return result;
	}

	function validAll() {
		var result = true;
		var ipt;
		for (var i = 0; i < inputs.length; i++) {
			ipt = inputs[i];
			if (valid(ipt)) {
				result &= true;
			} else {
				result &= false;
			}
		}
		return result;
	}

	function drawScaleImg(img) {
		if (!img) return false;
		var rate = avatarPic.getValue($R) ? avatarPic.getValue($R) : 1;
		try {
			//change size. @josson
			ctx.drawImage(img, 0 - img.offsetLeft / rate, 0 - img.offsetTop / rate, 70 / rate, 70 / rate, 12, 9, 100, 100);
		} catch(e) {}
	}

	function afterFileUpload(file) {
		if (!file) return;

		var reader = new FileReader(),
		oldImg = null;

		reader.onload = function(event) {
			if (oldImg = get('.avatarHolder > img')) avatar.removeChild(oldImg);
			var newAvatar = new Image();
			avatarPic.setValue($IMG, newAvatar);
			avatarPic.setImgSrc(event.target.result);
		};
		reader.readAsDataURL(file);
	}
})();