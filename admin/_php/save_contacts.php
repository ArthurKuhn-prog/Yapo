<?php

ini_set('session.use_strict_mode', 1);
require_once('sessions.php');
my_session_start();

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();

if(isset($_POST['cle']) && gettype($_POST['cle']) == "string" && $_POST['cle'] == "contacts"){
    $cle = $_POST['cle'];
    
    $adresse = strip_tags($_POST['adresse']);
    $mail = strip_tags(str_replace("@", "(at)", $_POST['mail']));
    $reseaux = strip_tags($_POST['reseaux']);
    
    require_once('connexiondb.php');
    
    $verif = $bdd->prepare('SELECT * FROM contact');
    $verif->execute();
    
    $foo = $verif->fetch();
    
    if($foo){
        $requete = $bdd->prepare('UPDATE `contact` SET adresse = :adresse , mail = :mail , reseaux = :reseaux ');
        $requete -> execute(array(
        'adresse' => $adresse,
        'mail' => $mail,
        'reseaux' => $reseaux ));
    } else {
        $requete = $bdd->prepare('INSERT INTO `contact`(adresse, mail, reseaux) VALUES(:adresse , :mail , :reseaux )');
        $requete -> execute(array(
        'adresse' => $adresse,
        'mail' => $mail,
        'reseaux' => $reseaux ));
    }
}
} else {
    echo "session_prblm";
}

?>