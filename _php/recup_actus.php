<?php

require_once('../admin/_php/connexiondb.php');

if($bdd){
    $requete = $bdd->query('SELECT * FROM cat_actu ORDER BY id DESC')->fetchAll();
    echo json_encode($requete);
}

?>