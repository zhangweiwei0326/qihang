<?php
//Vendor("PHPMailer.class#phpmailer"); //包函邮件发送类
Load('extend');
class  PublicAction extends Action {
  //设置404页面
  function _empty(){
    header("HTTP/1.0 404 Not Found");//使HTTP返回404状态码
    $this->display("Public:404");
  }
	Public function template($controller,$page){
    //移动设备浏览，则切换模板
		if (ismobile()) {
      //设置默认默认主题为 Mobile
			$this->display('./Home/Tpl/mobile/page/'.ucfirst($controller).'/'.$page.'.html');
		}else{
			$this->display();
		}
	}
	public function head() {
		header("Content-Type:text/html; charset=utf-8");
		$navDao = M("navigate");  
		$navList = $navDao->where('is_show = "1"')->order('sort asc')->select();
        //dump($navList);	
		$this->assign("navList", $navList);
	}
	
	public function friendlyLink() {
		header("Content-Type:text/html; charset=utf-8");
		$Dao = M("friendly_link");  
		$list = $Dao->where('is_show = 1')->select();
		$this->assign("linkList", $list);
	}
	
	public function setMessage() {
		header("Content-Type:text/html; charset=utf-8");
		$Dao = M("options");  
		$list = $Dao->select();
		$this->assign("qq_group", $list[3]['value']);
	}
	public function bottom() {
		header("Content-Type:text/html; charset=utf-8");
		$navDao = M("navigate");  
		$navList = $navDao->where('is_show = "1"')->order('sort asc')->select();
        //dump($navList);	// 用 dump() 可以在调试阶段查看数据是否已读取
		$this->assign("navList", $navList);
	}

	public function pubHtml(){
		$this->head();
		$this->bottom();
		$this->friendlyLink();
		$this->setMessage();
	}

	public function newShow() {
		header("Content-Type:text/html; charset=utf-8");
		$Dao = M("article");  
		$newList = $Dao->where('ifShow = 1')->order('add_date desc')->limit('5')->select();
		$this->assign("newList", $newList);
		return $newList;
	}

	public function hotShow() {
		header("Content-Type:text/html; charset=utf-8");
		$Dao = M("article");  
		$hotList = $Dao->order('click_count desc')->limit('6')->select();
		$this->assign("hotList", $hotList);
		return $hotList;
	}
	
	//获取用户积分值
	public function getUserCredit($userId){
		$Dao = M("user"); 
		$list = $Dao->where('id = '.$userId)->field('credit')->find();	
		return $list['credit'];
	}
	
	//操作积分
	public function changeCredit($userId,$score,$operator = "add"){			
		$Dao = M("user");		
		if($operator == 'subtract'){
			$result = $Dao->query('update __TABLE__  set credit=credit-'.$score.' where id = '.$userId);	
		}else{
			$result = $Dao->query('update __TABLE__  set credit=credit+'.$score.' where id = '.$userId);
		}
		if($result != false){
			return ture;
		}else{
			return false;
		}			
	}
	
