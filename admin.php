<?php
define('THINK_PATH','./ThinkPHP/');
define('APP_PATH','./Admin/');
define('APP_NAME','Admin');
define('STRIP_RUNTIME_SPACE',false);
//这样的话，确实能够在开发过当中，让其不缓存相关的加载项
define('NO_CACHE_RUNTIME',true);
require THINK_PATH.'ThinkPHP.php';
//App::run();
?>