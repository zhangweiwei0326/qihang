<?php
// 管理中心
class AdminAction extends CommonAction {
    public function index() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("skill");
        $list = $Dao->select();	
        $this->assign("list", $list);
        $this->display();
    }	
	
	public function addSkill() {
        header("Content-Type:text/html; charset=utf-8");
		
		if (isset($_POST['add'])) {
			if (!empty($_POST['name'])) {
				$Dao = M("skill");
				$data["name"] = $_POST['name'];
				$data["level"] = $_POST['level'];
				$data["describe"] = $_POST['describe'];
				$data["add_date"] = date("Y-m-d H:i:s");
				// 写入数据
				if ($lastInsId = $Dao->add($data)) {
					$this->assign("jumpUrl", "__URL__/index/");
					$this->success("新增成功！");
				} else {
					$this->error('数据写入错误！');
				}
			}
		}
    }
	
	public function edit() {
		$Dao = M("skill");
		$id = (int) $_GET['id'];
		$list = $Dao->where("id=$id")->find();
		$tpl_json = json_encode($list);//转json数据
		echo $tpl_json;
	}
	
	public function update() {
		$Dao = M("skill");
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
	
		
}
?>
