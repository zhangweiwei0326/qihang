<?php	
Vendor("PHPMailer.class#phpmailer"); //包函邮件发送类
	
class MovieAction extends PublicAction {
    public function index() {
        header("Content-Type:text/html; charset=utf-8");
		import("ORG.Util.Page");       //导入分页类
		
        if($_GET[id] == "" || $_GET[id] == null){
            $Dao = M("movie");
			$count = $Dao->where('is_show = 1')->count();//计算总数
			$p = new Page($count,10); 
            $list = $Dao->table('my_movie movie,my_category category')
                    ->where('movie.cate_id = category.id and movie.is_show = 1')
                    ->field('movie.id as id,movie.title,movie.summary,movie.content,movie.add_date,movie.click_count,category.name as typeName')
					->limit($p->firstRow.','.$p->listRows)
					->order('movie.add_date desc')
                    ->select();
        }else{
            $Dao = M("movie"); 
			$count = $Dao->count(); //计算总数
			$p = new Page($count,5); 
			//$cate_id = (int)($_GET[id]);//string 转换为Int
            $list = $Dao->Table('my_movie movie,my_category category')
                    ->where('movie.cate_id = category.id and category.id =' . $_GET[id] .' and movie.is_show = 1')
                    ->field('movie.id as id,movie.title,movie.summary,movie.content,movie.add_date,movie.click_count,category.name as typeName')
					->limit($p->firstRow.','.$p->listRows)
					->order('movie.add_date desc')
                    ->select();	
        }		
		$page = $p->show();
        $this->assign("list", $list);
		$this->assign ("page", $page);
		
        $this->pubHtml();
        $this->tagList();
        $this->cateShow();
		$this->showNewtComment();
		$User = A("Index"); // 实例化UserAction控制器对象
        $hotList = $User->hotShow(); // 调用User模块的importUser操作方法
		$newList = $User->newShow(); // 调用User模块的importUser操作方法
		$this->assign("hotList", $hotList);
		$this->assign("newList", $newList);
		$time = time();	//时间戳	
		$this->assign ("time", $time);
        $this->display();
    }
    public function cateShow() {
        header("Content-Type:text/html; charset=utf-8");
        $Dao = M("category");  
        $list = $Dao->where('type = "movie" and is_show = 1')
					->select();
        $this->assign("category", $list);
    }
		
	
    public function showDetail() {
        header("Content-Type:text/html; charset=utf-8");		
		$Dao = M("movie"); 
		$list = $Dao->where('id = ' . $_GET[id])->find();
        $sql = "update my_movie set click_count = click_count + 1 where id = '$_GET[id]';";
        $result = M()->execute($sql); //增加点击量			
        if ($result !== false) {
            $Dao = M("movie");  
            $list = $Dao->table('my_movie movie,my_category category')
			->where('movie.cate_id = category.id and movie.id = '. $_GET[id])
			->field('movie.id as id,movie.title,movie.summary,movie.content,movie.add_date,movie.click_count,category.name as typeName')
            ->find();
            $this->assign("list", $list);
            $listPrev = $Dao->where('id < ' . $_GET[id])->order('id desc')->limit('1')->find();
            $this->assign("listPrev", $listPrev);
            $listNext = $Dao->where('id > ' . $_GET[id])->order('id asc')->limit('1')->find();
            $this->assign("listNext", $listNext);
        } else {
            echo '数据更新失败！';
        }
        $this->pubHtml();
        $this->cateShow();
        $this->showComment($_GET[id],'movie');
		$User = A("Index"); // 实例化UserAction控制器对象
        $hotlist = $User->hotShow(); // 调用User模块的importUser操作方法
		$this->assign("hotlist", $hotlist);
        $this->display();
    }	
  
	
	//显示最近评论列表
	public function showNewtComment($id) {
        header("Content-Type:text/html; charset=utf-8");		
        $Dao = M("comments");
        $list = $Dao->limit('2')->select();
        $this->assign("newComment", $list);
    }
    public function ding(){
        $model = M("comments");
        $sql = "update __TABLE__ set ding = ding + 1 where id = '$_POST[id]';";
        $result = $model->query($sql); //增加顶数字	
        $newDing = $model->getFieldById($_POST[id],'ding');	//针对某个字段查询并返回某个字段的值
        if($result !== false) {
		   $com['flag'] = 0; 
		   $com['ding'] = $newDing; 
		}else{
		   $com['flag'] = 1;
		}
		echo json_encode($com); 
    }
    public function cai(){
        $model = M("comments");
        $sql = "update __TABLE__ set cai = cai + 1 where id = '$_POST[id]';";
        $result = $model->query($sql); //增加踩数字	
        $newCai = $model->getFieldById($_POST[id],'cai');	//针对某个字段查询并返回某个字段的值
        if($result !== false) {
		   $com['flag'] = 0; 
   		   $com['cai'] = $newCai; 
		}else{
		   $com['flag'] = 1;
		}
		echo json_encode($com); 
    }
	
	public function toSearch(){
		header("Content-Type:text/html; charset=utf-8");
		import("ORG.Util.Page");       //导入分页类
		
		$Dao = M("movie");
		$count = $Dao->count(); //计算总数
		$p = new Page($count,5); 
        $list = $Dao->Table('my_movie movie,my_category category')
                    ->where('movie.cate_id = category.id and movie.title like  "%'.$_POST['keyName'].'%" and movie.is_show = 1')
                    ->field('movie.id as id,movie.title,movie.summary,movie.content,movie.add_date,movie.click_count,category.name as typeName')
					->limit($p->firstRow.','.$p->listRows)
					->order('movie.add_date desc')
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
	
}
?>
