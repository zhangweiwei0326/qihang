<?php
Vendor("PHPMailer.class#phpmailer"); //包函邮件发送类
class IndexAction extends PublicAction {	
    public function index() {
        header("Content-Type:text/html; charset=utf-8");
		import("ORG.Util.Page");       //导入分页类

        $Dao = M("article");  
        //防止攻击
        $id = intval($_GET["id"]);
	    if($id == "" || $id == null){
			$count = $Dao->where('ifShow = 1')->count();    //计算总数
			$p = new Page($count,10); 
	        $list = $Dao->table('my_article article,my_category category')
	                ->where('article.cateId = category.id and article.ifShow = 1')
	                ->field('article.id as id,article.title,article.summary,article.is_original,article.content,article.add_date,article.click_count,category.name as typeName')
					->limit($p->firstRow.','.$p->listRows)
					->order('add_date desc')
	                ->select();
       }else{
		$count = $Dao->Table('my_article article,my_category category')
	        ->where('article.cateId = category.id and category.id =' . $id .' and article.ifShow = 1')
	        ->count(); //计算总数
		 $p = new Page($count,10); 
         $list = $Dao->table('my_article article,my_category category')
            ->where('article.cateId = category.id and category.id =' . $id .' and article.ifShow = 1')
            ->field('article.id as id,article.title,article.summary,article.is_original,article.content,article.add_date,article.click_count,category.name as typeName')
			->limit($p->firstRow.','.$p->listRows)
			->order('add_date desc')
            ->select();
       }
											
		$list_new = array();			
		foreach ($list as $key => $value) {					
			$timestamp = strtotime($value['add_date']);//转时间戳
			$date_time_array = getdate($timestamp);	//取得日期、时间信息。		
			$itemArr = $value;		
			$itemArr['add_date_format'] = $date_time_array;	
			$list_new[$key] = $itemArr;									
		}
		
		$p->setConfig('header','篇文章');								
		$page = $p->show();
	
        $this->assign("list", $list_new);
		$this->assign("page", $page);
        //$Public = A("Public"); // 实例化PublicrAction控制器对象
        //$Public->head(); // 调用Public模块的head操作方法
        //$Public->bottom(); // 调用Public模块的head操作方法
        $this->pubHtml();
        $this->tagList();
        $this->cateShow();
		$this->newShow();
		$this->hotShow();
		$this->commentAll();
		$this->movieNew();		
		$time = time();	//时间戳	
		$this->assign("time", $time);
		$this->template('index','index');
    }
    public function cateShow() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("category");  
        $list = $Dao->where('type = "acticle" and is_show = 1')
					->select();
        $this->assign("category", $list);
    }	
		


	public function commentAll() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("requirement");  
        $commentAll = $Dao->order('add_date desc')->limit('6')->select();
        $this->assign("commentAll", $commentAll);
		return $commentAll;
    }
	
	public function movieNew(){	
	header("Content-Type:text/html; charset=utf-8");
		$con = mysql_connect("localhost","lihuazh1_yizhan","xyang2012hz");
		if (!$con){
		  //die('Could not connect: ' . mysql_error());
		 }	
		 mysql_query("SET NAMES utf8"); 
		 mysql_select_db("lihuazh1_movie", $con); //选择数据库 
		$q = "SELECT * FROM `wp_posts` where `post_status` = 'publish' "; //SQL查询语句 		
		$result  = mysql_query($q, $con); //获取数据集
		$movieNewList = array();
		
		while($row = mysql_fetch_array($result)){
			$movieNewList[] = $row;
		}
		//dump($movieNewList);		
		$this->assign("movieNew", $movieNewList);		 				
	}

	public function toSearch(){
		header("Content-Type:text/html; charset=utf-8");
		import("ORG.Util.Page");       //导入分页类
		
		$Dao = M("article");
		$count = $Dao->count(); //计算总数
		$p = new Page($count,5); 
        $list = $Dao->Table('my_article article,my_category category')
                    ->where('article.cateId = category.id and article.title like  "%'.$_POST['keyName'].'%" and article.ifShow = 1')
                    ->field('article.id as id,article.title,article.summary,article.content,article.add_date,article.click_count,category.name as typeName')
					->limit($p->firstRow.','.$p->listRows)
					->order('article.add_date desc')
                    ->select();	
		$page = $p->show();
        $this->assign("list", $list);
		$this->assign ("page", $page);
		
        $this->pubHtml();
        $this->cateShow();
		$User = A("Index"); // 实例化UserAction控制器对象
        $hotList = $User->hotShow(); // 调用User模块的importUser操作方法
		$newList = $User->newShow(); // 调用User模块的importUser操作方法
		$this->assign("hotList", $hotList);
		$this->assign("newList", $newList);
		$time = time();	//时间戳	
		$this->assign ("time", $time);
		
		$this->display("index");
	}
}
?>