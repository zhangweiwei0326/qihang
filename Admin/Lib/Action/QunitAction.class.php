<?php
class QunitAction extends CommonAction {
	public function index() {
		header("Content-Type:text/html; charset=utf-8");		
		$this->display();
	}
	
}
?>