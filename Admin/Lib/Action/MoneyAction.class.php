<?php
class MoneyAction extends CommonAction {

    public function index() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("money");
        $list = $Dao->select();	
		$balance = $this->balance();
        $this->assign("list", $list);
		$this->assign("balance", $balance);
        $this->display();
    }
	
	public function balance(){//算出余额
	  	$Dao = M("money");
        $list = $Dao->select();	
		$balance = 0;
		foreach ($list as $item) { 
			if($item[is_income] == "0"){
				$balance -= $item['actual_expense'];
			}else{
				$balance += $item['actual_expense'];
			}
		} 	
		return $balance;
	}

    public function add() {
		$type = ($_GET['type']);
		$this->assign("type", $type);
        $this->display('add');
        if (isset($_POST['add'])) {
            if (!empty($_POST['name'])) {
				$Dao = M("money");
				if($_POST['type'] == 'plan'){					
					$data["name"] = $_POST['name'];
					$data["category"] = $_POST['category']; 
					$data["is_income"] = $_POST['is_income'];
					$data["plan_expense"] = $_POST['plan_expense'];
					$data["plan_user_date"] = $_POST['plan_user_date'];
					$data["add_date"] = date("Y-m-d H:i:s");
					// 写入数据
					if ($lastInsId = $Dao->add($data)) {
						//echo "插入数据 id 为：$lastInsId";
						$this->assign("jumpUrl", "__URL__/index/");
						$this->success("添加成功！");
					} else {
						$this->error('数据写入错误！');
					}
				}else{
					$data["name"] = $_POST['name'];
					$data["category"] = $_POST['category']; 
					$data["is_income"] = $_POST['is_income'];
					$data["actual_expense"] = $_POST['actual_expense'];
					$data["actual_use_date"] = $_POST['actual_use_date'];
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
    }
	
	public function addMore() {
        $this->display('addMore');
        if (isset($_POST['add'])) {
            if (!empty($_POST['name'])) {
				$Dao = M("money");
				if($_POST['type'] == 'plan'){					
					$data["name"] = $_POST['name'];
					$data["category"] = $_POST['category']; 
					$data["is_income"] = $_POST['is_income'];
					$data["plan_expense"] = $_POST['plan_expense'];
					$data["plan_user_date"] = $_POST['plan_user_date'];
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
    }


    public function del() {
        $Dao = D("money");
        $ID_Dele = implode(",", $_POST['id']);

        if ($Dao->delete($ID_Dele)) {
            $this->success("删除成功！");
        } else {
            $this->error('删除失败！');
        }
    }

    public function edit() {
        $Dao  = M("money");
        $id = (int) $_GET['id'];
        $list = $Dao ->where("id=$id")->find();
        $this->assign("list", $list);
        $this->assign("title", '编辑');
        $this->display();
    }

    public function updata() {
        $Dao = M("money");
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
        $Dao = M("money");  // 查询数据
        $list = $Dao->where('id = '. $_GET[id])->find();
        $this->assign("list", $list);
        $this->display();
    }

}





