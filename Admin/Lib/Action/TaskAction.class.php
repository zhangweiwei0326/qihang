<?php
class TaskAction extends CommonAction {
	public function index() {
		header("Content-Type:text/html; charset=utf-8");
		$setting = $this->getSetting();		
		$this->assign("setting",$setting);
		$this->display();
	}
	
	public function getSetting(){
		$User = new TestModel();
		$Dao = M("task");
		//$list = $Dao->find();
		$Model = new Model(); // 实例化一个空模型
		$list = $Model->query("select * from information_schema.columns");	
		$setting = $User->indexd($list);
		return $setting;							
	}
	
	public function getDefine(){
		$Dao = M("report_define");		
		$condition['id'] = 1;				
		$list = $Dao->where($condition)->find();
		$filter = $list['filter'];					
		return $filter;								
	}
	public function showData() {
		header("Content-Type:text/html; charset=utf-8");		
		$json = $_POST['condition'];
		//$arr = json_decode($json); 		
		$Dao = M("task");	
		if(empty($json)){
			$list = $Dao->select();
		}else{
			foreach($json as $item) {
				$sign = $item['sign'];
				
				$str = $item['name'];
				$strArr = explode('_',$str);				
				$key = $strArr[0];
				
				$value = $item['value'];
				
				/*$strValue = $item['value'];
				$ArrValue = explode('_',$strValue);*/
				
				if($sign == "equal"){
					$condition[$key] = $value;
				}else if($sign == "notequal"){
					$condition[$key] != $value;
				}else{
				}				 
		 	}					
		 	$list = $Dao->where($condition)->select();
		 }	
	 
		$arr_attribute = array();
		$arr_data = array();
		foreach ($list as $value) {
		  if($value['status'] == "closed"){
			$arr_attribute[] = 
			  	array('attribute' => 
			    	array('tr_class'=>'closed','edit'=>true,
			     		'links'=>array('title'=>'showDetail/?id='.$value[id])
			    	)
			  	);				
		   }else{
			$arr_attribute[] = 
			  	array('attribute' => 
			   		 array('tr_class'=>'','edit'=>true,
			   		  'links'=>array('title'=>'showDetail/?id='.$value[id])
			   		 )
			  	 );					
		  }
		  $arr_data[] = array('data' => $value);
		}
		
		$arr_tdBody = array();		
		for ($i = 0; $i < count($arr_data); $i++) {
			$arr_tdBody[] = array_merge($arr_attribute[$i], $arr_data[$i]);
		}
		$arr_body = array('tdBody' => $arr_tdBody);
		//sleep(1);//让程序等待1秒，然后再返回数据
		$tpl_json = json_encode($arr_body);//转json数据
		 echo $tpl_json;
		//$this->display('index');
	}
	public function add_ajax() {
		if (!empty($_POST['title'])) {
			$Dao = M("task");
			$data["title"] = $_POST['title'];
			//$data["description"] = $_POST['description'];
			//$data["status"] = $_POST['status'];
			//$data["add_date"] = date("Y-m-d H:i:s");
			//$data["plan_start_date"] = $_POST['plan_start_date'];
			//$data["plan_end_date"] = $_POST['plan_end_date'];
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
	
	public function save_fliter(){ 
		$Dao = M("report_define");	
			
		$data["name"] = $_POST['name'];		
		$filterStr = json_encode($_POST['filter']);
		$data["filter"] = $filterStr;	
			
		if ($lastInsId = $Dao->add($data)) {// 写入数据;
			echo "true";			
		} else {
			echo "false";
		}		
	}
	public function projectList() {
		$Dao = M("project");
		$list = $Dao->select();
		$this->assign("projectList", $list);
	}
	public function add() {
		$this->projectList();
		$this->display('add');
		if (isset($_POST['add'])) {
			if (!empty($_POST['title'])) {
				$Dao = M("task");
				$data["title"] = $_POST['title'];
				$data["projectId"] = $_POST['projectId'];
				$data["priority"] = $_POST['priority'];
				$data["type"] = $_POST['type'];
				$data["status"] = $_POST['status'];
				$data["add_date"] = date("Y-m-d H:i:s"); 
				$data["plan_start_date"] = $_POST['plan_start_date'];
				$data["plan_end_date"] = $_POST['plan_end_date'];
				$data["description"] = $_POST['description'];
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
	public function update() {
		$arr_list = $_POST;		
		$id = $_POST['id'];			
		$Dao = M("task");
		foreach($arr_list as $key=>$value){
			if($key!="id"){
				if($key == "status"){
					if($value == "closed"){
						$data['percent'] = 100;
					}elseif($value == "ing"){
						$data['percent'] = 1;
					}else{
						$data['percent'] = 0;
					}					
				}
				$data[$key] = $value;
			}
		}		
		$condition['id'] = $id;
		$result = $Dao->where($condition)->save($data);
		if ($result !== false) {
		 echo 'true';
		} else {
		 echo 'false';
		}
	}
	public function close() {
		$getid = $_REQUEST['id'];  //获取ID
		$key = $_POST['key'];
		$val = $_POST['val'];
		if (!$getid)
		$this->error('未选择记录');
		$getids = explode(',', $getid);
		$arrId = is_array($getid) ? $getid : $getids;
		$Model = new Model();
		for ($i = 0; $i < count($arrId); $i++) {
			//$result = $Model->execute("UPDATE `my_task` SET "+ $key +" = '"+ $val +"' where `id` = $arrId[$i]");
			$result = $Model->execute("UPDATE `my_task` SET `status` = 'closed', `percent` = '100' where `id` = $arrId[$i]");
		}
		if ($result !== false) {
			echo '数据更新成功！';
		} else {
			echo '数据更新失败！';
		};
	}
	public function del() {
		$getid = $_REQUEST['id'];  //获取ID
		if (!$getid)
		$this->error('未选择记录');
		$getids = implode(',', $getid);
		$id = is_array($getid) ? $getids : $getid;
		if (is_integer($id)) {
			$Dao = M("task");
			$condition['id'] = $id;
			$result = $Dao->where($condition)->delete();
			if ($result !== false) {
				echo '删除 ', $result, ' 条数据。';
			} else {
				echo '删除数据失败！';
			}
		} else {
			$Model = new Model();
			$result = $Model->execute('DELETE FROM `my_task` where `id` IN (' . $id . ')');
			if ($result !== false) {
				echo '删除 ', $result, ' 条数据。';
			} else {
				echo '删除数据失败！';
			};
		}
	}
	public function showDetail() {
		$getid = $_REQUEST['id'];
		$Dao = M("task");
		$list = $Dao->where("id=".$getid)->find();
		$this->assign("list", $list);
		$this->display();
	}
	
	public function edit() {
		$projectDao = M("project");  // 查询数据
		$projectList = $projectDao->select();
		$this->assign("projectList", $projectList);
		
		$id = (int)$_GET['id'];
		$Dao = M("task");
		$list = $Dao->where("id=".$id)->find();
		//dump($list);
		$this->assign("list", $list);
		$this->display();
	}
	public function updateForm() {
		$Dao = M("task");
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