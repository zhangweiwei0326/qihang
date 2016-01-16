<?php
class SetAction extends CommonAction {
    public function index() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("options");
        $list = $Dao->select();
        $this->assign("web_name", $list[0][value]);
        $this->assign("admin_email", $list[1][value]);
        $this->assign("admin_tel", $list[2][value]);
		$this->assign("qq_group", $list[3][value]);
        $this->display();
    }
		
	public function edit(){
		header("Content-Type:text/html; charset=utf-8");
        $Dao = M("options");
        $list = $Dao->select();
        $this->assign("web_name", $list[0][value]);
        $this->assign("admin_email", $list[1][value]);
        $this->assign("admin_tel", $list[2][value]);
		$this->assign("qq_group", $list[3][value]);
        $this->display();
	}
	
	public function update() {
		if (!empty($_POST['web_name'])) {
			$Dao = M("options");
			$data['value'] = $_POST['web_name'];
			$condition['name'] = 'web_name';
			$result = $Dao->where($condition)->save($data);
	
			if ($result !== false) {
				echo '数据更新成功！';
			} else {
				echo '数据更新失败！';
			}
		}
	
		if (!empty($_POST['admin_email'])) {
			$Dao = M("options");
			$data['value'] = $_POST['admin_email'];
			$condition['name'] = 'admin_email';
			$result = $Dao->where($condition)->save($data);
	
			if ($result !== false) {
				echo '数据更新成功！';
				$this->assign("jumpUrl", "__URL__/index/");
			} else {
				echo '数据更新失败！';
			}
		}
	
		if (!empty($_POST['admin_tel'])) {
			$Dao = M("options");
			$data['value'] = $_POST['admin_tel'];
			$condition['name'] = 'admin_tel';
			$result = $Dao->where($condition)->save($data);
	
			if ($result !== false) {
				echo '数据更新成功！';
			} else {
				echo '数据更新失败！';
			}
		}
		
		if (!empty($_POST['qq_group'])) {
			$Dao = M("options");
			$data['value'] = $_POST['qq_group'];
			$condition['name'] = 'qq_group';
			$result = $Dao->where($condition)->save($data);
	
			if ($result !== false) {
				echo '数据更新成功！';
			} else {
				echo '数据更新失败！';
			}
		}
		
		
	}
}
?>