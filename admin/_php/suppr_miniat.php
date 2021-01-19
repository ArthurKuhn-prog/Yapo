<?php
ini_set('session.use_strict_mode', 1);
require_once('sessions.php');
my_session_start();

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();
    
if(isset($_POST['cle']) && gettype($_POST['cle']) == "string"){
    if(isset($_POST['cat']) && gettype($_POST['cat']) == "string"){
        $cle = strip_tags($_POST['cle']);
        $cat = strip_tags($_POST['cat']);
        
        $thumb = glob('../../content/cat_'.$cat.'/'.$cle.'/thumbs/main.*');
        
        if($thumb){
            unlink($thumb[0]);
            echo "miniature supprimée".PHP_EOL;
        } else {
            echo "pas de miniature".PHP_EOL;
        }
    }
}
}
?>