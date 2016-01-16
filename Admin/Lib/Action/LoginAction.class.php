<?php
class LoginAction extends Action {   
	public function login() {
        $this->display();
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
					
					//超级管理员识别
					if($userList['username'] == C('RBAC_SUPERADMIN') ){
						session(C('ADMIN_AUTH_KEY'),true);
					}else{
						session(C('ADMIN_AUTH_KEY'),false);
					}
					//读取用户权限
					import('ORG.Util.RBAC');
					RBAC::saveAccessList();
					//var_dump($_SESSION);
					//var_dump($_SESSION['_ACCESS_LIST']);
					//die;
					
                    setcookie('uid', $userList['id'], time() + (60 * 60 * 24 * 30));
                    setcookie('email', $userList['email'], time() + (60 * 60 * 24 * 30));
                    //setcookie('nickname', $userList['nickname'], time() + (60 * 60 * 24 * 30));
                    $this->assign("jumpUrl", "__APP__/Index/index");
                    $this->success("登录成功！");
                } else {	
                    $this->assign("jumpUrl","__APP__/Login/login");
					$this->error("登录失败！");
                }
            }
        }
    }
	
		// 用户登出
	function logout(){
		if(isset($_SESSION[C('USER_AUTH_KEY')])) {
			unset($_SESSION[C('USER_AUTH_KEY')]);
			unset($_SESSION);
			session_destroy();
			$this->success('登出成功!',"__APP__/Login/login");
        }else {
            $this->error('已经登出！');
        }
	}
	
   /*
   //用户退出
   public function logout() {
        //同时注销session和cookie的页面 
        //即使是注销时，也必须首先开始会话才能访问会话变量
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
        setcookie('username', '', time() - 3600);
		$this->success('登出成功!',U('Admin/Login/login'));	
    }
	*/
	
}
?>