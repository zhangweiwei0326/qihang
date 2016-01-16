<?php
header("content-type:text/html; charset=utf-8");
/**
*合并css内容
*/
/*
function mergeCss($file1,$file2){
    $str = '';
    $arglist = func_get_args();
    foreach ($arglist as $value) {
        $str .= file_get_contents($value); //读取文件内容
    }
    return $str;
}*/

/**
*合并css内容
*/

/**
* 页面拼装类
*/
class CreateBehavor{

    public $output;

    public  function __construct(){
         $this->output  = '__ROOT__/createHtml/output/';
    }

    //获取某目录下所有文件、目录名（不包括子目录下文件、目录名）
    function get_files($dir){
        if (is_dir($dir)){
            if ($dh = opendir($dir)){
                $fileList = array();
                while (($file = readdir($dh)) !== false){
                    if ($file != "." && $file != "..") {
                        //文件名的全路径 包含文件名
                        $filePath = $dir.$file;
                        //获取文件修改时间
                        $fmt = filemtime($filePath);
                        //echo "<span style='color:#666'>(".date("Y-m-d H:i:s",$fmt).")</span> ".$filePath."<br/>";
                       // array_push($fileList,$filePath);

                        $arr = pathinfo($filePath);
                        $extension = $arr['extension'];
                        $name = basename($filePath,'.'.$extension);

                       $fileList[] = array('filePath'=>$filePath,'file'=>$file,'name'=>$name);
                   }
                }
                closedir($dh);
            }
            return $fileList;
        }else{
          echo '不是目录哦！';
        }
    }

    function getFileContent($fileName){
        return file_get_contents($fileName); //读取文件内容
    }

    function mergeCss($arrCss){
        $str = '';
        foreach ($arrCss as &$value) {
            $str .= file_get_contents($value); //读取文件内容
        }
        return $str;
    }

    //拷贝文件
    function copyFile($fileName){
        if(file_exists($fileName)){
            $arr = pathinfo($fileName);
            $path = $arr['dirname'];
            $extension = $arr['extension'];
            $name = basename($fileName,'.'.$extension);
            $fileNameBei = $path.'/'.$name.'_bei.'.$extension;
            return copy($fileName,$path.'/'.$name.'_bei.'.$extension);//备份文件
        }else{
            echo "缺少待拷贝的文件路径";
        }
    }

    //生成文件
    function createFile($fileName,$content){
    	$result =  true;
        if(file_exists($fileName)){
			unlink($fileName);//如果有旧文件则删除
        }
        $handle = fopen($fileName,"w+"); //写入方式打开页面文件
        //fwrite($handle, $str);  //把内容写入生成的html文件
        if(!fputs($handle,$content)){
			$result =  false;
        }
        fclose($handle); //关闭文件
        return $result;
    }

    //组装css
    function buildCss($fileName,$arrCss){
        $this->createFile($fileName,$this->mergeCss($arrCss));
    }

    //组装页面
    function createHtml($template,$fileName = 'index.html',$arrModule){
        if(file_exists($fileName)) unlink($fileName);//如果有旧文件则删除

        if(file_exists($template)){
            $fp = fopen($template, "r");  //只读方式打开模板文件
            $str = fread($fp, filesize($template));   //读取模板文件中的全部内容
        }else{
             echo "缺少布局模板!";
             return false;
        }

        //加载css文件引入
        $str = str_replace("{link}", $this->output.'css/index.css', $str);

        //获取模板页面内容
        foreach ($arrModule as $key => $value) {
            $key = basename($key,'.html');
            $subject = $value;
            $pattern = '#\.html$#';
            if(preg_match($pattern, $subject)){
                $$key = file_get_contents($value); //读取文件内容
            }else{
                $$key = $value;
            }
            $str = str_replace('{'.$key.'}', $$key, $str); //用存储在变量$content中的内容替换模板中的内容
        }
        $this->createFile($fileName,$str);
        fclose($fp);    //关闭模板文件

         return true;
    }



}
?>