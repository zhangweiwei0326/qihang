<?php
Vendor("PHPMailer.class#phpmailer"); //包函邮件发送类
class UserAction extends PublicAction {
    public function toLogin() {
		$this->pubHtml();
		$this->display("login");
    }
	
	public function login() {
		// $this->pubHtml();
		// $this->display();
        if (isset($_POST['login'])) {
            if (!empty($_POST[email]) && !empty($_POST[password])) {
                //$username = str_replace(" ", "",$_POST[username]);
                $email = trim($_POST['email']);
                $password = trim($_POST['password']);
                $Dao = M("user");
                $condition['email'] = $email;
                $userList = $Dao->where($condition)->find();
                $ifUser = is_array($userList = $Dao->where($condition)->find());
                $ifPass = $ifUser ? md5(md5($password).$userList['random']) == $userList['password'] : FALSE;
                if ($ifPass) {
                    $_SESSION['uid'] = $userList['id'];
                    $_SESSION['email'] = $userList['email'];
                    //$_SESSION['nickname'] = $userList['nickname'];
                    setcookie('uid', $userList['id'], time() + (60 * 60 * 24 * 30));
                    setcookie('email', $userList['email'], time() + (60 * 60 * 24 * 30));
                    //setcookie('nickname', $userList['nickname'], time() + (60 * 60 * 24 * 30));
					$this->changeCredit($userList['id'],1);
					
                    $this->assign("jumpUrl", "__APP__/Index/index");
                    $this->success("登录成功！");
                } else {	
                    $this->assign("jumpUrl","__APP__/Index/index");
					$this->error("登录失败！");
                }
            }
        }
    }
    public function logout() {
        /* 同时注销session和cookie的页面 */
        session_start();
        //使用一个会话变量检查登录状态
        if (isset($_SESSION['uid'])) {
            //要清除会话变量，将$_SESSION超级全局变量设置为一个空数组
            $_SESSION = array();
            //如果存在一个会话cookie，通过将到期时间设置为之前1个小时从而将其删除
            if (isset($_COOKIE[session_name()])) {
                setcookie(session_name(), '', time() - 3600);
            }
            //使用内置session_destroy()函数调用撤销会话
            session_destroy();
        }
        //同时将各个cookie的到期时间设为过去的某个时间，使它们由系统删除，时间以秒为单位
        setcookie('uid', '', time() - 3600);
        setcookie('email', '', time() - 3600);
        $this->assign("jumpUrl", "__APP__/Index/index");
        $this->success("登出成功！");
    }
    
    //注册用户
    public function register() {
		$this->pubHtml();
        $this->display();
        if (isset($_POST['add'])) {
            if (!empty($_POST['email']) && !empty($_POST['password'])) {

                $Dao = M("user");
				$email = trim($_POST['email']); 
				$data = $Dao->where('`email` = "'. $email .'"')->find(); 
				if(isset($data['email'])){ 
					$this->error('用户名已存在，请换个其他的用户名！');
					return false;
				}

            	if($_POST['password'] != $_POST['password2']){
					$this->error('密码不一致！');
					return false;
            	}

            	$activate_code = md5($_POST['email'].$_POST['password'].$regtime); //创建用于激活识别码 
            	$token_exptime = time()+60*60*24;//过期时间为24小时后

				$data["email"] = $_POST['email'];
				$random = substr(uniqid(rand()), -6);
				$data["password"] = md5(md5($_POST['password']).$random);
				$data["random"] = $random;
				$data["state"] = 0;
				$data["activate_code"] = $activate_code;
				$data["token_exptime"] = $token_exptime;
				$data["register_date"] = date("Y-m-d H:i:s");
                // 写入数据
                if ($lastInsId = $Dao->add($data)) {
                	$this->sendActivateEmail($lastInsId,$activate_code);
                    $this->assign("jumpUrl", "__APP__/Index/index");
                    $this->success("恭喜您，注册成功！<br/>请登录到您的邮箱及时激活您的帐号！");
                } else {
                    $this->error('数据写入错误！');
                }
            }
        }
    }

