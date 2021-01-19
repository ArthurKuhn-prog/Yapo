<?php

if(isset($_POST['cle']) && gettype($_POST['cle']) == "string"){
    if(isset($_POST['cat']) && gettype($_POST['cat']) == "string"){
        $cle = strip_tags($_POST['cle']);
        $cat = strip_tags($_POST['cat']);
        
        $thumb = glob('../content/cat_'.$cat.'/'.$cle.'/thumbs/main.*');
        
        if(count($thumb) > 0){
            echo str_replace('../', '', $thumb[0]);
        } else {
            echo "false";
        }
    }
}

?>