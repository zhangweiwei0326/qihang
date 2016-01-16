<?php 
    $db_config["hostname"] = "lihuazhai.mysql.rds.aliyuncs.com"; //服务器地址
    //$db_config["hostname"] = "localhost"; //服务器地址
    $db_config["database"] = "lihuazh3_manage"; //数据库名称
    $db_config["username"] = "lihuazh3_manage"; //数据库用户名
    $db_config["password"] = "lihuazhai_2014"; //数据库密码
    $db_config["charset"] = "utf8";//数据库编码
    $db_config["pconnect"] = 1;//开启持久连接
    $db_config["log"] = 1;//开启日志
    $db_config["logfilepath"] = './';//开启日志


     $con = mysql_connect($db_config["hostname"],$db_config["username"],$db_config["password"]);

 //    mysql_select_db($db_config["database"],$con);

  if (!$con){
    die('Could not connect: ' . mysql_error());
   }else{
     echo 'ok';
   }

phpinfo();







?>