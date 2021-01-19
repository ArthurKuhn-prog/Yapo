<?php

ini_set('session.use_strict_mode', 1);
require_once('sessions.php');
my_session_start();

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();

if(isset($_POST['image']) && gettype($_POST['image']) == "string"){
    if(isset($_POST['cle']) && gettype($_POST['cle']) == "string"){
        if(isset($_POST['cat']) && gettype($_POST['cat']) == "string"){
            $img = strip_tags($_POST['image']);
            $cle = strip_tags($_POST['cle']);
            $cat = strip_tags($_POST['cat']);
            
            $pathTo = '../../content/cat_'.$cat.'/'.$cle;
            
            if(is_dir($pathTo.'/hidden')){
                rename($pathTo.'/'.$img, $pathTo.'/hidden/'.$img);
                echo "image déplacée là: ".$pathTo.'/hidden/'.$img.PHP_EOL;
            } else {
                mkdir($pathTo.'/hidden', 0775);
                echo 'répertoire des cachées créé'.PHP_EOL;
                rename($pathTo.'/'.$img, $pathTo.'/hidden/'.$img);
            }
        }
    }
}

}
?>