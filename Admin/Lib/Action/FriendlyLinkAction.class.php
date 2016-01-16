<?php
class FriendlyLinkAction extends CommonAction {

	public function index() {
		header("Content-Type:text/html; charset=utf-8");	
		$Dao = M("friendly_link"); 
		$list = $Dao->select();
		$this->assign("list", $list);
		$this->display();
	}
	 
	public function add() {
		$this->display();
		if (isset($_POST['add'])) {
			if (!empty($_POST['webname']) && !empty($_POST['weburl'])) {
				$Dao = M("friendly_link");
				$data["name"] = $_POST['webname'];
				$data["url"] = $_POST['weburl'];
				// 写入数据
				if ($lastInsId = $Dao->add($data)) {
					//echo "插入数据 id 为：$lastInsId";
					$this->assign("jumpUrl", "__URL__/index/");
					$this->success("添加成功！");
				} else {
					$this->error('数据写入错误！');
				}
			}
		}
	}

	public function del() {
		$dao = D("article");
		$ID_Dele = implode(",", $_POST['id']);
		if ($dao->delete($ID_Dele)) {
			$this->success("删除成功！");
		} else {
			$this->error('删除失败！');
		}
	}

	public function edit() {
		$dao = M("friendly_link");
		$id = (int) $_GET['id'];
		$list = $dao->where("id=$id")->find();
		$this->assign("list", $list);		
		$this->assign("title", '编辑');
		$this->display();
	}

	public function update() {
		$dao = M("friendly_link");
		if($dao->create()){
			if ($lastID = $dao->save()) {
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





