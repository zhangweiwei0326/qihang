<?php
$arr1=array(	
	//前台
'URL_MODEL'=>0,   //普通模式  get方式
//'APP_GROUP_LIST' => 'home,admin', //项目分组设定
//'DEFAULT_GROUP'  => 'home', //默认分组	

'TMPL_ENGINE_TYPE'=>'Smarty',
'TMPL_ENGINE_CONFIG'=>array(    
	'caching'=>false,    
	'template_dir'=>TMPL_PATH,    
	'compile_dir'=>CACHE_PATH,    
	'cache_dir'=>TEMP_PATH,
	'left_delimiter' => '<{',
	'right_delimiter' => '}>'
),


//默认错误跳转对应的模板文件
 'TMPL_ACTION_ERROR' => TMPL_PATH . 'dispatch_jump.tpl',
 //默认成功跳转对应的模板文件
 'TMPL_ACTION_SUCCESS' => TMPL_PATH . 'dispatch_jump.tpl'
	
);
$arr2 = include 'config.inc.php';
return array_merge($arr1,$arr2);
?>	