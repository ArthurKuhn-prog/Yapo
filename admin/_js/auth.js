function auth(){
    var login = document.getElementById("admin_login");
    var mdp = document.getElementById("admin_mdp");
    
    let formData = new FormData();
    formData.set('login', login.value);
    formData.set('mdp', mdp.value);
    ajaxPost("_php/auth.php", formData, (retour) => {
        console.log(retour);
        if(retour === "ok"){
            document.location.reload(true);
        } else {
            alert('Mot de passe erroné !');
        }
    }, true);
}
