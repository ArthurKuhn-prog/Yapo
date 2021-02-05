<?php
require_once('../admin/_php/connexiondb.php');

if(isset($_POST['cat'])){ //On a bien une catégorie
    $cat = strip_tags($_POST['cat']); //Sécurité, pas de html
    
    //On doit récupérer la liste des projets qui ont été créés dans cette catégorie
    $requete = $bdd->query('SELECT id,titre, prjt_cle FROM `cat_'.$cat.'` ORDER BY id DESC');
    if($requete){ //Si la requete n'a pas renvoyé un false
        $liste_prjts = $requete->fetchAll();

        if(count($liste_prjts) > 0){ //Si on a au moins une entrée dans la table
            echo json_encode($liste_prjts); //On envoie l'objet
        } else{ //Sinon, si la table est vide
            return false; //On envoie false
        }

    } else{
        return false;
    }
}

?>


