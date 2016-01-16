<?php
class PlanAction extends Action {

    public function index() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("plan");
        $list = $Dao->select();	
        $this->assign("list", $list);
        $this->display();
    }
	
	public function add(){
		$this->display('form');
	}
	
	public function edit() {
        $Dao  = M("plan");
        $id = (int) $_GET['id'];
        $list = $Dao ->where("id=$id")->find();
        $this->assign("list", $list);
        $this->assign("title", '编辑');
        $this->display("form");
    }
	
	public function save(){
		if(!empty($_POST['id'])){
			$this->updata();
	     }else{
		 	$this->insert();
		 }
	}
	
	public function insert(){
		if (!empty($_POST['name'])) {
			$Dao = M("plan");
			$data["name"] = $_POST['name'];
			$data["priority"] = $_POST['priority'];
			$data["plan_date"] = $_POST['plan_date'];
			$data["content"] = $_POST['content'];
			$data["add_date"] = date("Y-m-d H:i:s");
			if ($lastInsId = $Dao->add($data)) {
				//echo "插入数据 id 为：$lastInsId";
				$this->assign("jumpUrl", "__URL__/index/");
				$this->success("添加成功！");
			} else {
				$this->error('数据写入错误！');
			}
		}
	}
	
	public function updata() {
        $Dao = M("plan");
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
        $Dao = D("plan");
        $ID_Dele = implode(",", $_POST['id']);

        if ($Dao->delete($ID_Dele)) {
            $this->success("删除成功！");
        } else {
            $this->error('删除失败！');
        }
    }

    public function detail() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("plan"); 
        $list = $Dao->where('id = '. $_GET[id])->find();
        $this->assign("list", $list);
        $this->display();
    }

}





