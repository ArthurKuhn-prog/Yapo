<?php

if(file_exists('../admin/_php/connexiondb.php')){
    
    if(isset($_POST['db_host']) && gettype($_POST['db_host']) == "string"){
        if(isset($_POST['db_name']) && gettype($_POST['db_name']) == "string"){
            if(isset($_POST['db_login']) && gettype($_POST['db_login']) == "string"){
                if(isset($_POST['db_mdp']) && gettype($_POST['db_mdp']) == "string"){
    
                    $host = strip_tags($_POST['db_host']);
                    $name = strip_tags($_POST['db_name']);
                    $login = strip_tags($_POST['db_login']);
                    $mdp = strip_tags($_POST['db_mdp']);
                    
                    //Création des tables nécessaires.
                    require_once('../admin/_php/connexiondb.php');
                    
                    //Et du dossier de contenu
                    if(!is_dir('../content')){
                        mkdir('../content', 0755);
                    }
                    
                    if($bdd){
                        //1 - La table des infos admin
                        $requete = $bdd->prepare('CREATE TABLE IF NOT EXISTS `'.$name.'`.`users` ( 
                        `id` INT NOT NULL AUTO_INCREMENT, 
                        `admin_id` TINYTEXT NOT NULL, 
                        `admin_mdp` TINYTEXT NOT NULL, 
                        `admin_cle` TINYTEXT NOT NULL,
                        PRIMARY KEY (`id`)) 
                        ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci; ');
                        $requete->execute();
                        $requete->closeCursor();

                        //2 - La table des paramètres
                        $requete = $bdd->prepare('CREATE TABLE IF NOT EXISTS `'.$name.'`.`params` ( 
                        `id` INT NOT NULL AUTO_INCREMENT, 
                        `titre` TINYTEXT NOT NULL, 
                        `header_img` TINYTEXT NOT NULL, 
                        `site_root` TINYTEXT NOT NULL,  
                        `tags_meta` TEXT NOT NULL, 
                        PRIMARY KEY (`id`)) 
                        ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci; ');
                        $requete->execute();
                        $requete->closeCursor();
                        
                        if(!is_dir('../content/params')){
                            mkdir('../content/params', 0755);
                            mkdir('../content/params/params', 0755);
                        }

                        //3 - La table liste des catégories
                        $requete = $bdd->prepare('CREATE TABLE IF NOT EXISTS `'.$name.'`.`liste_cats` ( 
                        `id` INT NOT NULL AUTO_INCREMENT, 
                        `cat` TEXT NOT NULL, 
                        PRIMARY KEY (`id`)) 
                        ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci; ');
                        $requete->execute();
                        $requete->closeCursor();

                        //4 - La table contact
                        $requete = $bdd->prepare('CREATE TABLE IF NOT EXISTS `'.$name.'`.`contact` ( 
                        `id` INT NOT NULL AUTO_INCREMENT, 
                        `adresse` TEXT NOT NULL, 
                        `mail` TINYTEXT NOT NULL, 
                        `reseaux` TEXT NOT NULL, 
                        PRIMARY KEY (`id`)) 
                        ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci; ');
                        $requete->execute();
                        $requete->closeCursor();

                        //5 - La table cat_actu
                        $requete = $bdd->prepare('CREATE TABLE IF NOT EXISTS `'.$name.'`.`cat_actu` ( 
                        `id` INT NOT NULL AUTO_INCREMENT, 
                        `titre` TEXT NOT NULL, 
                        `contenu_json` TEXT NOT NULL, 
                        `date` TEXT NOT NULL, 
                        `prjt_cle` TINYTEXT NOT NULL, 
                        PRIMARY KEY (`id`)) 
                        ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci; ');
                        $requete->execute();
                        $requete->closeCursor();
                        
                        if(!is_dir('../content/cat_actu')){
                            mkdir('../content/cat_actu', 0755);
                        }

                        //6 - La table apropos
                        $requete = $bdd->prepare('CREATE TABLE IF NOT EXISTS `'.$name.'`.`apropos` ( 
                        `id` INT NOT NULL AUTO_INCREMENT, 
                        `titre` TEXT NOT NULL, 
                        `contenu_json` TEXT NOT NULL, 
                        `date` TEXT NOT NULL, 
                        `prjt_cle` TINYTEXT NOT NULL, 
                        PRIMARY KEY (`id`)) 
                        ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci; ');
                        $requete->execute();
                        $requete->closeCursor();
                        
                        if(!is_dir('../content/cat_apropos')){
                            mkdir('../content/cat_apropos', 0755);
                            mkdir('../content/apropos/apropos', 0775);
                        }

                        //7 - La table accueil
                        $requete = $bdd->prepare('CREATE TABLE IF NOT EXISTS `'.$name.'`.`accueil` ( 
                        `id` INT NOT NULL AUTO_INCREMENT, 
                        `titre` TEXT NOT NULL, 
                        `contenu_json` TEXT NOT NULL, 
                        `date` TEXT NOT NULL, 
                        `prjt_cle` TINYTEXT NOT NULL, 
                        PRIMARY KEY (`id`)) 
                        ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci; ');
                        $requete->execute();
                        $requete->closeCursor();
                        
                        if(!is_dir('../content/cat_accueil')){
                            mkdir('../content/cat_accueil', 0755);
                            mkdir('../content/accueil/accueil', 0755);
                        }
                        
                        echo "ok";
                        
                    } else {
                        echo "pas de PDO dispo".PHP_EOL;
                    }
                }
            }
        }
    }
    
} else {
    echo "pas de fichier de connexion créé!".PHP_EOL;
}

?>