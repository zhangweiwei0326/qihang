<?php
class RequireAction extends CommonAction {
    public function index() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("requirement_yizhan");
        $list = $Dao->select(); 
        $this->assign("list", $list);
        $this->display();
    }
    public function add() {
        $this->display('add');
        if (isset($_POST['add'])) {
            if (!empty($_POST['title']) && !empty($_POST['content'])) {
                $Dao = M("requirement_yizhan");
                $data["title"] = $_POST['title'];
                $data["url"] = $_POST['url'];
                $data["content"] = $_POST['content'];
                $data["add_date"] = time();
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
        $Dao = D("requirement_yizhan");
        $ID_Dele = implode(",", $_POST['id']);
        if ($Dao->delete($ID_Dele)) {
            $this->success("删除成功！");
        } else {
            $this->error('删除失败！');
        }
    }
    public function edit() {
        $Dao  = M("requirement_yizhan");
        $id = (int) $_GET['id'];
        $list = $Dao ->where("id=$id")->find();
        $this->assign("list", $list);
        $this->assign("title", '编辑');
        $this->display();
    }
    public function updata() {
        $Dao = M("requirement_yizhan");
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
    public function detail() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("requirement_yizhan");  // 查询数据
        $list = $Dao->where('id = '. $_GET[id])->find();
        $this->assign("list", $list);
        $this->display();
    }
}
