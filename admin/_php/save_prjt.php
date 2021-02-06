<?php
ini_set('session.use_strict_mode', 1);
require_once('sessions.php');
my_session_start();

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();

if(isset($_POST['prjt_cat']) && gettype($_POST['prjt_cat']) == "string"){
    if(isset($_POST['prjt_titre']) && gettype($_POST['prjt_titre']) == "string"){
        if(isset($_POST['prjt_contenu']) && gettype($_POST['prjt_contenu']) == "string"){
            require_once('connexiondb.php');

            $cat = strip_tags($_POST['prjt_cat']);
            $titre = strip_tags($_POST['prjt_titre']);
            $cle = strip_tags($_POST['prjt_cle']);
            $contenu = $_POST['prjt_contenu'];
            $thumb = strip_tags($_POST['prjt_thumb']);
            
            //On vérifie u'il n'existe pas déjà un projet avec cette clé
            $verif = $bdd->prepare('SELECT * FROM `'.$cat.'` WHERE prjt_cle = "'.$cle.'" ');
            $verif->execute();
            
            $foo = $verif->fetch();
            
            if($foo){
                echo "ok";
                $requete = $bdd->prepare('UPDATE `'.$cat.'` SET contenu_json = :contenu , thumb = :thumb, titre = :titre , date = :date WHERE prjt_cle = :cle');
                $requete -> execute(array(
                'contenu' => $contenu,
                'thumb' => $thumb,
                'titre' => $titre,
                'date' => date("Y.m.d"),
                'cle' => $cle ));
            } else {
                echo "pas ok";
                $requete = $bdd->prepare('INSERT INTO `'.$cat.'`(titre, contenu_json, date, prjt_cle) VALUES (:titre, :contenu, :thumb, :date, :cle)');
                $requete -> execute(array(
                'titre' => $titre,
                'contenu' => $contenu,
                'thumb' => $thumb,
                'date' => date("Y.m.d"),
                'cle' => $cle ));
                
                if($titre != "accueil"){
                    //Premier enregistrement, on doit aussi créer le dossier
                    if(!is_dir('../../content/'.$cat.'/'.$cle)){ //Si le dossier n'existe pas encore
                        mkdir('../../content/'.$cat.'/'.$cle, 0755, true); //On le créé
                        $pathTo = '../../content/'.$cat.'/'.$cle.'/'; //Et on dit que c'est lui
                    } else { //Sinon
                        $pathTo = '../../content/'.$cat.'/'.$cle.'/'; //C'est lui, tout cimplement
                    }
                    
                    if($cat != "cat_actu" && $cat != "apropos" && $cat != "params"){
                        $fichierProjet = fopen($pathTo.$cle.'.php', 'a+');
                        fputs($fichierProjet, '<?php'.PHP_EOL);
                        fputs($fichierProjet, '$cle = "'.$cle.'";'.PHP_EOL);
                        fputs($fichierProjet, '$cat = "'.$cat.'";'.PHP_EOL);
                        fputs($fichierProjet, 'if(file_exists(\'../templatePage.php\')) { require_once(\'../templatePage.php\'); } else { require_once(\'../../../admin/_php/templatePage.php\'); }'.PHP_EOL);
                        fputs($fichierProjet, '?>'.PHP_EOL);
                        fclose($fichierProjet);
                        
                        $requete = $bdd->query('SELECT site_root FROM params')->fetch();
                        $url = $requete['site_root'];
                        
                        $sitemap = fopen('../../sitemap.txt', 'a+');
                        fputs($sitemap, $url.'/'.$cat.'/'.$cle.'/'.$cle.'.php'.PHP_EOL);
                        fclose($sitemap);
                    }
                }
            }
        }
    }
}
} else {
    echo "session_prblm";
}
?>