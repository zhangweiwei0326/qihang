<?php
class WebsiteAction extends CommonAction {
	public function index() {
		header("Content-Type:text/html; charset=utf-8");
		$DaoCate  = M("category");
		$listCate = $DaoCate ->where('type = "website"')->select();	
		
		$DaoWeb = M("website");	  		
		$result = array();
		foreach ($listCate as $value) {  
			$condition['cate_id'] = $value[id];
			//$condition['is_public'] = 1;
			$listWeb = $DaoWeb->where($condition)->select();
			$value['web'] = $listWeb;
			$result[] = $value;
		} 			
			
		/*if (isset($_GET['id'])) {
			$id  = $_GET['id'];
			$condition['cate_id'] = $id;
			$list = $Dao->where($condition)->select();
		}else{
			$list = $Dao->select();
		}*/
		
		$this->assign("result", $result);
		$this->websiteCate();
		$this->display();
	}
	
	public function websiteCate() {
		$cateDao  = M("category");
		$catelist = $cateDao ->where('type = "website"')->select();
		$this->assign("website_cate", $catelist);
	}
	
	public function categoryAdd() {
		if (isset($_POST['add'])) {
			if (!empty($_POST['name'])) {
				$Dao = M("category");
				$data["name"] = $_POST['name'];
				if ($lastInsId = $Dao->add($data)) {
					//echo "插入数据 id 为：$lastInsId";
					$this->assign("jumpUrl", "__URL__/index/");
					$this->success("登录成功！");
				} else {
					$this->error('数据写入错误！');
				}
			}
		}
	}
	
	public function cateEdit() {
		$name = $_POST['name'];
		$id   = $_POST['id'];
		$Dao = M("category");
		// 需要更新的数据
		$data['name'] = $name;
		// 更新的条件
		$condition['id'] = $id;
		$result = $Dao->where($condition)->save($data);
		if($result !== false){
			echo '数据更新成功！';
		}else{
			echo '数据更新失败！';
		}
	}
	public function add() {
		$this->websiteCate();
		$this->display();
		
		if (isset($_POST['add'])) {
			if (!empty($_POST['webname'])) {
				$Dao = M("website");
				$data["cate_id"] = $_POST['cate_id'];
				$data["name"] = $_POST['webname'];
				$data["url"] = $_POST['weburl'];
				$data["is_public"] = $_POST['is_public'];
				$data["add_date"] = date("Y-m-d H:i:s");
				// 写入数据
				if ($lastInsId = $Dao->add($data)) {
					//echo "插入数据 id 为：$lastInsId";
					$this->assign("jumpUrl", "__URL__/index/");
					$this->success("登录成功！");
				} else {
					$this->error('数据写入错误！');
				}
			}
		}
	}
	public function edit() {
		$Dao = M("website");
		$id = (int) $_GET['id'];
		$list = $Dao->where("id=$id")->find();
		$this->assign("list", $list);
		$this->assign("title", '编辑');
		$this->websiteCate();
		$this->display();
	}
	public function update() {
		$Dao = M("website");
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