	//获取用户IP		
	function getIps() {
		if(getenv('HTTP_CLIENT_IP') && strcasecmp(getenv('HTTP_CLIENT_IP'), 'unknown')){
			$IP = getenv('HTTP_CLIENT_IP');
		} elseif(getenv('HTTP_X_FORWARDED_FOR') && strcasecmp(getenv('HTTP_X_FORWARDED_FOR'), 'unknown')) {
			$IP = getenv('HTTP_X_FORWARDED_FOR');
		} elseif(getenv('REMOTE_ADDR') && strcasecmp(getenv('REMOTE_ADDR'), 'unknown')) {
			$IP = getenv('REMOTE_ADDR');
		} elseif(isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], 'unknown')) {
			$IP = $_SERVER['REMOTE_ADDR'];
		}
		return $IP ? $IP : "unknow";
	}

	//邮件发送  
	public function send_mail($frommail,$tomail,$subject,$body,$ccmail,$bccmail) { 
		 date_default_timezone_set("Asia/Shanghai");//设定时区东八区    
		 $mail = new PHPMailer();  
		   $mail->IsSMTP();                            // 经smtp发送  
		   $mail->CharSet='utf-8'; //编码 
		   $mail->SMTPDebug  = 1; // 启用SMTP调试功能  
		   $mail->Host     = "smtp.163.com";           // SMTP 服务器  
		   $mail->SMTPAuth = true;                     // 打开SMTP 认证  
		   $mail->Username = "lihuazhai_com@163.com";    // 用户名  
		   $mail->Password = "lihuazhai_2014";          // 密码  
		   $mail->From     = $frommail;                  // 发信人  
		   $mail->FromName = "梨花寨-www.lihuazhai.com";        // 发信人别名  
		   $mail->AddAddress($tomail);                 // 收信人  
		   if(!empty($ccmail)){  
		   $mail->AddCC($ccmail);                    // cc收信人  
		}  
		if(!empty($bccmail)){  
		   $mail->AddCC($bccmail);                   // bcc收信人  
		}  
		$mail->WordWrap = 50;  
		  $mail->IsHTML(true);                            // 以html方式发送  
		  $mail->Subject  = $subject;                 // 邮件标题  
		  $mail->Body     = $body;                    // 邮件内空  
		  $mail->AltBody  =  "请使用HTML方式查看邮件。";  
		  
		  return $mail->Send();  
		} 

	//生成验证码
		Public function verify(){
			import('ORG.Util.Image');
			Image::buildImageVerify();
		}
		public function ding(){
			$model = M("comments");
			$sql = "update __TABLE__ set ding = ding + 1 where id = '$_POST[id]';";
        $result = $model->query($sql); //增加顶数字	
        $newDing = $model->getFieldById($_POST[id],'ding');	//针对某个字段查询并返回某个字段的值
        if($result !== false) {
        	$com['flag'] = 0; 
        	$com['ding'] = $newDing; 
        }else{
        	$com['flag'] = 1;
        }
        echo json_encode($com); 
    }
    public function cai(){
    	$model = M("comments");
    	$sql = "update __TABLE__ set cai = cai + 1 where id = '$_POST[id]';";
        $result = $model->query($sql); //增加踩数字	
        $newCai = $model->getFieldById($_POST[id],'cai');	//针对某个字段查询并返回某个字段的值
        if($result !== false) {
        	$com['flag'] = 0; 
        	$com['cai'] = $newCai; 
        }else{
        	$com['flag'] = 1;
        }
        echo json_encode($com); 
    }
    

	//发布需求--index
    public function requireAdd() {
    	header("Content-Type:text/html; charset=utf-8");
    	if($_SESSION['verify'] != md5($_POST['verify'])) {
		   //$this->error('验证码错误！');
    		$com[flag] = 1; 
    		echo json_encode($com); 
    		return;
    	}else{
    		$com[flag] = 0;
    		echo json_encode($com); 
    	}

    	$Dao = M("requirement");
        //临时取消发布需要注册的限制
        //if(isset($_SESSION['uid'])){
    	if(!empty($_POST['content'])) {
           	    $user_ip = $this->getIps();	//获取用户IP;
           	    $data["title"] = '来自用户的需求';
                //$data["userId"] = $_SESSION['uid'];
           	    $data["type"] = $_POST['type'];
           	    $data["content"] = $_POST['content'];
           	    $data["status"] = '待处理';
           	    $data["add_date"] = date("Y-m-d H:i:s");
                // 写入数据
           	    if ($lastInsId = $Dao->add($data)) {
           	    	$emailTitle = '来自梨花寨-www.lihuazhai.com平台的评论';			
           	    	$url_this = "http://$_SERVER[HTTP_HOST]"."__ROOT__/index.php/Require/detail/?id=".$lastInsId;
           	    	$emailBody = '';
           	    	$emailBody .= $data["content"];
           	    	$emailBody .= '<br/>';
           	    	$emailBody .= '用户IP信息:'.$user_ip;
           	    	$emailBody .= '<br/>';
           	    	$emailBody .= '点击链接回复:<a href="'.$url_this.'">'.$url_this.'</a>';

           	    	$this->send_mail("lihuazhai_com@163.com","254264446@qq.com",$emailTitle,$emailBody ,"","");  
           	    } else {
           	    	$this->error('数据写入错误！');
           	    }
           	}else{
           		echo "注意填写必填项！";
           	}
        //}else{
            //echo "请先注册为会员！";
        //}
           }

	//发布评论
    public function commentAdd() {
       	header("Content-Type:text/html; charset=utf-8");

           	if($_POST['ifVerification'] != "false" && $_SESSION['verify'] != md5($_POST['verify'])) {
		   //$this->error('验证码错误！');
           		$com[flag] = 1; 
           		$com[msg] = '验证码错误！'; 
           		echo json_encode($com); 
           		return false;
           	}else{
           		$com[flag] = 0;
		   //echo json_encode($com); 
           	}

           	$Dao = M("comments");
		//临时屏蔽留言需要登陆
		//if (isset($_SESSION['uid'])){		
    		$user_ip = $this->getIps();	//获取用户IP;
    		$data["subject_id"] = $_POST['id'];
	        //$data["user_id"] = $_SESSION['uid'];
    		$data["comment_parent"] = $_POST['parent_id'];
    		$data["content"] = $_POST['content'];
    		$data["type"] = $_POST['type'];
    		$data["ip"] = $user_ip;
    		if($_POST['ifVerification'] != "false"){
    			$data["verify"] = $_POST['verify'];
    		}else{
    			$data["verify"] = '8888';
    		}
    		$data["add_date"] = date("Y-m-d H:i:s");
	        // 写入数据
    		if ($lastInsId = $Dao->add($data)) {
    			$resultArr = array('flag'=>'0');
    			$resultMsg = json_encode($resultArr);
    			echo $resultMsg;

    			$emailTitle = '来自梨花寨-www.lihuazhai.com平台的评论';	
    			if($_POST['type'] == "require"){
    				$url_this = "http://$_SERVER[HTTP_HOST]"."__ROOT__/index.php/Require/detail/?id=".$_POST['id'];
    			}else{
    				$url_this = "http://$_SERVER[HTTP_HOST]"."__ROOT__/index.php/Article/detail/?id=".$_POST['id'];
    			}	
    			$emailBody = '';
    			$emailBody .= $data["content"];
    			$emailBody .= '<br/>';
    			$emailBody .= '用户IP信息:'.$user_ip;
    			$emailBody .= '<br/>';
    			$emailBody .= '点击链接回复:<a href="'.$url_this.'">'.$url_this.'</a>';
    			$this->send_mail("lihuazhai_com@163.com","254264446@qq.com",$emailTitle,$emailBody ,"","");
				//$this->changeCredit($_SESSION['uid'],1);//加积分
    			return ture;	

    		} else {
    			$this->error('数据写入错误！');
    			$resultArr = array('flag'=>'1','msg'=>'添加出错！');
    			$resultMsg = json_encode($resultArr);
    			echo $resultMsg;
    			return false;
    		}

	    //}
    	}

	//显示评论
    	public function showComment($id,$type) {
    		header("Content-Type:text/html; charset=utf-8");		
    		$Dao = M("comments");
    		$list = $Dao->where('subject_id = '. $id .' AND comment_parent = 0 AND type = "'. $type .'" AND passed = 1')
    		->select();

			//留言等级关系		
    		foreach ($list as $key => $value) {
    			$list_sub = $Dao->where('comment_parent = '. $value['id'].' AND passed = 1')->select();
    			$list[$key][sub_comment] = $list_sub;			 	
    		}
    		$this->assign("comment", $list);
    	}
    //显示tag列表
    	public function tagList() {
    		$Dao = M("category"); 
    		$list = $Dao->where('type = "tag"')->select();
    		$this->assign("taglist", $list);
    	}
    /**文章搜索
    *ajax调用
    *不分页
    */
    public function tagSearch(){
    	header("Content-Type:text/html; charset=utf-8");	
    	$Dao = M("article");
    	$list = $Dao->Table('my_article article,my_category category')
    	->where('article.cateId = category.id and article.tag =  '.$_POST['tagId'].' and article.ifShow = 1')
    	->field('article.id as id,article.title,article.summary,article.content,article.add_date,article.click_count,category.name as typeName')
    	->order('article.add_date desc')
    	->select();	
        //dump($list);
        $tpl_json = json_encode($list);//转json数据
        echo $tpl_json;
    }
}
?>