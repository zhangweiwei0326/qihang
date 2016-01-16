<?php
//引入操作类
require './Home/Lib/Behavior/CreateBehavior.class.php';
class CreateHtmlAction extends PublicAction {
	public function index() {
		header("Content-Type:text/html; charset=utf-8");
		$this -> getHtmlShow();
		$this -> getCssShow();
		$this -> display();
	}
	public function getHtmlShow() {
		$html = new CreateBehavor;
		$htmlList = $html -> get_files('./createHtml/html/');
		$this -> assign("htmlList", $htmlList);
	}
	public function getCssShow() {
		$html = new CreateBehavor;
		$cssList = $html -> get_files('./createHtml/css/');
		$this -> assign("cssList", $cssList);
	}
	public function getFileShow() {
		$html = new CreateBehavor;
		$htmlList = $html -> getFileContent($_POST['filePath']);
		echo $htmlList;
	}
	public function saveFile() {
		$filePath = $_POST['filePath'];
		$content  = $_POST['content'];
		$html = new CreateBehavor;
		echo $html -> createFile($filePath,$content);
	}
	public function buildCss() {
		$reqArr = $_POST['fileArr'];
		var_dump($_POST['reqArr']);
		$html = new CreateBehavor;
		echo $html -> buildCss('./createHtml/output/css/index.css',$reqArr);
	}
	public function createHtml() {
		$reqArr = $_POST['fileObj'];
		//var_dump($_POST['reqArr']);
		$html = new CreateBehavor;
		echo $html -> createHtml('./createHtml/html/layout.html','./createHtml/output/index.html',$reqArr);
	}
	public function showDemo() {
		$this -> display('./createHtml/output/index.html');
	}
}
?>