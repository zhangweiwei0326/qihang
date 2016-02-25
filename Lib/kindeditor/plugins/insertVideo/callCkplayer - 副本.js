$(document).ready(function(){
	var urlObj =  document.getElementById("ckplayerBoxUrl");
	var imgObj =  document.getElementById("videoImg");
	var playerBox = document.getElementById("ckplayerOutBox");
	if(navigator.appName.indexOf("Explorer") > -1){      
		var fileUrl = urlObj.innerText;
	}else{
		var fileUrl = urlObj.textContent;
	}

	var playerW = $(imgObj).width() > 400 ? $(imgObj).width() : '400';
	var playerH = $(imgObj).height() > 300 ? $(imgObj).height() : '300';
	
	var autoStart = $("#ckplayerAutoStart").html();
	
	var callHtml = '<div id="ckplayerBox"></div>';
		callHtml += "<script type='text/javascript'>";
		callHtml += "var flashvars={f:'"+fileUrl+"',p:'"+autoStart+"'};";
		callHtml += "var params={bgcolor:'#000000',allowFullScreen:true,allowScriptAccess:'always'};";
		callHtml += "var attributes={id:'ckplayer_a1',name:'ckplayer_a1'};";
		callHtml += "swfobject.embedSWF(path+'/kindeditor/plugins/insertVideo/ckplayer/ckplayer.swf', 'ckplayerBox', '"+playerW+"', '"+playerH+"', '10.0.0','/kindeditor/plugins/insertVideo/ckplayer/expressInstall.swf', flashvars, params, attributes); ";
		callHtml += "</script>";
		
		$(playerBox).html(callHtml);		
});