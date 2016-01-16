<?php
// 装修文章
class FitmentAction extends CommonAction {
	public function index() {
		header("Content-Type:text/html; charset=utf-8");
		import("ORG.Util.Page");       //导入分页类
		if ($_GET[id] == "" || $_GET[id] == null) {
			$Dao = M("fitment");
			$count = $Dao->count();    //计算总数
			$p = new Page($count,10);  
			$list = $Dao->table('my_fitment fitment,my_category category')
				->where('fitment.cate_id = category.id')
				->field('fitment.id as id,fitment.title,fitment.summary,fitment.content,fitment.add_date,
				fitment.click_count,fitment.ifShow,category.name as typeName')
				->limit($p->firstRow.','.$p->listRows)
				->order('fitment.add_date desc')
				->select();
		} else {
			$Dao = M("fitment");  
			$count = $Dao->count();    //计算总数
			$p = new Page($count,5);  
			$list = $Dao->table('my_fitment fitment,my_category category')
			->where('fitment.cateId = category.id and category.id = ' . $_GET[id])
			->field('fitment.id as id,fitment.title,fitment.summary,fitment.is_original,fitment.content,fitment.add_date,
			fitment.click_count,fitment.ifShow,category.name as typeName')
			//->order('blog.id desc' )
			->limit($p->firstRow.','.$p->listRows)
			->order('fitment.add_date desc')
			->select();
		}
		$page = $p->show();
		
		$this->assign("list", $list);
		$this->assign ("page", $page);
		
		$this->categoryList();
		$this->display();
	}
	//新增tag
	public function tagAdd() {
		if (!empty($_POST['name'])) {
			$Dao = M("category");
			$data["name"] = $_POST['name'];
			$data["type"] = 'tag';
			if ($lastInsId = $Dao->add($data)) {
				//echo "插入数据 id 为：$lastInsId";
				$this->assign("jumpUrl", "__URL__/index/");
				$this->success("登录成功！");
			} else {
				$this->error('数据写入错误！');
			}
		}
	}
    //显示tag列表
	public function tagList() {
		$Dao = M("category"); 
		$list = $Dao->where('type = "tag"')->select();
		$this->assign("taglist", $list);
	}
	public function categoryList() {
		$Dao = M("category"); 
		$list = $Dao->where('type = "fitment"')->select();
		$this->assign("category", $list);
	}
	public function categoryAdd() {
		if (isset($_POST['add'])) {
			if (!empty($_POST['name'])) {
				$Dao = M("category");
				$data["name"] = $_POST['name'];
				$data["type"] = 'fitment';
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
	 
	public function cateDel() {
		$id  = $_GET['id'];
		$Dao = M("category");
		$result = $Dao->where('id = '.$id)->delete();
		if($result !== false){
			$this->assign("jumpUrl", "__URL__/index/");
			$this->success('删除成功！');
		}else{
			$this->success('删除数据失败！');
		}
	}
	 
	public function changeCate() {
		$ID_Dele = implode(",", $_POST['ids']);
		$cateId = $_POST['cateId'];
		$Dao = M("article");
		$sql = 'UPDATE my_article SET cateId = '.$cateId.' WHERE id in ('.$ID_Dele.') ;';
		$result = $Dao->execute($sql);
		if($result !== false){
		 $this->assign("jumpUrl", "__URL__/index/");
		 $this->success('数据更新成功！');
		}else{
			echo '数据更新失败！';
		}
	}
	
    //新增文章
	public function add() {
		$this->categoryList();
		$this->tagList();
		$this->display('add');
		if (isset($_POST['add'])) {
			if (!empty($_POST['title']) && !empty($_POST['content'])) {
				$Dao = M("fitment");
				$data["title"] = $_POST['title'];
				$data["cate_id"] = $_POST['category'];
				$data["summary"] = $_POST['summary'];
				$data["content"] = $_POST['content'];
				$data["ifShow"] = $_POST['ifShow']; 
				$data["add_date"] = date("Y-m-d H:i:s");
				if(!is_numeric($_POST['tag'])){
					$DaoTag = M("category");
					$dataTag["name"] = $_POST['tag'];
					$dataTag["type"] = 'tag';
					if ($lastInsIdTag = $DaoTag->add($dataTag)) {
						$data["tag"] = $lastInsIdTag;
					} else {
						$this->error('数据写入错误');
					}
				}else{
					$data["tag"] = $_POST['tag'];
				}
				// 写入数据
				if ($lastInsId = $Dao->add($data)) {
					$this->assign("jumpUrl", "__URL__/index/");
					$this->success("添加成功！");
				} else {
					$this->error('数据写入错误！');
				}
			}
		}
	}
	public function del() {
		$Article = D("fitment");
		$ID_Dele = implode(",", $_POST['id']);
		if ($Article->delete($ID_Dele)) {
			$this->success("删除成功！");
		} else {
			$this->error('删除失败！');
		}
	}
	public function edit() {
		$this->categoryList();
		$this->tagList();
		$fitment = M("fitment");
		$id = (int) $_GET['id'];
		$list = $fitment->where("id=$id")->find();
		$this->assign("list", $list);		
		$this->assign("title", '编辑');
		$this->display();
	}
	public function update() {
		$fitment = M("fitment");
		if ($fitment->create()) {
			if ($lastID = $fitment->save()) {
				$this->assign("jumpUrl", "__URL__/index/");
				$this->success("更新成功！");
			} else {
				$this->error('更新失败！');
			}
		} else {
			$this->error($message);
		}
	}
	public function showDetail() {
		header("Content-Type:text/html; charset=utf-8");
		$Dao = M("fitment"); 
		$list = $Dao
		->table('my_fitment fitment,my_category category')
		->where('fitment.cate_id = category.id and fitment.id = ' . $_GET[id])
		->field('fitment.id as id,fitment.title,fitment.content,fitment.add_date,fitment.click_count,category.name as typeName')
		->find();
		
		$listPrev = $Dao->where('id < ' . $_GET[id])->order('id desc')->limit('1')->find();
        $this->assign("listPrev", $listPrev);
        $listNext = $Dao->where('id > ' . $_GET[id])->order('id ASC')->limit('1')->find();
        $this->assign("listNext", $listNext);
		
		$this->assign("list", $list);
		$this->display();
	}
    /**文章搜索未发布
    *ajax调用
    *不分页
    */
	public function unpublishSearch(){
		header("Content-Type:text/html; charset=utf-8");	
		$Dao = M("fitment");
        $list = $Dao->Table('my_fitment fitment,my_category category')
                    ->where('fitment.cateId = category.id and fitment.ifShow = 0')
                    ->field('fitment.id as id,fitment.title,fitment.summary,fitment.content,fitment.add_date,fitment.click_count,category.name as typeName')
					->order('fitment.add_date desc')
                    ->select();	
        //dump($list);
        $tpl_json = json_encode($list);//转json数据
        echo $tpl_json;
	}
	/**文章已标题来搜索
    *ajax调用
    *不分页
    */
	public function toSearch(){
		header("Content-Type:text/html; charset=utf-8");
		$Dao = M("fitment");
        $list = $Dao->Table('my_fitment fitment,my_category category')
                    ->where('fitment.cate_id = category.id and fitment.title like  "%'.$_POST['keyName'].'%" ')
                    ->field('fitment.id as id,fitment.title,fitment.summary,fitment.content,fitment.add_date,fitment.click_count,category.name as typeName')
					->order('fitment.add_date desc')
                    ->select();	
        //dump($list);
        $tpl_json = json_encode($list);//转json数据
        echo $tpl_json;
	}
}
?>
