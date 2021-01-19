<?php

ini_set('session.use_strict_mode', 1);
require_once('sessions.php');
my_session_start();

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();

if(isset($_POST['cat']) && gettype($_POST['cat']) == "string"){
    if(isset($_POST['cle']) && gettype($_POST['cle']) == "string"){
        $cat = strip_tags($_POST['cat']);
        $cle = strip_tags($_POST['cle']);
        
        $thumb = glob('../../content/cat_'.$cat.'/'.$cle.'/thumbs/main.*');
        
        if($thumb){
            echo $thumb[0];
        } else {
            echo "non";
        }
    }
}

}
    
?>