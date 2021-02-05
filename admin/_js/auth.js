function auth(){
    var login = document.getElementById("admin_login");
    var mdp = document.getElementById("admin_mdp");
    
    let formData = new FormData();
    formData.set('login', login.value);
    formData.set('mdp', mdp.value);
    ajaxPost("_php/auth.php", formData, (retour) => {
        console.log(retour);
        switch(retour){
            case 'pepper':
                alert('Problème système avec le fichier Pepper.\nContactez le webmaster !');
                break;
            case 'bdd':
                alert('Problème système avec votre base de données.\nContactez le webmaster !');
                break;
            case 'login':
                alert('L\'identifiant que vous avez entré n\'est pas répertorié.');
                break;
            case 'mdp':
                alert('Le mot de passe que vous avez entré est erroné.');
                break;
            case 'ok':
                document.location.reload(true);
                break;
            default:
                alert('Une erreur est survenue.\nAvez-vous bien rempli les deux champs ?');
                break;
        }
    }, true);
}
