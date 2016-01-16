<?php
// header("content-type:application/json; charset:utf-8");
 //date_default_timezone_set("Asia/Shanghai");
 date_default_timezone_set('PRC'); 

  $con = @ mysql_connect("localhost", "lihuazh2_yizhan", "xyang2012hz") or die("数据库链接错误");
  mysql_select_db("lihuazh2_yizhan", $con);
  mysql_query("set names 'utf8'");

  $title = $_POST['title'];
  $summary = $_POST['summary'];
  $content = $_POST['content'];
  $add_date = date("Y-m-d H:i:s");
  $ifShow = $_POST['ifShow'];

  $sql = "INSERT INTO `my_article` VALUES ('',2,2,'$title',0,'$summary','$content',0,'$add_date',100,'$ifShow')";

  if(!mysql_query($sql,$con)){
    echo "failure!";
  	die('Error: ' . mysql_error());
  }
  echo "insert succeed!";


?>