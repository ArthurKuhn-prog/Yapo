<?php

ini_set('session.use_strict_mode', 1);
require_once('sessions.php');
my_session_start();

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();

if(isset($_POST['cle']) && gettype($_POST['cle']) == "string" && $_POST['cle'] == "params"){
    $cle = $_POST['cle'];
    
    $titre = strip_tags($_POST['titre']);
    
    if(isset($_POST['header_img'])){
        $header_img = strip_tags($_POST['header_img']);
    }
    
    $site_root = strip_tags($_POST['site_root']);
    $tags_meta = strip_tags($_POST['tags_meta']);
    
    require_once('connexiondb.php');
    
    $verif = $bdd->prepare('SELECT * FROM params');
    $verif->execute();
    
    $foo = $verif->fetch();
    
    if($foo){
        $requete = $bdd->prepare('UPDATE `params` SET 
        titre = :titre , 
        site_root = :site_root ,
        tags_meta = :tags_meta ');
        $requete -> execute(array(
        'titre' => $titre,
        'site_root' => $site_root,
        'tags_meta' => $tags_meta ));
        $requete->closeCursor();
        
        if(isset($header_img)){
            $requete = $bdd->prepare('UPDATE `params` SET 
            header_img = :header_img ');
            $requete -> execute(array(
            'header_img' => $header_img ));
            $requete->closeCursor();
        }
        
        echo "ok";
    } else {
        $requete = $bdd->prepare('INSERT INTO `params`(titre, site_root, tags_meta) VALUES (:titre , :header_img , :site_root , :tags_meta )');
        $requete -> execute(array(
        'titre' => $titre,
        'site_root' => $site_root,
        'tags_meta' => $tags_meta ));
        $requete->closeCursor();
        
        if(isset($header_img)){
            $requete = $bdd->prepare('INSERT INTO `params`(header_img) VALUES(:header_img) ');
            $requete -> execute(array(
            'header_img' => $header_img ));
            $requete->closeCursor();
        }
        
        echo "paramètres enregistrés";
    }
}
} else {
    echo "session_prblm";
}
?>