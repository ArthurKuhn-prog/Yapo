<?php

    require_once('../admin/_php/connexiondb.php');
    
    $requete = $bdd->query('SELECT * FROM contact ')->fetch();
    echo json_encode($requete);

?>