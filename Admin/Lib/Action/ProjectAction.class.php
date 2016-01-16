<?php
class ProjectAction extends CommonAction {

	public function index() {
		header("Content-Type:text/html; charset=utf-8");
		$Dao = M("project");

		$list = $Dao->select();
		$this->assign("list", $list);
		$this->display();
	}
	 
	public function add() {
		$this->display();
		if (isset($_POST['add'])) {
			$Dao = M("project");
			$data["title"] = $_POST['title'];
			$data["content"] = $_POST['content'];
			$data["add_date"] = date("Y-m-d H:i:s");
			$data["plan_end_date"] = $_POST['plan_end_date'];
			if ($lastInsId = $Dao->add($data)) {
				$this->assign("jumpUrl", "__URL__/index/");
				$this->success("添加成功！");
			} else {
				$this->error('数据写入错误！');
			}
		}
	}

	public function edit() {
		$Dao = M("project");
		$id = (int) $_GET['id'];
		$list = $Dao->where("id=".$id)->find();
		$this->assign("list", $list);
		$this->assign("page_title", '编辑');
		$this->display();
	}

	public function update() {
		$Dao = M("project");
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
	 

	public function del() {
		 $id  = $_GET['id'];
		 $Dao = M("project");
		 $result = $Dao->where('id = '.$id)->delete();
		 if($result !== false){
		 	$this->assign("jumpUrl", "__URL__/index/");
		 	$this->success('删除成功！');
		 }else{
		 	$this->success('删除数据失败！');
		 }
	}

	public function showDetail() {
		header("Content-Type:text/html; charset=utf-8");
		$Dao = M("project");  // 查询数据
		$list = $Dao->where('id = ' . $_GET[id])->find();
		//dump($list);	// 用 dump() 可以在调试阶段查看数据是否已读取
		$this->assign("list", $list);
		$this->display();
	}


}