    //发送激活邮件
    public function sendActivateEmail($userId,$token){
		$emailTitle = '来自梨花寨-www.lihuazhai.com平台的评论';			
		$url_this = "http://$_SERVER[HTTP_HOST]"."/qihang/index.php/User/activateUser/?id=".$userId."&token=".$token;
		$emailBody = '';
		$emailBody .= '梨花寨，欢迎加入我们！';
		$emailBody .= '<br/>';
		$emailBody .= '<br/>';
		$emailBody .= '点击链接激活帐号:<a href="'.$url_this.'">'.$url_this.'</a>';

		$this->send_mail("254264446@qq.com",$emailTitle,$emailBody ,"",""); 
    }

    //激活帐号
    public function activateUser(){
		$Dao = M("user");
		$userId = (int) $_GET['id'];
		$activate_code = $_GET['token'];

		$data = $Dao->where('`id` = "'. $userId .'" and `activate_code` = "'.$activate_code.'"')->find();

		if(isset($data['state'])){
			if($data['state'] == 1){
				$this->error('已激活过了，无需要重复激活！');
				return false;
			} 
			if(time() > $data['token_exptime']){
				$this->error('您的激活有效期已过，请登录您的帐号重新发送激活邮件！');
				return false;
			} 
			$data['state'] = 1;
			$Dao->where('id='.$userId)->save($data); // 更改激活状态
			$this->assign("jumpUrl", "__APP__/Index/index/");
			$this->success("更新成功！");
		}else{
			$this->error('激活失败！');
		}
    }
	
	public function edit() {
		$Dao = M("user");
		$id = (int) $_GET['id'];
		$list = $Dao->where("id=$id")->find();
		$this->assign("list", $list);
		$this->assign("title", '编辑');
		$this->display();
	}
	
	public function update() {
		$Dao = M("user");
		if ($Dao->create()) {
			if ($lastID = $Dao->save()) {
				$this->assign("jumpUrl", "__APP__/Index/index/");
				$this->success("更新成功！");
			} else {
				$this->error('更新失败！');
			}
		} else {
			$this->error($message);
		}
	}
		
	public function showSkill(){		
		$Dao = M("skill");
        $skillList = $Dao->select();	
        $this->assign("skillList", $skillList);		
	}
	
	public function userAdmin() {
		$Dao = M("user");	
		if(isset($_SESSION['uid'])){		
			$list = $Dao->where("id=".$_SESSION['uid'])->find();
			$this->showSkill();
			$this->collect();
			$this->pubHtml();
			$this->assign("list", $list);
			$this->display();	
		}	
	
	}
	
	public function updateUserMsg(){
		$skillList = $_POST[skillId];
		$Dao = M("user_skill");	
		foreach ($skillList as $skillId){		
			$data["userId"] = $_SESSION['uid'];
			$data["skillId"] = $skillId;
			$data["add_date"] = date("Y-m-d H:i:s");
			if ($lastInsId = $Dao->add($data)) {
				//echo "插入数据 id 为：$lastInsId";
				$this->assign("jumpUrl", "__APP__/Index/index/");
				$this->success("添加成功！");
			} else {
				$this->error('数据写入错误！');
			}
		}
	}

	//展示收藏列表
	public function collect(){
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("article"); 
        $user_id = $_SESSION['uid'];

        $articleList = $Dao->table('my_article article,my_category category,my_collect collect')
            ->where('article.cateId = category.id and collect.user_id = '.$user_id.' and article.id = collect.article_id and article.ifShow = 1')
            ->field('article.id as id,article.title,article.summary,article.is_original,article.content,article.add_date,article.click_count,category.name as typeName')
			->order('article.add_date desc')
            ->select();

         $this->assign("articleList", $articleList);
	}
	
	
}