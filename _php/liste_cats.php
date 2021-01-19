<?php

    require_once('../admin/_php/connexiondb.php');
    
    $requete = $bdd->query('SELECT * FROM liste_cats ORDER BY id DESC ')->fetchAll();
    echo json_encode($requete);

?>