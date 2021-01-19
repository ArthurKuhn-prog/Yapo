<?php

    require_once('../admin/_php/connexiondb.php');
    
    $requete = $bdd->query('SELECT * FROM cat_actu ')->fetchAll();
    echo count($requete);

?>