<?php

function my_session_start() {
    session_start();
    // N'autorise pas l'utilisation des anciens ID de session
    if (!empty($_SESSION['deleted_time']) && $_SESSION['deleted_time'] < time() - 15 * 60) {
        session_destroy();
        session_start();
    }
}

function my_session_regenerate_id() {
    // Le nouvel ID de session est requis pour définir l'ID de session approprié 
    // lorsque l'ID de session n'est pas défini en raison d'un réseau instable.
    $new_session_id = session_create_id('YapoAuth-');
    $_SESSION['new_session_id'] = $new_session_id;
    
    // Définie le timestamp de destruction
    $_SESSION['destroyed'] = time();
    
    $_SESSION['YapoAuth'] = true;
    
    // Ecrit et ferme la session courante
    session_commit();

    // Démarre la session avec un nouvel ID
    session_id($new_session_id);
    
    // La nouvelle session n'en a pas besoin
    unset($_SESSION['destroyed']);
    unset($_SESSION['new_session_id']);
}

?>