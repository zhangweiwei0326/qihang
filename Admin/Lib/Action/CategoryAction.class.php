<?php
class CategoryAction extends CommonAction {
	public function index() {
		header("Content-Type:text/html; charset=utf-8");
		$Dao = M("navigate");  // 查询数据
		$list = $Dao->order('sort')->select();
		$this->assign("list", $list);
		$this->category();
		$this->display();
	}
	public function add() {
		if (isset($_POST['add'])) {
			if (!empty($_POST['name']) && !empty($_POST['url'])) {
				$Dao = M("navigate");
				$data["name"] = $_POST['name'];
				$data["url"] = $_POST['url'];
				$data["sort"] = $_POST['sort'];
				// 写入数据
				if ($lastInsId = $Dao->add($data)) {
					//echo "插入数据 id 为：$lastInsId";
					$this->assign("jumpUrl", "__URL__/index/");
					$this->success("成功！");
				} else {
					$this->error('错误！');
				}
			}
		}
	}
	
	public function edit() {
		$article = M("navigate");
		$id = (int) $_GET['id'];
		$list = $article->where("id=$id")->find();
		$this->assign("list", $list);		
		$this->assign("title", '编辑');
		$this->display();
	}
	
	public function update() {
		$Dao = M("navigate");
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

    //分类管理
	public function category(){
		$Dao = M("category"); 
		$list = $Dao->select();
		$this->assign("categoryList", $list);
	}

	public function cate_add() {
		if (isset($_POST['add'])) {
			if (!empty($_POST['name'])) {
				$Dao = M("category");
				$data["name"] = $_POST['name'];
				$data["type"] = $_POST['type'];
				// 写入数据
				if ($lastInsId = $Dao->add($data)) {
					//echo "插入数据 id 为：$lastInsId";
					$this->assign("jumpUrl", "__URL__/index/");
					$this->success("成功！");
				} else {
					$this->error('错误！');
				}
			}
		}
	}

	public function cate_edit() {
		$article = M("category");
		$id = (int) $_GET['id'];
		$list = $article->where("id=$id")->find();
		$this->assign("list", $list);		
		$this->assign("title", '编辑');
		$this->display();
	}
	public function cate_update() {
		$Dao = M("category");
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