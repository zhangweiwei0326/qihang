<?php
class HandbookAction extends PublicAction {
    public function index() {
        header("Content-Type:text/html; charset=utf-8");		
		$Dao  = M("handbook");
		$handbook = $Dao ->select();		
		$this->assign("handbook", $handbook);					
        $this->pubHtml();			
        $this->display();
    }
	
	public function getContent(){
		header("Content-Type:text/html; charset=utf-8");		
		$Dao  = M("handbook");
		$id = $_POST['id'];
		$handbook = $Dao -> where('id='.$id)->find();
		
		//$tpl_json = json_encode($handbook);//转json数据
		echo $handbook['content'];  	
		
	}	
	
	
	
}
?>