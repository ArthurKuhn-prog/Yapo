<?php
try{//Pour se connecter à la bdd, en affichant les erreurs de base
$bdd = new PDO('mysql:host=localhost;dbname=yapo-0-6;charset=utf8', 'arthur', 'L3ch4t3stl4!');
}
catch(Exception $e){
die('Erreur : ' . $e->getMessage());
}

?>
