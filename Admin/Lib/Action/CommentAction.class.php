<?php
class CommentAction extends CommonAction {
	public function index() {
		header("Content-Type:text/html; charset=utf-8");
		$Dao = M("comments");
		$list = $Dao->where('comment_parent = 0')
					->select();
		foreach($list as $n => $val){
     		$list[$n]['child'] = $Dao->where('comment_parent=\''.$val['id'].'\'')
		 							 ->select();      
    	}		
				
		$this->assign("list", $list);
		$this->display();
	}
	public function del() {
		$Article = D("comments");
		$ID_Dele = implode(",", $_POST['id']);
		if ($Article->delete($ID_Dele)) {
			$this->success("删除成功！");
		} else {
			$this->error('删除失败！');
		}
	}
	public function check() {
		$arrId = $_POST['id'];
		foreach ($arrId as $id) {
			$Dao = D("comments");
			$data['passed'] = '1';
			// 更新的条件
			$condition['id'] = $id;
			$result = $Dao->where($condition)->save($data);
			if ($result !== false) {
				$this->success("数据更新成功！");
			} else {
				$this->success("数据更新失败！");
			}
		}
	}
	public function cancel() {
		$arrId = $_POST['id'];
		foreach ($arrId as $id) {
			$Dao = D("comments");
			$data['passed'] = '0';
			// 更新的条件
			$condition['id'] = $id;
			$result = $Dao->where($condition)->save($data);
			if ($result !== false) {
				$this->success("数据更新成功！");
			} else {
				$this->success("数据更新失败！");
			}
		}
	}
	public function reply() {
		header("Content-Type:text/html; charset=utf-8");
		$Dao = M("comments");
		$data["article_id"] = $_POST['article_id'];
		$data["comment_parent"] = $_POST['comment_parent'];
		$data["content"] = $_POST['content'];
		$data["add_date"] = date("Y-m-d H:i:s");
		if ($lastInsId = $Dao->add($data)) {
			$this->success("发布成功！");
		} else {
			$this->error('数据写入错误！');
		}
	}
}
?>