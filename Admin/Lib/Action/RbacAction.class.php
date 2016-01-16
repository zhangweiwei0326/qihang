<?php
class RbacAction extends CommonAction {
    //用户列表
	public function index(){
		header("Content-Type:text/html; charset=utf-8");
		$list = D('UserRelation')->field('password',true)->relation(true)->select();
		//print_r($list);
        $this->assign("list", $list);
        $this->display();				
	}
	//角色列表
	public function role(){	
		$role = M('role')->select();	
		$this->assign("role", $role);
		$this->display();	
	}
    //节点列表
	public function node(){	
		$field = array('id','name','title','pid');
		$node = M('node')->field($field)->order('sort')->select();			
		$node = $this->node_merge($node);		
		//dump($node);		
		$this->assign("node", $node);
		$this->display();	
	}
	//添加用户页面展示
	public function addUser() {
		$this->role = M('role')->select();				
        $this->display();
    }

	//添加用户表单处理
	public function addUserHandle(){
	 if (!empty($_POST['email']) && !empty($_POST['password'])) {
	 	
    		if($_POST['password'] != $_POST['password2']){
				$this->error('密码不一致！');
				return false;
        	}

			$Dao = M("user");
			$data["email"] = $_POST['email'];
			$random = substr(uniqid(rand()), -6);
			$data["password"] = md5(md5($_POST['password']).$random);
			$data["register_date"] = date("Y-m-d H:i:s");
			// 写入数据
			if ($lastId = $Dao->add($data)) {
				$role = array();
				foreach ($_POST['role_id'] as $v){									
					$role[] = array(
					 'role_id' => $v,
					 'user_id' => $lastId
					);
				}
				//添加用户角色
				if(M('role_user')->addAll($role)){
					$this->success('添加成功',U('Admin/Rbac/index'));			
				}else{
					$this->error('加角色错误!');
				}	
			} else {
				$this->error('数据写入错误！');
			}
		}
	}

	//修改用户
	public function edit() {
		$user = M("user");
		$id = (int) $_GET['id'];
		$list = $user->where("id=$id")->find();
		$this->assign("list", $list);		
		$this->assign("title", '编辑');
		$this->display();
	}
	
	//确认修改用户
	public function update() {
		$Dao = M("user");
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
	//删除用户
	public function del() {
		 $id  = $_GET['id'];
		 $Dao = M("user");
		 $result = $Dao->where('id = '.$id)->delete();
		 if($result !== false){
		 	$this->assign("jumpUrl", "__URL__/index/");
		 	$this->success('删除成功！');
		 }else{
		 	$this->success('删除数据失败！');
		 }
	}
	
	//添加角色
	public function addRole(){
		$this->display();			
	}
	//添加角色表单处理
	public function addRoleHandle(){
		if(M('role')->add($_POST)){
			$this->success('添加成功!',U('Admin/Rbac/role'));	
		}else{
			$this->error('添加失败!');
		}			
	}
	//添加节点
	public function addNode(){
		$this->pid = isset($_GET['pid']) ? $_GET['pid']: 0;
		$this->level = isset($_GET['level']) ? $_GET['level']: 1;
		
		switch($this->level){
			case 1:
			 $this->type = '应用';
			 break;
			case 2:
			 $this->type = '控制器';
			 break;
			case 3:
			 $this->type = '动作方法';
			 break;						
		}	
	   	$this->display();
	}
	//添加节点表单处理
	public function addNodeHandle(){
		if(M('node')->add($_POST)){
			$this->success('添加成功!',U('Admin/Rbac/node'));	
		}else{
			$this->error('添加失败!');
		}			
	}
	//配置权限
	public function access(){
		$rid = isset($_GET['rid']) ? $_GET['rid']: 0;
		$field = array('id','name','title','pid');
		$node = M('node')->order('sort')->field($field)->select();		
		//原有权限
		$access = M('access')->where(array('role_id'=>$rid))->getField('node_id',true);						
		$node = $this->node_merge($node,$access);				
		$this->assign("rid", $rid);			
		$this->assign("node", $node);
		$this->display();								
	}
	//修改权限
	public function setAccess(){
		$rid = isset($_POST['rid']) ? $_POST['rid']: 0;
		$db = M('access');
		//清空原权限
		$db->where(array('role_id' => $rid))->delete();
		$data = array();
		foreach($_POST['access'] as $v){
			$tep = explode('_',$v);
			$data[] = array(
				'role_id' => $rid,
				'node_id' => $tep[0],
				'level' => $tep[1]
			);					
		}
		if($db->addAll($data)){
			$this->success('修改成功',U('Admin/Rbac/role'));			
		}else{
			$this->error('修改失败!');
		}							
	}
	
	
	//递归公用方法
	public function node_merge($node,$access = null,$pid = 0){
		$arr =  array();
		foreach($node as $v){
			if(is_array($access)){
				$v['access'] = in_array($v['id'],$access) ? 1 : 0;
			}
			if($v['pid'] == $pid){
				$v['child'] = $this->node_merge($node,$access,$v['id']);
				$arr[] = $v;
			}
		}
		return $arr;
	}
	
}
?>