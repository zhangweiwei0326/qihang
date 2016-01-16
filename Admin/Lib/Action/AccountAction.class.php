<?php
class AccountAction extends CommonAction {
	public function index() {
		header("Content-Type:text/html; charset=utf-8");
		$DaoWeb = M("account");
		//$listWeb = $DaoWeb -> select();
		$listWeb = $DaoWeb -> table('my_account account,my_website website') -> where('account.website = website.id') -> field('account.id as id,account.name,account.username,account.password,account.add_date,website.id as website,website.name as webname') -> order('account.add_date desc') -> select();
		$listWebOther = $DaoWeb -> where('website = 0') -> select();
		$merge = array_merge($listWeb, $listWebOther); //合并数组
		$this -> assign("result", $merge);
		$this -> showWebSite();
		$this -> display();
	}
	public function add() {
		$Dao = M("account");
		$data["name"] = $_POST['name'];
		$data["website"] = $_POST['website'];
		$data["username"] = $_POST['username'];
		$data["password"] = $_POST['password'];
		$data["add_date"] = date("Y-m-d H:i:s");
		// 写入数据
		if ($lastInsId = $Dao -> add($data)) {
			$status = 0;
			$msg = "添加成功！";
		} else {
			$status = 1;
			$msg = "添加失败！";
		}
		$array = array("status" => $status, "msg" => $msg);
		$jsonencode = json_encode($array);
		echo $jsonencode;
	}
	public function update() {
		$Dao = M("account");
		if ($Dao -> create()) {
			if ($lastID = $Dao -> save()) {
				$status = 0;
				$msg = "添加成功！";
			} else {
				$status = 1;
				$msg = "添加失败！";
			}
		} else {
			$status = 1;
			$msg = "添加失败！";
		}
		$array = array("status" => $status, "msg" => $msg);
		$jsonencode = json_encode($array);
		echo $jsonencode;
	}
	/**
	 * 显示网站信息
	 * */
	public function showWebSite() {
		$DaoWeb = M("website");
		$weblist = $DaoWeb -> select();
		$this -> assign("weblist", $weblist);
	}
}
?>
