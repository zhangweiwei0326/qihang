<?php
class TestModel extends Model{
	Public $selectOption;
	Public $filterData;
	Public $row;
	
	Public function indexd($list){    	
	 $result = array();  
	 foreach ($list as $item) {   
		$result[] = $item['title'];
     } 
   
	 return $result;   	
	}     
} 
?>