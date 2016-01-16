<?php
Vendor("PHPMailer.class#phpmailer"); //包函邮件发送类
class RequireAction extends PublicAction {
    public function index() {
		$this->newList();
        $this->pubHtml();
        $this->display();
    }
    public function add() {
     header("Content-Type:text/html; charset=utf-8");
     	if($_SESSION['verify'] != md5($_POST['verify'])) {
		   $this->error('验证码错误！');
		   $com[flag] = 1; 
		   echo json_encode($com); 
		   return;
		}else{
		   $com[flag] = 0;
		  // echo json_encode($com); 
		}

        //临时取消发布需要注册的限制
        //if(isset($_SESSION['uid'])){
           if (!empty($_POST['title']) && !empty($_POST['content'])) {
                $Dao = M("requirement");
                $data["title"] = $_POST['title'];
                //$data["userId"] = $_SESSION['uid'];
                $data["content"] = $_POST['content'];
                $data["status"] = '待处理';
                $data["add_date"] = date("Y-m-d H:i:s");
                // 写入数据
                if ($lastInsId = $Dao->add($data)) {
                	/**
                	*发送邮件
                	*/
					$emailTitle = '来自梨花寨-www.lihuazhai.com平台的评论';			
					$url_this = "http://$_SERVER[HTTP_HOST]"."__ROOT__/index.php/Require/detail/?id=".$lastInsId;
					$emailBody = '';
					$emailBody .= $data["content"];
					$emailBody .= '<br/>';
					$emailBody .= '用户IP信息:'.$user_ip;
					$emailBody .= '<br/>';
					$emailBody .= '点击链接回复:<a href="'.$url_this.'">'.$url_this.'</a>';
				    $this->send_mail("lihuazhai_com@163.com","254264446@qq.com",$emailTitle,$emailBody ,"","");  

                    $this->assign("jumpUrl", "__URL__/index/");
                    $this->success("添加成功！");
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
    public function del() {
        $Dao = D("requirement");
        $ID_Dele = implode(",", $_POST['id']);
        if ($Dao->delete($ID_Dele)) {
            $this->success("删除成功！");
        } else {
            $this->error('删除失败！');
        }
    }
    public function edit() {
        $Dao  = M("requirement");
        $id = (int) $_GET['id'];
        $list = $Dao ->where("id=$id")->find();
        $this->assign("list", $list);
        $this->assign("title", '编辑');
        $this->display();
    }
    public function updata() {
        $Dao = M("requirement");
        if ($Dao->create()) {
            if ($lastID = $Dao->save()) {
                $this->assign("jumpUrl", "__URL__/index/");
                $this->success("更新成功！");
            } else {
                $this->error('更新失败！');
            }
        } else {
            $this->error($message);
        }
    }
    public function newList() {
        $Dao = M("requirement");
        $newList = $Dao->select(); 
        $this->assign("newList", $newList);
    }
    public function detail() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("requirement");
        //防止攻击
        $id = intval($_GET["id"]);  
        $list = $Dao->where('id = '. $id)->find();
        $this->assign("list", $list);

        $this->newList();
        $this->pubHtml();
        $this->showComment($id,'require');//显示评论
        $this->display();
    }
}
?>