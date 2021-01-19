<?php
ini_set('session.use_strict_mode', 1);
require_once('sessions.php');
my_session_start();

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();
    
if($_SERVER['REQUEST_METHOD'] == "POST") {
    if(isset($_POST['prjt_cle']) && gettype($_POST['prjt_cle']) == 'string' && isset($_POST['prjt_cat']) && gettype($_POST['prjt_cat']) == 'string'){
        $cle = strip_tags($_POST['prjt_cle']);
        $cat = strip_tags($_POST['prjt_cat']);
        
        $fileName = strip_tags($_POST['fileName']);
        
        unlink('../../content/'.$cat.'/'.$cle.'/'.$fileName);
        
        echo "ok!";
    }
}
}
?>