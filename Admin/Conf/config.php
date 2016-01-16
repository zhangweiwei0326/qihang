<?php
$arr1=array(
	'RBAC_SUPERADMIN'   => 'admin',         //超级管理员名称
	'ADMIN_AUTH_KEY'    => 'SUPERADMIN',    //超级管理员识别
	'USER_AUTH_ON'      => true,            //是否开启验证
	'USER_AUTH_TYPE'    =>  1,		        //默认认证类型 1 登录认证 2 实时认证
	'USER_AUTH_KEY'     =>  'uid',	    //用户认证SESSION标记
	'NOT_AUTH_MODULE'   =>  'Public,Index',	 //默认无需认证模块
	'NOT_AUTH_ACTION'   =>  'logout,node',	 //默认无需认证操作
	'RBAC_ROLE_TABLE'   =>  'my_role',      //角色表名称
	'RBAC_USER_TABLE'   =>  'my_role_user', //角色与用户的中间表名称
	'RBAC_ACCESS_TABLE' =>  'my_access',    //权限表名称
	'RBAC_NODE_TABLE'   =>  'my_node',      //节点表名称
	
		
	//后台
	'URL_MODEL'=>0,   //普通模式  get方式

	//'LAYOUT_ON'=>true,
    //'LAYOUT_NAME'=>'layout',


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
	
	/*
	'USER_AUTH_MODEL'           =>  'User',	// 默认验证数据表模型
	'AUTH_PWD_ENCODER'          =>  'md5',	// 用户认证密码加密方式
	'USER_AUTH_GATEWAY'         =>  '/Public/login',// 默认认证网关	
	'REQUIRE_AUTH_MODULE'       =>  '',		// 默认需要认证模块	
	'REQUIRE_AUTH_ACTION'       =>  '',		// 默认需要认证操作
	'GUEST_AUTH_ON'             =>  false,    // 是否开启游客授权访问
	'GUEST_AUTH_ID'             =>  0,        // 游客的用户ID
 */
	
	//'APP_GROUP_LIST' => 'home,admin', //项目分组设定
 	//'DEFAULT_GROUP'  => 'home', //默认分组			
);
$arr2=include 'config.inc.php';
return array_merge($arr1,$arr2);
?>