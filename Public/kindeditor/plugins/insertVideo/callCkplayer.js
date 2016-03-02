$(document).ready(function(){
	var playerBox = document.getElementById("ckplayerOutBox");

   /*判断文章中是否含有视频代码，需要还原成视频播放*/
	if(playerBox){
		var urlObj =  document.getElementById("ckplayerBoxUrl");
		var imgObj =  document.getElementById("videoImg");
		if(navigator.appName.indexOf("Explorer") > -1){      
			var fileUrl = urlObj.innerText;
		}else{
			var fileUrl = urlObj.textContent;
		}

		var playerW = $(imgObj).width() > 400 ? $(imgObj).width() : '400';
		var playerH = $(imgObj).height() > 300 ? $(imgObj).height() : '300';
		
		var autoStart = $("#ckplayerAutoStart").html();
		
		var callHtml = '<div id="a1"></div>';
			callHtml += "<script type='text/javascript'>";
			callHtml += "var flashvars={f:'"+fileUrl+"',p:'"+autoStart+"',c:0,b:1};";
			callHtml += "var video=['"+fileUrl+"->video/mp4','http://www.ckplayer.com/webm/0.webm->video/webm','http://www.ckplayer.com/webm/0.ogv->video/ogg'];";
			callHtml += "CKobject.embed(path+'/kindeditor/plugins/insertVideo/ckplayer/ckplayer.swf','a1','ckplayer_a1','"+playerW+"','"+playerH+"',false,flashvars,video);";
			callHtml += "</script>";
		$(playerBox).html(callHtml);
	}
				
});