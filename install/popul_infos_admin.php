<?php

if(isset($_POST['login']) && gettype($_POST['login']) == "string"){
    if(isset($_POST['mdp']) && gettype($_POST['mdp']) == "string"){
        if(isset($_POST['url']) && gettype($_POST['url']) == "string"){
            if(isset($_POST['titre']) && gettype($_POST['titre']) == "string"){
                
                function getRandomWord($len = 12) {
                    $word = array_merge(range('a', 'z'), range('A', 'Z'));
                    shuffle($word);
                    return substr(implode($word), 0, $len);
                }
                
                $login = strip_tags($_POST['login']);
                
                //Travail sur la mot de passe: pepperisation et hashage pour grosse sécu
                $mdp = strip_tags($_POST['mdp']);
                
                //HTPASSWD ET HTACCESS. Pas la bonne solution puisque dès la page d'accueil on doit récupérer des trucs grâce aux scripts php...
                /*
                if(!file_exists('../admin/_php/.htaccess') && !file_exists('../admin/_php/.htpasswd')){
                    $htpasswd = fopen('../admin/_php/.htpasswd', 'a+');
                    fputs($htpasswd, $login.':'.password_hash($mdp, PASSWORD_BCRYPT).PHP_EOL);
                    fclose($htpasswd);
                    
                    $htaccess = fopen('../admin/_php/.htaccess', 'a+');
                    fputs($htaccess, 'AuthName "Section protégée !"'.PHP_EOL);
                    fputs($htaccess, 'AuthType Basic'.PHP_EOL);
                    fputs($htaccess, 'AuthUserFile "'.realpath('../admin/_php/.htpasswd').'"'.PHP_EOL);
                    fputs($htaccess, 'Require valid-user'.PHP_EOL);
                    fclose($htaccess);
                } else {
                    unlink('../admin/_php/.htpasswd');
                    unlink('../admin/_php/.htaccess');
                    
                    $htpasswd = fopen('../admin/_php/.htpasswd', 'a+');
                    fputs($htpasswd, $login.':'.password_hash($mdp, PASSWORD_BCRYPT).PHP_EOL);
                    fclose($htpasswd);
                    
                    $htaccess = fopen('../admin/_php/.htaccess', 'a+');
                    fputs($htaccess, 'AuthName "Section protégée !"'.PHP_EOL);
                    fputs($htaccess, 'AuthType Basic'.PHP_EOL);
                    fputs($htaccess, 'AuthUserFile "'.realpath('../admin/_php/.htpasswd').'"'.PHP_EOL);
                    fputs($htaccess, 'Require valid-user'.PHP_EOL);
                    fclose($htaccess);
                }
                
                if(!file_exists('../admin/_js/.htaccess') && !file_exists('../admin/_js/.htpasswd')){
                    $htpasswd = fopen('../admin/_js/.htpasswd', 'a+');
                    fputs($htpasswd, $login.':'.password_hash($mdp, PASSWORD_BCRYPT).PHP_EOL);
                    fclose($htpasswd);
                    
                    $htaccess = fopen('../admin/_js/.htaccess', 'a+');
                    fputs($htaccess, 'AuthName "Section protégée !"'.PHP_EOL);
                    fputs($htaccess, 'AuthType Basic'.PHP_EOL);
                    fputs($htaccess, 'AuthUserFile "'.realpath('../admin/_js/.htpasswd').'"'.PHP_EOL);
                    fputs($htaccess, 'Require valid-user'.PHP_EOL);
                    fclose($htaccess);
                } else {
                    unlink('../admin/_js/.htpasswd');
                    unlink('../admin/_js/.htaccess');
                    
                    $htpasswd = fopen('../admin/_js/.htpasswd', 'a+');
                    fputs($htpasswd, $login.':'.password_hash($mdp, PASSWORD_BCRYPT).PHP_EOL);
                    fclose($htpasswd);
                    
                    $htaccess = fopen('../admin/_js/.htaccess', 'a+');
                    fputs($htaccess, 'AuthName "Section protégée !"'.PHP_EOL);
                    fputs($htaccess, 'AuthType Basic'.PHP_EOL);
                    fputs($htaccess, 'AuthUserFile "'.realpath('../admin/_js/.htpasswd').'"'.PHP_EOL);
                    fputs($htaccess, 'Require valid-user'.PHP_EOL);
                    fclose($htaccess);
                }
                */
                
                
                if(!file_exists('../admin/_php/pep.per')){
                    $pepper_file = fopen('../admin/_php/pep.per', 'a+');
                    $pepper = getRandomWord();
                    fputs($pepper_file, $pepper);
                    fclose($pepper_file);
                    
                    $mdp_peppered = hash_hmac("sha256", $mdp, $pepper);
                    $mdp = password_hash($mdp_peppered, PASSWORD_DEFAULT);
                } else {
                    $pepper_file = fopen('../admin/_php/pep.per', 'r');
                    $pepper = fgets($pepper_file);
                    fclose($pepper_file);
                    
                    $mdp_peppered = hash_hmac("sha256", $mdp, $pepper);
                    $mdp = password_hash($mdp_peppered, PASSWORD_DEFAULT);
                }
                
                $url = strip_tags($_POST['url']);
                $titre = strip_tags($_POST['titre']);

                require_once('../admin/_php/connexiondb.php');

                if($bdd){
                    $verif_sys = $bdd->prepare('SELECT * FROM users');
                    $verif_sys->execute();

                    $foo = $verif_sys->fetch();
                    
                    if($foo){
                        $requete = $bdd->prepare('UPDATE `users` SET admin_id = :admin_id, admin_mdp = :admin_mdp ');
                        $requete->execute(array(
                        'admin_id' => $login,
                        'admin_mdp' => $mdp));
                        $requete->closeCursor();
                    } else {
                        $admin_cle = getRandomWord();
                        
                        $requete = $bdd->prepare('INSERT INTO `users`(admin_id, admin_mdp, admin_cle) VALUES(:admin_id, :admin_mdp, :admin_cle)');
                        $requete->execute(array(
                        'admin_id' => $login,
                        'admin_mdp' => $mdp,
                        'admin_cle' => $admin_cle));
                        $requete->closeCursor();
                    }

                    $verif_params = $bdd->prepare('SELECT * FROM params');
                    $verif_params->execute();

                    $foo = $verif_params->fetch();
                    
                    if($foo){
                        $requete = $bdd->prepare('UPDATE `params` SET titre = :titre , site_root = :site_root ');
                        $requete -> execute(array(
                        'titre' => $titre,
                        'site_root' => $url ));
                        $requete->closeCursor();
                        
                        if(file_exists('../sitemap.txt')){
                            unlink('../sitemap.txt');
                        }
                        
                        $sitemap = fopen('../sitemap.txt', 'a+');
                        fputs($sitemap, $url.PHP_EOL);
                        fputs($sitemap, $url.'/index.php'.PHP_EOL);
                        fputs($sitemap, $url.'/apropos.php'.PHP_EOL);
                    } else {
                        $requete = $bdd->prepare('INSERT INTO `params`(titre, site_root) VALUES(:titre, :site_root)');
                        $requete->execute(array(
                        'titre' => $titre,
                        'site_root' => $url));
                        $requete -> closeCursor();
                        
                        if(file_exists('../sitemap.txt')){
                            unlink('../sitemap.txt');
                        }
                        
                        $sitemap = fopen('../sitemap.txt', 'a+');
                        fputs($sitemap, $url.PHP_EOL);
                        fputs($sitemap, $url.'/index.php'.PHP_EOL);
                        fputs($sitemap, $url.'/apropos.php'.PHP_EOL);
                    }

                    echo "ok";
                } else {
                    echo "Problème pour se connecter à la BDD".PHP_EOL;
                }
            
            } else {
                echo "Problème avec le titre".PHP_EOL;
            }
        } else {
            echo "Problème avec l'url".PHP_EOL;
        }
    } else {
        echo "Problème avec le mdp".PHP_EOL;
    }
} else {
    echo "Problème avec le login".PHP_EOL;
}

?>