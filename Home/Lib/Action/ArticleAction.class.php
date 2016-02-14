<?php	
Vendor("PHPMailer.class#phpmailer"); //包函邮件发送类
	
class ArticleAction extends PublicAction {
    public function index() {
        header("Content-Type:text/html; charset=utf-8");
		import("ORG.Util.Page");       //导入分页类


        //防止攻击
        $id = intval($_GET["id"]);
		
        if($id == "" || $id == null){
            $Dao = M("article");
			$count = $Dao->where('ifShow = 1')->count();//计算总数
			$p = new Page($count,10); 
            $list = $Dao->table('my_article article,my_category category')
                    ->where('article.cateId = category.id and article.ifShow = 1')
                    ->field('article.id as id,article.title,article.summary,article.is_original,article.content,article.add_date,article.click_count,category.name as typeName')
					->limit($p->firstRow.','.$p->listRows)
					->order('article.add_date desc')
                    ->select();
        }else{
            $Dao = M("article"); 
			$count = $Dao->Table('my_article article,my_category category')
                    ->where('article.cateId = category.id and category.id =' . $id .' and article.ifShow = 1')
                    ->count(); //计算总数
			$p = new Page($count,10); 
			//$cateId = (int)($id);//string 转换为Int
            $list = $Dao->Table('my_article article,my_category category')
                    ->where('article.cateId = category.id and category.id =' . $id .' and article.ifShow = 1')
                    ->field('article.id as id,article.title,article.summary,article.is_original,article.content,article.add_date,article.click_count,category.name as typeName')
					->limit($p->firstRow.','.$p->listRows)
					->order('article.add_date desc')
                    ->select();	
        }		
		$page = $p->show();

		//dump($list);
        $this->assign("list", $list);
		$this->assign ("page", $page);
		
        $this->pubHtml();
        $this->tagList();
        $this->cateShow();
        $this->commentAll();
		$this->showNewComment();
		$User = A("Index"); // 实例化UserAction控制器对象
        $hotList = $User->hotShow(); // 调用User模块的importUser操作方法
		$newList = $User->newShow(); // 调用User模块的importUser操作方法
		$this->assign("hotList", $hotList);
		$this->assign("newList", $newList);
		$time = time();	//时间戳	
		$this->assign ("time", $time);
        //$this->display();
        $this->template('article','index');
    }
    public function cateShow() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("category");  
        $list = $Dao->where('type = "acticle" and is_show = 1')
					->select();
        $this->assign("category", $list);
    }
		
	
    public function detail() {
        header("Content-Type:text/html; charset=utf-8");		
		$Dao = M("article"); 
        //防止攻击
        $id = intval($_GET["id"]);
		$list = $Dao->where('id = ' . $id)->field('expense_credit')->find();
		$expense_credit = $list['expense_credit'];
		/*
		if($expense_credit > 0){
			if(!isset($_SESSION['uid'])){
				echo '本文章需要登录后再查看！';
				return;
			}else{				
				$userCredit = $this->getUserCredit($_SESSION['uid']);				
				if($userCredit > $expense_credit){
					$this->changeCredit($_SESSION['uid'],$expense_credit,'subtract');					
				}else{
					echo '你的积分不足哦！';
					return;					
				}				
			}
		}else{
			$this->changeCredit($_SESSION['uid'],1);
		}						
		*/
        $sql = "update my_article set click_count = click_count + 1 where id = '$id';";
        $result = M()->execute($sql); //增加点击量			
        if ($result !== false) {
            $Dao = M("article");  
            $list = $Dao->table('my_article article,my_category category')
			->where('article.cateId = category.id and article.id = '. $id)
			->field('article.id as id,article.title,article.summary,article.is_original,article.content,article.add_date,article.click_count,category.name as typeName')
            ->find();
            $this->assign("list", $list);
            $listPrev = $Dao->where('id < ' . $id)->order('id desc')->limit('1')->find();
            $this->assign("listPrev", $listPrev);
            $listNext = $Dao->where('id > ' . $id)->order('id asc')->limit('1')->find();
            $this->assign("listNext", $listNext);
        } else {
            echo '数据更新失败！';
        }

        function getRelationIdList($id){
            $Dao = M("article_relation");
            $relation_id_list = $Dao->where('id_list like "%'.$id.'%"')->select();
            return $relation_id_list;
        }
        $relation_id_list = getRelationIdList($id);

        function getRelationArticle($idList){
            $Dao = M("article");
            $relation_list = $Dao->where('id in('.$idList.')')->field('id,title')->select();
            return $relation_list;
        }
        //屏蔽文章自身id
        function deleteSelfId($id,$str){
          $strTemp  = preg_replace('/'.$id.'(,|$)/','',$str);
          return  preg_replace('/(,)$/','',$strTemp);
        }
        if(isset($relation_id_list[0]["id_list"])){
            $relationIds = deleteSelfId($id,$relation_id_list[0]["id_list"]);
            $relationArticle = getRelationArticle($relationIds);
            $this->assign("relationArticle", $relationArticle);
        }

        $this->pubHtml();
        $this->cateShow();
        $this->newShow();
		$this->hotShow();
		$this->showNewComment();
		$this->commentAll();
        $this->showComment($id,'article');
        $this->template('article','detail');
       // $this->display('detail');
    }	
  
	
	//显示最近评论列表
	public function showNewComment($id) {
        header("Content-Type:text/html; charset=utf-8");		
        $Dao = M("comments");
        $list = $Dao->limit('2')->select();
        $this->assign("newComment", $list);
    }

    //显示最新需求
	public function commentAll() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("requirement");  
        $commentAll = $Dao->order('add_date desc')->limit('6')->select();
        $this->assign("commentAll", $commentAll);
		return $commentAll;
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
	//生成验证码
    Public function verify(){
	    import('ORG.Util.Image');
	    Image::buildImageVerify();
	}

    //支持移动端拖拉载入下一页
	Public function getArticleList(){
        $from = $_GET["from"];
        $pageCount = $_GET["pageCount"];
        $Dao = M("article");
        $list = $Dao->table('my_article article,my_category category')
                ->where('article.cateId = category.id and article.ifShow = 1')
                ->field('article.id as id,article.title,article.summary,article.is_original,article.add_date,article.click_count,category.name as typeName')
                ->limit($from, $pageCount)
                ->order('article.add_date desc')
                ->select();
        //print_r($list);
        $data_json = json_encode($list);//转json数据
        echo $data_json;
	}

}
?>
