<?php
require_once('connexiondb.php');

if(isset($_POST['cat'])){ //On a bien une catégorie
    $cat = strip_tags($_POST['cat']); //Sécurité, pas de html
    
    if(isset($_POST['cle'])){
        $cle = strip_tags($_POST['cle']);
        
        $requete = $bdd->query('SELECT * FROM `cat_'.$cat.'` WHERE prjt_cle = "'.$cle.'"');
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
    } else {
        //On doit récupérer la liste des projets qui ont été créés dans cette catégorie
        $requete = $bdd->query('SELECT * FROM `cat_'.$cat.'` ORDER BY id DESC');
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
}

?>