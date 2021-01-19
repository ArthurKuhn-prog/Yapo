<?php

require_once('../admin/_php/connexiondb.php');

if($bdd){
    $requete = $bdd->query('SELECT contenu_json FROM apropos')->fetch();
    echo json_encode($requete['contenu_json']);
}

?>