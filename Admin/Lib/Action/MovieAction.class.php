<?php
class MovieAction extends CommonAction {
    public function index() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("movie");
		$list_noSeen = $Dao ->where('is_seen = "0"')-> select();;	
        $list_seen = $Dao ->where('is_seen = "1"')-> select();			
        $this->assign("list_noSeen", $list_noSeen);
		$this->assign("list_seen", $list_seen);
        $this->display();
    }
	
	public function add(){		
		$cateDao  = M("category");
		$catelist = $cateDao ->where('type = "movie"')->select();
		$this->assign("catelist", $catelist);
		$this->display('form');
	}
	
	public function edit() {
        $Dao  = M("movie");
        $id = (int) $_GET['id'];
        $list = $Dao ->where("id=$id")->find();
		$cateDao  = M("category");
		$catelist = $cateDao ->where('type = "movie"')->select();
        $this->assign("list", $list);
		$this->assign("catelist", $catelist);
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
			$Dao = M("movie");
			$data["name"] = $_POST['name'];
			$data["title"] = $_POST['title'];
			$data["category"] = $_POST['category'];
			$data["content"] = $_POST['content'];			
			$data["is_seen"] = $_POST['is_seen'];
			$data["url"] = $_POST['url'];
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
        $Dao = M("movie");
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
        $Dao = D("movie");
        $ID_Dele = implode(",", $_POST['id']);
        if ($Dao->delete($ID_Dele)) {
            $this->success("删除成功！");
        } else {
            $this->error('删除失败！');
        }
    }
    public function detail() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("movie"); 
        $list = $Dao->where('id = '. $_GET[id])->find();
        $this->assign("list", $list);
        $this->display();
    }
}
