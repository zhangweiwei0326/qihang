<?php
define('THINK_PATH','./ThinkPHP/');
define('APP_NAME','Home');
//APP_PATH,应用路径（项目路径）  前台应用和后台应用。
define('APP_PATH','./Home/');
define('STRIP_RUNTIME_SPACE',false);
//这样的话，确实能够在开发过当中，让其不缓存相关的加载项
define('NO_CACHE_RUNTIME',true);
 //开启调试模式
 define('APP_DEBUG', true);
require THINK_PATH.'ThinkPHP.php';
//App::run();
?>