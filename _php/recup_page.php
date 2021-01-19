<?php

if(isset($_POST['cat']) && gettype($_POST['cat']) == "string"){
    if(isset($_POST['cle']) && gettype($_POST['cle']) == "string"){
        $cat = strip_tags($_POST['cat']);
        $cle = strip_tags($_POST['cle']);
        
        require_once('../admin/_php/connexiondb.php');

        if($bdd){
            $requete = $bdd->query('SELECT * FROM `'.$cat.'` 
            WHERE prjt_cle = "'.$cle.'" ')->fetch();
            echo json_encode($requete);
        } else {
            echo "probleme bdd".PHP_EOL;
        }
        
    }
}

?>