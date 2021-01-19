<?php

if(isset($_POST['db_host']) && gettype($_POST['db_host']) == "string"){
    if(isset($_POST['db_name']) && gettype($_POST['db_name']) == "string"){
        if(isset($_POST['db_login']) && gettype($_POST['db_login']) == "string"){
            if(isset($_POST['db_mdp']) && gettype($_POST['db_mdp']) == "string"){
                
                $host = strip_tags($_POST['db_host']);
                $name = strip_tags($_POST['db_name']);
                $login = strip_tags($_POST['db_login']);
                $mdp = strip_tags($_POST['db_mdp']);
                
                try{//Pour se connecter à la bdd, en affichant les erreurs de base
                    $bdd = new PDO('mysql:host='.$host.';dbname='.$name.';charset=utf8', $login, $mdp);
                }
                catch(Exception $e){
                    die('Erreur : ' . $e->getMessage());
                }
                
                if($bdd){
                    if(file_exists('../admin/_php/connexiondb.php')){
                        unlink('../admin/_php/connexiondb.php');
                    }
                    
                    $connectiondb = fopen('../admin/_php/connexiondb.php', 'a+'); //On créé le fichier qui sera ensuite inclus partout
                    fputs($connectiondb, "<?php".PHP_EOL);
                    fputs($connectiondb, "try{//Pour se connecter à la bdd, en affichant les erreurs de base".PHP_EOL);
                    //LIGNE IMPORTANTE: C'est là qu'on met toutes les infos que l'utilisateur nous a donné
                    fputs($connectiondb, '$bdd = new PDO(\'mysql:host='.$host.';dbname='.$name.';charset=utf8\', \''.$login.'\', \''.$mdp.'\');'.PHP_EOL); 
                    fputs($connectiondb, '}'.PHP_EOL);
                    fputs($connectiondb, 'catch(Exception $e){'.PHP_EOL);
                    fputs($connectiondb, 'die(\'Erreur : \' . $e->getMessage());'.PHP_EOL);
                    fputs($connectiondb, '}'.PHP_EOL);
                    fputs($connectiondb, PHP_EOL);
                    fputs($connectiondb, '?>'.PHP_EOL);

                    fclose($connectiondb);
                    echo "ok";
                } else {
                    echo "connexion impossible".PHP_EOL;
                }
                
            } else {
                echo "pas de mot de passe!".PHP_EOL;
            }
        } else {
            echo "pas de login".PHP_EOL;
        }
    } else {
        echo "pas de nom de bdd".PHP_EOL;
    }
} else {
    echo "pas de nom d'hôte".PHP_EOL;
}

?>