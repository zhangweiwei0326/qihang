<?php
/**
  * wechat php test
  */

//define your token
define("TOKEN", "yizhan");
$wechatObj = new wechatCallbackapiTest();
//$wechatObj->valid();
$wechatObj->responseMsg();//执行接受方法

class wechatCallbackapiTest
{
	public function valid()
    {
        $echoStr = $_GET["echostr"];

        //valid signature , option
        if($this->checkSignature()){
        	echo $echoStr;
        	exit;
        }
    }

    public function responseMsg()
    {
		//get post data, May be due to the different environments
		$postStr = $GLOBALS["HTTP_RAW_POST_DATA"];

      	//extract post data
		if (!empty($postStr)){
                
              	$postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
                $fromUsername = $postObj->FromUserName;
                $toUsername = $postObj->ToUserName;
                $keyword = trim($postObj->Content);
                $time = time();
                $textTpl = "<xml>
							<ToUserName><![CDATA[%s]]></ToUserName>
							<FromUserName><![CDATA[%s]]></FromUserName>
							<CreateTime>%s</CreateTime>
							<MsgType><![CDATA[%s]]></MsgType>
							<Content><![CDATA[%s]]></Content>
							</xml>";             
                if(!empty( $keyword ))
                {
                    $temp_arr = explode(" ",$keyword);
                    $conn = @ mysql_connect("localhost", "lihuazh2_yizhan", "xyang2012hz") or die("数据库链接错误");
                    mysql_select_db("lihuazh2_yizhan", $conn);
                    mysql_query("set names 'utf8'");
                    
                    if($temp_arr[0] == 'add'){
                        $msgType = "text";
                        $add_content = $temp_arr[1];
                        mysql_query("INSERT INTO my_requirement (id, content, type) VALUES ('', '$add_content', 'all')");
                        $addStr = "发布成功！";
                        $addresultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $addStr);
                        echo $addresultStr;
                    }else{
                        $msgType = "text";
                        $result = mysql_query("SELECT * FROM my_article WHERE title LIKE '%{$keyword}%' ORDER BY add_date desc LIMIT 0,8");
                        $contentStr =  '搜索信息如下:';
                        while($row = mysql_fetch_array($result)){
                          $contentStr .= "\n<a href='http://lihuazhai.com/qihang/index.php/Article/showDetail/?id=".$row[id]."'>".$row[title]."</a>\n";
                        }
                        $resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $contentStr);
                        echo $resultStr;
                    }

                    
                }else{
                    echo "Input something...";
                }

        }else {
        	echo "";
        	exit;
        }
    }
		
	private function checkSignature()
	{
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];	
        		
		$token = TOKEN;
		$tmpArr = array($token, $timestamp, $nonce);
		sort($tmpArr, SORT_STRING);
		$tmpStr = implode( $tmpArr );
		$tmpStr = sha1( $tmpStr );
		
		if( $tmpStr == $signature ){
			return true;
		}else{
			return false;
		}
	}
}

?>