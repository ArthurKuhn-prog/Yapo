<?php
if(isset($_POST['login']) && gettype($_POST['login']) == "string"){
    if(isset($_POST['mdp']) && gettype($_POST['mdp']) == "string"){
        $login = strip_tags($_POST['login']);
        $mdp = strip_tags($_POST['mdp']);
        
        $pepper_file = fopen('pep.per', 'r');
        if($pepper_file){
            $pepper = fgets($pepper_file);
            
            $mdp_peppered = hash_hmac("sha256", $mdp, $pepper);
            
            require_once('connexiondb.php');
            
            if($bdd){
                $requete = $bdd->query('SELECT admin_mdp FROM sys_admin WHERE admin_id = "'.$login.'"')->fetch();
                $mdp_bdd = $requete['admin_mdp'];
                
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
                }
            }
        }
    }
}
?>
