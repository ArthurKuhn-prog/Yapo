<?php

ini_set('session.use_strict_mode', 1);
require_once('sessions.php');
my_session_start();

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();

    if(isset($_POST['cle']) && gettype($_POST['cle']) == "string" && $_POST['cle'] == "sys_admin"){
        $cle = $_POST['cle'];

        $admin_id = strip_tags($_POST['admin_id']);
        $old_mdp = strip_tags($_POST['old_mdp']);
        $nv_mdp = strip_tags($_POST['nv_mdp']);

        //Pour les infos admin c'est un peu particulier puisque ça peut être la première fois qu'on enregistre les infos pour la connexion à la bdd

        if(file_exists('connexiondb.php')){ //Si on a déjà un fichier connexiondb.php
            require_once('connexiondb.php');

            if($nv_mdp != ""){
                $pepper_file = fopen('pep.per', 'r');
                if($pepper_file){
                    $pepper = fgets($pepper_file);

                    $mdp_peppered = hash_hmac("sha256", $old_mdp, $pepper);

                    $requete = $bdd->query('SELECT admin_mdp FROM sys_admin')->fetch();
                    $mdp_bdd = $requete['admin_mdp'];

                    if (password_verify($mdp_peppered, $mdp_bdd)) {
                        $nv_mdp_peppered = hash_hmac("sha256", $nv_mdp, $pepper);
                        $nv_mdp = password_hash($nv_mdp_peppered, PASSWORD_DEFAULT);

                        $requete = $bdd->prepare('UPDATE `sys_admin` SET 
                        admin_mdp = :admin_mdp');

                        $requete->execute(array(
                        'admin_mdp'=>$nv_mdp));

                        echo "changement mdp";
                    } else {
                        echo "old_mdp mauvais";
                    }
                }
            }

            $verif = $bdd->prepare('SELECT * FROM sys_admin');
            $verif->execute();

            $foo = $verif->fetch();

            if($foo){
                $requete = $bdd->prepare('UPDATE `sys_admin` SET 
                admin_id = :admin_id ');

                $requete -> execute(array(
                'admin_id' => $admin_id ));

                $requete->closeCursor();

            } else { 
                echo "no sys_admin";
            }
        }
    }
}

?>