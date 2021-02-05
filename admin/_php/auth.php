<?php
if(isset($_POST['login']) && gettype($_POST['login']) == "string" && strlen($_POST['login']) != 0){
    if(isset($_POST['mdp']) && gettype($_POST['mdp']) == "string" && strlen($_POST['mdp']) != 0){
        $login = strip_tags($_POST['login']);
        $mdp = strip_tags($_POST['mdp']);
        
        $pepper_file = fopen('pep.per', 'r');
        if($pepper_file){
            $pepper = fgets($pepper_file);
            
            $mdp_peppered = hash_hmac("sha256", $mdp, $pepper);
            
            require_once('connexiondb.php');
            
            if($bdd){
                $users = $bdd->query('SELECT `admin_id` FROM users')->fetchAll(PDO::FETCH_COLUMN);
                
                if(in_array($login, $users, true)){
                    
                    $mdp_bdd = $bdd->query('SELECT `admin_mdp` FROM users WHERE admin_id = "'.$login.'"')->fetch();
                    
                    if (password_verify($mdp_peppered, $mdp_bdd['admin_mdp'])) {
                        if (session_status() != PHP_SESSION_ACTIVE) {
                            session_start();
                        }

                        $newid = session_create_id('YapoAuth-');

                        $_SESSION['deleted_time'] = time();

                        $_SESSION['YapoAuth'] = true;

                        session_commit();

                        session_id($newid);

                        echo 'ok';
                    } else {
                        echo 'mdp';
                    }
                    
                } else{
                    echo 'login';
                }
                
                /*$mdp_bdd = $requete['admin_mdp'];
                
                if (password_verify($mdp_peppered, $mdp_bdd)) {
                    
                    if (session_status() != PHP_SESSION_ACTIVE) {
                        session_start();
                    }
                    
                    $newid = session_create_id('YapoAuth-');
                    
                    $_SESSION['deleted_time'] = time();
                    
                    $_SESSION['YapoAuth'] = true;
                    
                    session_commit();
                    
                    session_id($newid);
                    
                    echo 'ok';
                } else {
                    echo 'nein';
                }*/
            } else {
                echo 'bdd';
            }
        } else {
            echo 'pepper';
        }
    }
}
?>
