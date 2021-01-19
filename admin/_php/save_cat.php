<?php

ini_set('session.use_strict_mode', 1);
require_once('sessions.php');
my_session_start();

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();

if(isset($_POST['cat']) && gettype($_POST['cat']) == "string"){
    if(isset($_POST['id']) && gettype($_POST['id']) == "string"){
        if(isset($_POST['modele']) && gettype($_POST['modele']) == "string"){
            require_once('connexiondb.php');

            $cat = strip_tags($_POST['cat']);
            $id = strip_tags($_POST['id']);
            $modele = strip_tags($_POST['modele']);
            
            //On vérifie u'il n'existe pas déjà un projet avec cette clé
            $verif = $bdd->prepare('SELECT * FROM `liste_cats` WHERE id = "'.$id.'" ');
            $verif->execute();
            
            $foo = $verif->fetch();
            
            if($foo){
                //Si la catégorie existe déjà
                
                //On met à jour dans la liste
                $requete = $bdd->prepare('UPDATE `liste_cats` SET cat = :cat  WHERE id = :id');
                $requete -> execute(array(
                'cat' => $cat,
                'id' => $id ));
                $requete->closeCursor();
                
                //Et on met à jour le modèle
                $requete = $bdd->prepare('UPDATE `cat_'.$id.'` SET contenu_json = :contenu WHERE prjt_cle = "modele" ');
                $requete->execute(array(
                'contenu' => $modele));
                $requete->closeCursor();
                echo "modifs ok";
            } else {
                //On créé une nouvelle entrée dans la liste
                $requete = $bdd->prepare('INSERT INTO `liste_cats`(cat) VALUES (:cat)');
                $requete -> execute(array(
                'cat' => $cat ));
                
                //On crée une nouvelle table pour la catégorie
                $requete = $bdd->query("SELECT MAX(id) FROM liste_cats")->fetch();
                $id = $requete[0];
                
                $requete = $bdd->prepare("CREATE TABLE IF NOT EXISTS `cat_".$id."` ( `id` INT NOT NULL AUTO_INCREMENT, `titre` TEXT NOT NULL, `contenu_json` TEXT NOT NULL, `date` TEXT NOT NULL , `prjt_cle` TINYTEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci; ");
                $requete->execute();
                $requete->closeCursor();

                //Ajout d'un "projet[0]" qui servira de modèle pour créer un formulaire vide de nouveau projet
                $requete = $bdd->prepare("INSERT INTO `cat_".$id."`(titre, contenu_json, date, prjt_cle) VALUES(:titre, :modele, :date, :cle) ");
                $requete->execute(array(
                    'titre' => '',
                    'modele' => $modele,
                    'date' => date("Y.m.d"),
                    'cle' => 'modele' ));
                $requete->closeCursor();
                
                //Création d'un dossier où enregistrer le template
                if(!is_dir('../../content/cat_'.$id)){ //Si le dossier n'existe pas encore
                    mkdir('../../content/cat_'.$id, 0755, true); //On le créé
                    $pathTo = '../../content/cat_'.$id.'/'; //Et on dit que c'est lui
                } else { //Sinon
                    $pathTo = '../../content/cat_'.$id.'/'; //C'est lui, tout simplement
                }
                
                copy('listePages.php', $pathTo.'listePages.php');
                
                echo $id;
            }
        }
    }
}
} else {
    echo "session_prblm";
}
?>