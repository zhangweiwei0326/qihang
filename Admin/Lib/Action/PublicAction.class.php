<?php
class PublicAction extends Action{
	function index(){
		$this->login();
	}
	
	function login(){
		$this->display("login");
	}
	
	function checkLogin(){
		if(empty($_POST['username'])) {
			$this->error('帐号错误！');
		}elseif (empty($_POST['password'])){
			$this->error('密码必须！');
		}
		
        //生成认证条件
        $map =  array();
		// 支持使用绑定帐号登录
		$map['username'] = $_POST['username'];
		
		import ('ORG.Util.RBAC');
        $authInfo = RBAC::authenticate($map);
        //使用用户名、密码和状态的方式进行认证
        if(false === $authInfo) {
            $this->error('帐号不存在或已禁用！');
        }else {
            if($authInfo['password'] != md5($_POST['password'])) {
            	$this->error('密码错误！');
            }
            $_SESSION[C('USER_AUTH_KEY')]	=	$authInfo['id'];
			$_SESSION['nickname']	=	$authInfo['nickname'];
            if($authInfo['username']=='admin') {
            	$_SESSION['administrator']	=	true;
            }
          
			// 缓存访问权限
            RBAC::saveAccessList();
			$this->success('登录成功！',__APP__.'/Index/index');
		}
	}
	
	// 用户登出
	function logout(){
		if(isset($_SESSION[C('USER_AUTH_KEY')])) {
			unset($_SESSION[C('USER_AUTH_KEY')]);
			unset($_SESSION);
			session_destroy();
            $this->assign("jumpUrl",__URL__.'/login/');
            $this->success('登出成功！');
        }else {
            $this->error('已经登出！');
        }
	}
	
}
?>