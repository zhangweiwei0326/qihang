<?php
class IndexAction extends Action {   
	public function index() {
        session_start();
        header("Content-Type:text/html; charset=utf-8");
        //使用一个会话变量检查登录状态
		//如果会话没有被设置，查看是否设置了cookie
        if (!isset($_SESSION['uid'])) {
            if (isset($_COOKIE['uid']) && isset($_COOKIE['username'])) {
                //用cookie给session赋值
                $_SESSION['uid'] = $_COOKIE['uid'];
                $_SESSION['username'] = $_COOKIE['username'];
                $_SESSION['nickname'] = $_COOKIE['nickname'];
            }
			$this->display("Login:login");
        }else{
			$this->assign("nickname", $_SESSION['nickname']);
			$this->showDefines();
        	$this->display();
		}
    }
	/*
	public function index() {
		header("Content-Type:text/html; charset=utf-8");
		$this->showDefines();
		$this->display();
	}
	*/
    
    public function showDefines() {
        $Dao = M("report_define");  // 查询数据
        $list = $Dao->select();
        $this->assign("report_defines", $list);
    }
	
	public function loadFilter() {
        $Dao = M("report_define");  // 查询数据
		$id = (int) $_GET['id'];
		$list = $Dao->where("id=$id")->find();
        //$this->assign("report_defines", $list);
    }
    public function mail() {        
        $sendto = 'liquorbar@163.com';
        $title = 'hello word!';
        $response = 'response!';        
        SendMail($sendto, $title, $response);       
    }
/******************
 * 一键清除所有缓存 *
 *******************/
public function delcache() {
	$abs_dir=dirname(dirname(dirname(dirname(__FILE__))));	
	$type = $_GET['type'];
	//$dir=$abs_dir.'\Admin\Runtime\\';原装是这样的
	$dir = $abs_dir.'\\'.$type.'\Runtime\\';
	if($this->deldir($dir)){
		echo true;
	}else{
		echo false;
	}	
		
}
public function deldir($dir){
	$dh = opendir($dir);
	while ($file=readdir($dh)) {
	    if($file!="." && $file!="..") {
	      $fullpath=$dir."/".$file;
	      if(!is_dir($fullpath)) {
	          unlink($fullpath);
	      } else {
	        $this->deldir($fullpath);
	      }
	    }
	}
	closedir($dh);
	if(rmdir($dir)) {
	    return true;
	 } else {
	    return false;
	 }
}
}
?>