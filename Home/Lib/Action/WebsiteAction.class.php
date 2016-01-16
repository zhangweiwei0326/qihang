<?php
class WebsiteAction extends PublicAction {
    public function index() {
        header("Content-Type:text/html; charset=utf-8");		
		$DaoCate  = M("category");
		$listCate = $DaoCate ->where('type = "website"')->select();		
		
		$DaoWeb = M("website");  		
		$result = array();
		foreach ($listCate as $value) { 
			$condition['cate_id'] = $value[id];
			$condition['is_public'] = 1;
			$listWeb = $DaoWeb->where($condition)->select();
			$value['web'] = $listWeb;
			$result[] = $value;
		} 
		$this->assign("result", $result);					
        $this->pubHtml();			
        $this->display();
    }
}
?>