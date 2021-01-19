<?php

if(isset($_POST['cat']) && gettype($_POST['cat']) == "string"){
    $cat = strip_tags($_POST['cat']);
    
    require_once('connexiondb.php');
    
    $requete = $bdd->query('SELECT * FROM '.$cat.' ORDER BY id DESC ')->fetchAll();
    echo json_encode($requete);
}

?>