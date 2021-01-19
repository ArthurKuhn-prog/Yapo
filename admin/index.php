<?php

ini_set('session.use_strict_mode', 1);
require_once('_php/sessions.php');
my_session_start();

require_once('_php/connexiondb.php');
    
if($bdd){
    $requete = $bdd->query('SELECT titre FROM params')->fetch();
    $site_titre = $requete['titre'];
}

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();
    
    ?>

<!DOCTYPE html>
<html>
    <head>
        <script src="_js/vue.js"></script>
        <script src="_js/ajax.js"></script>
        <script src="_js/composantsAdmin.js"></script>
        <script src="https://unpkg.com/marked@0.3.6"></script>
        <title><?php echo $site_titre ?> - Admin</title>
        <link rel="stylesheet" type="text/css" href="../bootstrap/css/bootstrap.css">
    </head>
    <body>
        <div id="yapo_admin">
            <script src="_js/admin.js"></script>
        </div>
    </body>
</html>

<?php
} else {
    ?>

<!DOCTYPE html>
<html>
    <head>
        <script src="_js/ajax.js"></script>
        <title><?php echo $site_titre?> - Yapo: authentifiez-vous !</title>
        <link rel="stylesheet" type="text/css" href="../bootstrap/css/bootstrap.css">
        <link rel="stylesheet" type="text/css" href="admin.css">
    </head>
    <body>
        <div class="container">
            <div class="form-group menu_login mx-auto mt-5">
                <h1 class="display-1">Yapo</h1>
                
                <div class="mt-3">
                    <label for="admin_login">Identifiant :</label>
                    <input type="text" id="admin_login" name="admin_login" class="form-control px-2"><br />

                    <label for="admin_mdp">Mot de passe :</label>
                    <input type="password" id="admin_mdp" name="admin_mdp" class="form-control px-2"><br />

                    <div class="row justify-contents-center">
                        <button type="button" class="btn btn-primary mx-auto" onclick="auth()">S'identifier</button>
                    </div>
                </div>    
                
                <div class="small mt-4">
                    <em>Yapo v0.5.3 - © Collectif 8h30 - 2020</em>
                </div>
            </div>
        </div>
    </body>
    <script type="application/javascript" src="_js/auth.js"></script>
</html>

<?php
}
?>


