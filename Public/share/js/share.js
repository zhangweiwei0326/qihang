(function(window) {
	var Share = function(elementNode, config) {
		var config = config || {};
		this.elementNode = elementNode;
		this.url = config.url || document.location.href || '';
		this.title = config.title || document.title || '';
		this.desc = config.desc || document.title || '';
		this.img = config.img || document.getElementsByTagName('img').length > 0 && document.getElementsByTagName('img')[0].src || '';
		this.img_title = config.img_title || document.title || '';
		this.from = config.from || window.location.host || '';
		this.plantform = this.getPlantform(); //手机系统
		this.browser = this.getBrowser(); //浏览器
		this.init();
	};

	var UA = navigator.appVersion;
	var version = {
		uc: "",
		qq: ""
	};

	var bLevel = {
		qq: {
			forbid: 0,
			lower: 1,
			higher: 2
		},
		uc: {
			forbid: 0,
			allow: 1
		}
	};

	Share.prototype = {
		getPlantform: function() {
			var ua = navigator.userAgent;
			if ((ua.indexOf("iPhone") > -1 || ua.indexOf("iPod") > -1)) {
				return "iPhone";
			} else if (ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1) {
				return "Android";
			} else if (ua.indexOf('Windows Phone') > -1) {
				return "WindowsPhone";
			} else {
				return -1;
			}
		},
		getBrowser: function() {
			if (this.isqqBrowser()) {
				return "qqBrowser";
			} else if (this.isucBrowser()) {
				return "ucBrowser";
			} else {
				return -1;
			}
		},
		isqqBrowser: function() {
			var UA = navigator.appVersion;
			return UA.indexOf("MQQBrowser/") != -1 ? 1 : 0;
		},
		isucBrowser: function() {
			var UA = navigator.appVersion;
			return UA.indexOf("UCBrowser/") != -1 ? 1 : 0;
		},
		qqBrowserApi: {
			lower: "http://3gimg.qq.com/html5/js/qb.js",
			higher: "http://jsapi.qq.com/get?api=app.share"
		},
		getVersion: function(c) {
			var a = c.split(".");
			var b = parseFloat(a[0] + "." + a[1]);
			return b
		},
		loadqqApi: function() {
			if (this.isqqBrowser()) {
				var b = (version.qq < 5.4) ? this.qqBrowserApi.lower : this.qqBrowserApi.higher;
				var d = document.createElement("script");
				var a = document.getElementsByTagName("body")[0];
				d.setAttribute("src", b);
				a.appendChild(d)
			}
		},
		appList: {
			iPhone: {
				sinaWeibo: {
					ucKey: 'kSinaWeibo',
					qqKey: 11
				},
				weixin: {
					ucKey: 'kWeixin',
					qqKey: 1
				},
				weixinFriend: {
					ucKey: 'kWeixinFriend',
					qqKey: 8
				},
				QQ: {
					ucKey: 'kQQ',
					qqKey: 4
				},
				QZone: {
					ucKey: 'kQZone',
					qqKey: 3
				}
			},
			Android: {
				sinaWeibo: {
					ucKey: 'kSinaWeibo',
					qqKey: 11
				},
				weixin: {
					ucKey: 'WechatTimeline',
					qqKey: 1
				},
				weixinFriend: {
					ucKey: 'WechatTimeline',
					qqKey: 8
				},
				QQ: {
					ucKey: 'QQ',
					qqKey: 4
				},
				QZone: {
					ucKey: 'QZone',
					qqKey: 3
				}
			}
		},
		createHtml: function() {
			var position = document.getElementById(this.elementNode);
			var html = '<div class="label">分享到</div>' +
				'<div class="list clearfix">' +
				'<span data-app="sinaWeibo" class="nativeShare weibo"><i></i>新浪微博</span>' +
				'<span data-app="weixin" class="nativeShare weixin"><i></i>微信好友</span>' +
				'<span data-app="weixinFriend" class="nativeShare weixin_timeline"><i></i>微信朋友圈</span>' +
				'<span data-app="QQ" class="nativeShare qq"><i></i>QQ好友</span>' +
				'<span data-app="QZone" class="nativeShare qzone"><i></i>QQ空间</span>' +
				'<span data-app="" class="nativeShare more"><i></i>更多</span>' +
				'</div>';
			position.innerHTML = html;
		},
		shareAction: function(to_app) {
			title = this.title;
			url = this.url;
			desc = this.desc;
			img = this.img;
			img_title = this.img_title;
			from = this.from;

			switch (this.browser) {
				case 'qqBrowser':
					this.qqBrowserAction(to_app);
					break;
				case 'ucBrowser':
					this.ucBrowserAction(to_app);
					break;
				default:
					alert('不支持！');
					break;
			}
		},
		handleVersion: function() {
			if (this.isqqBrowser()) {
				if ((version.qq < 5.4 && this.plantform == "iPhone") || (version.qq < 5.3 && this.plantform == "Android")) {
					return bLevel.qq.forbid;
				} else if (version.qq < 5.4 && this.plantform == "Android") {
					return bLevel.qq.lower;
				} else {
					return bLevel.qq.higher;
				}
			}

			if (this.isucBrowser()) {
				if ((version.uc < 10.2 && this.plantform == "iPhone") || (version.uc < 9.7 && this.plantform == "Android")) {
					return bLevel.uc.forbid
				} else {
					return bLevel.uc.lower;
				}
			}
		},
		qqBrowserAction: function(to_app) {
			var to_app_keyword = to_app == '' ? '' : this.appList['iPhone'][to_app]['qqKey'];
			var ah = {
				url: url,
				title: title,
				description: desc,
				img_url: img,
				img_title: img_title,
				to_app: to_app_keyword, //微信好友1,腾讯微博2,QQ空间3,QQ好友4,生成二维码7,微信朋友圈8,啾啾分享9,复制网址10,分享到微博11,创意分享13
				cus_txt: desc
			};
			ah = to_app_keyword == '' ? '' : ah;

			if (typeof(browser) != "undefined") {
				if (typeof(browser.app) != "undefined" && this.handleVersion() == bLevel.qq.higher) {
					browser.app.share(ah)
				}
			} else {
				if (typeof(window.qb) != "undefined" && this.handleVersion() == bLevel.qq.lower) {
					window.qb.share(ah)
				} else {
					alert('分享失败~');
				}
			}
		},
		ucBrowserAction: function(to_app) {
			var to_app_keyword = to_app == '' ? '' : (this.plantform == 'iPhone' ? this.appList['iPhone'][to_app]['ucKey'] : this.appList['Android'][to_app]['ucKey']);

			if (to_app == 'QQ') {
				B = "mqqapi://share/to_qzone?src_type=web&version=1&file_type=news&req_type=1&image_url=" + img + "&title=" + title + "&description=" + desc + "&url=" + url + "&app_name=" + from;
				k = document.createElement("div"), k.style.visibility = "hidden", k.innerHTML = '<iframe src="' + B + '" scrolling="no" width="1" height="1"></iframe>', document.body.appendChild(k), setTimeout(function() {
					k && k.parentNode && k.parentNode.removeChild(k)
				}, 5E3);
			}
			if (typeof(ucweb) != "undefined") {
				ucweb.startRequest("shell.page_share", [title, title, url, to_app_keyword, "", "@" + from, ""])
			} else {
				if (typeof(ucbrowser) != "undefined") {
					ucbrowser.web_share(title, title, url, to_app_keyword, "", "@" + from, '')
				} else {
					alert('分享失败~');
				}
			}
		},
		init: function() {
			if (this.isqqBrowser() || this.isucBrowser()) {
				version.qq = this.isqqBrowser() ? this.getVersion(UA.split("MQQBrowser/")[1]) : 0;
				version.uc = this.isucBrowser() ? this.getVersion(UA.split("UCBrowser/")[1]) : 0;

				this.loadqqApi();
				this.createHtml();

				var share = this;
				var items = document.getElementsByClassName('nativeShare');
				for (var i = 0; i < items.length; i++) {
					items[i].onclick = function() {
						share.shareAction(this.getAttribute('data-app'));
					}
				}
			} else {
				console.log('目前该分享插件仅支持手机UC浏览器和QQ浏览器!');
			}
		},

	};

	window.Share = Share;

})(window)