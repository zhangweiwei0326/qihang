<?php
//define your token
define("TOKEN", "yizhan");
$wechatObj = new wechatCallbackapiTest();

if (isset($_GET['echostr'])) {
    $wechatObj->valid();//验证时token
}else{
    echo 111;
    //$wechatObj->responseMsg();//执行接受方法
}

class wechatCallbackapiTest{
    //验证消息
    public function valid(){
        $echoStr = $_GET["echostr"];
        if($this->checkSignature()){
            echo $echoStr;
            exit;
        }
    }
    
    //检查签名
    private function checkSignature(){
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

    //回复图文消息
    private function transmitNews($object, $newsArray){
        if(!is_array($newsArray)){
            return;
        }
        $itemTpl = "<item>
            <Title><![CDATA[%s]]></Title>
            <Description><![CDATA[%s]]></Description>
            <PicUrl><![CDATA[%s]]></PicUrl>
            <Url><![CDATA[%s]]></Url>
        </item>";

        $item_str = "";
        foreach ($newsArray as $item){
            $item_str .= sprintf($itemTpl, $item['Title'], $item['Description'], $item['PicUrl'], $item['Url']);
        }
        $newsTpl = "<xml>
            <ToUserName><![CDATA[%s]]></ToUserName>
            <FromUserName><![CDATA[%s]]></FromUserName>
            <CreateTime>%s</CreateTime>
            <MsgType><![CDATA[news]]></MsgType>
            <Content><![CDATA[]]></Content>
            <ArticleCount>%s</ArticleCount>
            <Articles>$item_str</Articles>
        </xml>";

        $result = sprintf($newsTpl, $object->FromUserName, $object->ToUserName, time(), count($newsArray));
        return $result;
    }


    public function responseMsg(){
        //get post data, May be due to the different environments
        $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];

        //extract post data
        if (!empty($postStr)){
                
                $postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
                $fromUsername = $postObj->FromUserName;
                $toUsername = $postObj->ToUserName;
                $MsgType = $postObj->MsgType;
                $keyword = trim($postObj->Content);
                $time = time();
                $textTpl = "<xml>
                            <ToUserName><![CDATA[%s]]></ToUserName>
                            <FromUserName><![CDATA[%s]]></FromUserName>
                            <CreateTime>%s</CreateTime>
                            <MsgType><![CDATA[%s]]></MsgType>
                            <Content><![CDATA[%s]]></Content>
                            </xml>";

                 $imageTpl = "<xml>
                            <ToUserName><![CDATA[%s]]></ToUserName>
                            <FromUserName><![CDATA[%s]]></FromUserName>
                            <CreateTime>%s</CreateTime>
                            <MsgType><![CDATA[news]]></MsgType>
                            <ArticleCount>1</ArticleCount>
                            <Articles>
                                <item>
                                    <Title><![CDATA[title1]]></Title> 
                                    <Description><![CDATA[description1]]></Description>
                                    <PicUrl><![CDATA[%s]]></PicUrl>
                                    <Url><![CDATA[%s]]></Url>
                                </item>
                            </Articles>
                            </xml>";

                if(!empty( $keyword )){
                    $temp_arr = explode(" ",$keyword);
                    $conn = @ mysql_connect("localhost", "yuhang_chuangye", "yizhan_huaxiaka_2000") or die("数据库链接错误");
                    mysql_select_db("zhixuan_luotong", $conn);
                    mysql_query("set names 'utf8'");

                    switch($temp_arr[0]){
                        case 'new':
                            $msgType = "text";
                            $result = mysql_query("SELECT * FROM my_article  ORDER BY add_date desc LIMIT 0,3");
                            $contentStr =  '梨花寨最新文章如下:';
       


                            $content = array();

                            while($row = mysql_fetch_array($result)){
    
                              $content[] = array("Title"=>$row['title'], "Description"=>$row['summary'], "PicUrl"=>"http://mmbiz.qpic.cn/mmbiz/L4qjYtOibummHn90t1mnaibYiaR8ljyicF3MW7XX3BLp1qZgUb7CtZ0DxqYFI4uAQH1FWs3hUicpibjF0pOqLEQyDMlg/0", "Url" =>"http://lihuazhai.com/qihang/index.php/Article/showDetail/?id=".$row['id']);
                            }

                            $result = $this->transmitNews($postObj, $content);

                            echo $result;



                           // $imgStr = 'http://mmbiz.qpic.cn/mmbiz/L4qjYtOibummHn90t1mnaibYiaR8ljyicF3MW7XX3BLp1qZgUb7CtZ0DxqYFI4uAQH1FWs3hUicpibjF0pOqLEQyDMlg/0';

                            //$resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $contentStr);

                            //$resultStr = sprintf($imageTpl, $fromUsername, $toUsername, $time, $imgStr, $resultStr);
                            
                            //echo $resultStr;
                          break;
                        case "add":
                            $msgType = "text";
                            $add_content = $temp_arr[1];
                            mysql_query("INSERT INTO my_requirement (id, content, type) VALUES ('', '$add_content', 'all')");
                            $addStr = "发布成功！";
                            $addresultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $addStr);
                            echo $addresultStr;
                          break;
                        default:
                            $msgType = "text";
                            $result = mysql_query("SELECT * FROM my_article WHERE title LIKE '%{$keyword}%' ORDER BY add_date desc LIMIT 0,8");
                            $contentStr =  '搜索信息如下:';
                            while($row = mysql_fetch_array($result)){
                              $contentStr .= "\n<a href='http://lihuazhai.com/qihang/index.php/Article/showDetail/?id=".$row[id]."'>".$row[title]."</a>\n";
                            }

                            $imgStr = 'http://mmbiz.qpic.cn/mmbiz/L4qjYtOibummHn90t1mnaibYiaR8ljyicF3MW7XX3BLp1qZgUb7CtZ0DxqYFI4uAQH1FWs3hUicpibjF0pOqLEQyDMlg/0';

                            if(true){
                               $resultStr = sprintf($imageTpl, $fromUsername, $toUsername, $time, $imgStr, $imgStr);
                            }else{
                               $resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $contentStr);
                            }
                            
                            echo $resultStr;
                    }
  
                }else{
                    echo "Input something...";
                }

        }else {
            echo "";
            exit;
        }

        echo "sdfsdf";
    }
        

}
?>