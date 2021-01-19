<?php

require_once('../admin/_php/connexiondb.php');

if($bdd){
    $requete = $bdd->query('SELECT * FROM params')->fetch();
    echo json_encode($requete);
} else {
    echo "probleme bdd".PHP_EOL;
}

?>