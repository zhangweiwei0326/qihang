<?php
class HandbookAction extends CommonAction {
    public function index() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("handbook");
        
        $list = $Dao->table('my_handbook handbook,my_handbook_name handbook_name')
            ->where('handbook.belong = handbook_name.id')
            ->field('handbook.id,handbook.title,handbook.add_date,handbook_name.name as typeName')
            ->order('handbook.add_date desc')
            ->select();
        $this->assign("list", $list);
        $this->display();
    }
    public function addHandbook() {
        $this->handbookNameList();
        
        $this->display('addHandbook');
        if (isset($_POST['add'])) {
            if (!empty($_POST['name'])) {
                $Dao = M("handbook_name");
                $data["name"] = $_POST['name'];
                $data["add_date"] = date("Y-m-d H:i:s");
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
    
    public function handbookNameList() {
        $Dao = M("handbook_name"); 
        $list = $Dao->select();
        $this->assign("handbookNameList", $list);
    }
    
    public function handbookList() {
        $Dao = M("handbook"); 
        $list = $Dao->select();
        $this->assign("handbookList", $list);
    }
    
    public function add() {
        $this->handbookList();
        $this->handbookNameList();
        $this->display('add');
        if (isset($_POST['add'])) {
            if (!empty($_POST['title'])) {
                $Dao = M("handbook");
                $data["title"] = $_POST['title'];
                $data["belong"] = $_POST['belong'];
                $data["pid"] = $_POST['pid'];
                $data["content"] = $_POST['content'];
                $data["add_date"] = date("Y-m-d H:i:s");
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
        $Dao = D("handbook");
        $ID_Dele = implode(",", $_POST['id']);
        if ($Dao->delete($ID_Dele)) {
            $this->success("删除成功！");
        } else {
            $this->error('删除失败！');
        }
    }
    public function edit() {
        $Dao  = M("handbook");
        $id = (int) $_GET['id'];
        $list = $Dao ->where("id=$id")->find();
        $this->assign("list", $list);
        $this->assign("title", '编辑');
        $this->display();
    }
    public function updata() {
        $Dao = M("handbook");
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
        $Dao = M("handbook");  // 查询数据
        $list = $Dao->where('id = '. $_GET[id])->find();
        $this->assign("list", $list);
        $this->display();
    }
}
?>