<?php   
class ContactAction extends PublicAction {
    public function index() {
      header("Content-Type:text/html; charset=utf-8");
        $Dao = M("options");        
        //网站名称
        $web_name = $Dao->where('name = "web_name"')->find();
        $this->assign("web_name", $web_name);
        
        //Email
        $admin_email = $Dao->where('name = "admin_email"')->find();
        $this->assign("admin_email", $admin_email);
        
        //电话
        $admin_tel = $Dao->where('name = "admin_tel"')->find();
        $this->assign("admin_tel", $admin_tel);
        
        $this->pubHtml();
        $this->display();
    }
        
  
}
?>
