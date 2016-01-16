<?php		
class PluginAction extends PublicAction {
    public function index() {
        header("Content-Type:text/html; charset=utf-8");				
        $this->pubHtml();
        $this->display();
    }
}
?>
