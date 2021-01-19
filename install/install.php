<!DOCTYPE html>
<html>
    <head>
        <script src="admin/_js/ajax.js"></script>
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.css">
        <script type="application/javascript" charset="utf-8">
            function validEtap1(){
                var chpsVides = [];
                
                var dbInfos = [
                    {
                        'name': 'Nom d\'hôte',
                        'key': 'db_host',
                        'value': document.getElementById('db_host').value,
                    },
                    {
                        'name': 'Base de données',
                        'key': 'db_name',
                        'value': document.getElementById('db_name').value,
                    },
                    {
                        'name': 'Nom d\'utilisateur',
                        'key': 'db_login',
                        'value': document.getElementById('db_login').value,
                    },
                    {
                        'name': 'Mot de passe',
                        'key': 'db_mdp',
                        'value': document.getElementById('db_mdp').value,
                    },
                ];
                
                for(var i = 0; i < dbInfos.length; i++){
                    if(dbInfos[i].value === ""){
                        chpsVides.push(dbInfos[i].name);
                    }
                }
                
                if(chpsVides.length > 0){
                    alert('Tout ces champs sont obligatoires !\nMerci de bien vouloir remplir les champs suivants: \n'+chpsVides.toString());
                } else {
                    document.getElementById("msg_connexiondb").style.display="block";
                    
                    let formData = new FormData();
                    for(var i = 0; i < dbInfos.length; i++){
                        formData.set(dbInfos[i].key, dbInfos[i].value);
                    }
                    
                    ajaxPost("install/connectdb.php", formData, (retour) => {
                        console.log(retour);
                        
                        if(retour === "ok"){
                            document.getElementById("msg_connexiondb").textContent = "Connexion réussie !";
                            document.getElementById("msg_connexiondb").style.color="green";
                            
                            ajaxPost("install/crea_tables.php", formData, (retour) => {
                                console.log(retour);
                                
                                if(retour === "ok"){                       
                                    document.getElementById("etape2").style.display="block";

                                    document.getElementById("etape2").scrollIntoView({behavior:'smooth'});
                                }
                            }, true);
                        } else {
                            document.getElementById("msg_connexiondb").textContent = "Impossible de se connecter à la base de données";
                            document.getElementById("msg_connexiondb").style.color="red";
                        }
                    }, true);
                }
                
                console.log(dbInfos);
            }
            
            var verif_mdp = {
                'longueur':false,
                'special':false,
                'maj': false,
            };
            
            function watch_mdp(value){
                var verif_loginMdp = document.getElementsByClassName("verif_loginMdp");
                
                if(value.length > 8){
                    verif_loginMdp[0].style.color = "green";
                    verif_mdp.longueur = true;
                } else {
                    verif_loginMdp[0].style.color = "red";
                    verif_mdp.longueur = false;
                }

                var regSpecial = /[!@#$%^&*(),.?":{}|<>]/;
                if(regSpecial.test(value)){
                    verif_loginMdp[1].style.color = "green";
                    verif_mdp.special = true;
                } else {
                    verif_loginMdp[1].style.color = "red";
                    verif_mdp.special = false;
                }

                var regMaj = /.*[A-Z]/;
                if(regMaj.test(value)){
                    verif_loginMdp[2].style.color = "green";
                    verif_mdp.maj = true;
                } else {
                    verif_loginMdp[2].style.color = "red";
                    verif_mdp.maj = false;
                }
            }
            
            function validEtap2(){
                var chpsVides = [];
                
                var adminInfos = [
                    {
                        'name': 'Identifiant administrateur',
                        'key': 'login',
                        'value': document.getElementById('admin_login').value,
                    },
                    {
                        'name': 'Mot de passe administrateur',
                        'key': 'mdp',
                        'value': document.getElementById('admin_mdp').value,
                    },
                    {
                        'name': 'Adresse de votre site',
                        'key': 'url',
                        'value': document.getElementById('admin_url').value,
                    },
                    {
                        'name': 'Titre de votre site',
                        'key': 'titre',
                        'value': document.getElementById('admin_titre').value,
                    },
                ];
                
                for(var i = 0; i < adminInfos.length; i++){
                    if(adminInfos[i].value === ""){
                        chpsVides.push(adminInfos[i].name);
                    }
                }
                
                if(chpsVides.length > 0){
                    alert('Tout ces champs sont obligatoires !\nMerci de bien vouloir remplir les champs suivants: \n'+chpsVides.toString());
                } else {
                    var msgAdmin = document.getElementById("msg_infosAdmin");
                    msgAdmin.style.display = "block";

                    if(verif_mdp.longueur && verif_mdp.maj && verif_mdp.special){
                        console.log("mdp OK!");

                        if(document.getElementById("admin_login").value !== ""){
                            console.log("login OK!");

                            var regUrl = /^(http\:\/\/|https\:\/\/)/;
                            if(regUrl.test(document.getElementById("admin_url").value)){
                                console.log('URL OK!');

                                if(document.getElementById("admin_titre") !== ""){
                                    console.log("titre OK!");

                                    let formData = new FormData();
                                    formData.set('login',document.getElementById("admin_login").value);
                                    formData.set('mdp',document.getElementById("admin_mdp").value);
                                    formData.set('url',document.getElementById("admin_url").value);
                                    formData.set('titre',document.getElementById("admin_titre").value);
                                    ajaxPost("install/popul_infos_admin.php", formData, (retour) =>{
                                        console.log(retour);
                                        if(retour === "ok"){
                                            msgAdmin.style.color = "green";
                                            msgAdmin.textContent = "Infos enregistrées !";
                                            
                                            document.getElementById("etape3").style.display="block";

                                            document.getElementById("etape3").scrollIntoView({behavior:'smooth'});
                                            
                                        } else {
                                            msgAdmin.style.color = "red";
                                            msgAdmin.textContent = "Impossible d'enregistrer les infos !";
                                        }
                                    }, true);
                                } else {
                                    alert("Veuillez donner un titre à votre site !");
                                    msgAdmin.style.color = "red";
                                    msgAdmin.textContent = "Impossible d'enregistrer les infos !";
                                }
                            } else {
                                alert('L\'adresse de votre site doit impérativement être de la forme: "http://monsite.xy" ou "https://monsite.xy" ')
                                msgAdmin.style.color = "red";
                                msgAdmin.textContent = "Impossible d'enregistrer les infos !";
                            }
                        } else {
                            alert("Il y a un problème avec votre identifiant !");
                            msgAdmin.style.color = "red";
                            msgAdmin.textContent = "Impossible d'enregistrer les infos !";
                        }
                    } else {
                        alert("Votre mot de passe ne respecte pas les critères demandés !");
                        msgAdmin.style.color = "red";
                        msgAdmin.textContent = "Impossible d'enregistrer les infos !";
                    }
                }
            }
            
            function validEtap3(){
                ajaxPost("install/fin_install.php", "boum=boum", (retour) => {
                    document.location.reload(true);
                }, false);
            }
            
        </script>
    </head>
    <body>
        <div id="install">
            <div class="container">
                <h1>Installation de votre site avec Yapo</h1>

                <div id="etape1" class="form-group">
                    <h2>Première étape: votre base de données</h2>

                    <p>
                    Les informations concernant votre base de données sont essentielles au fonctionnement de votre site.<br>
                    Elles vous sont données par votre hébergeur et dépendant uniquement de lui.<br>
                    Si vous ne savez pas comment trouver ces informations, contactez le webmaster à l’adresse suivante: <a href="mailto:yapo@collectif8h30.fr">yapo@collectif8h30.fr</a>
                    </p>

                    <div class="my-2">
                        <label for="db_host">Nom d'hôte:</label>
                        <input type="text" name="db_host" id="db_host" class="form-control px-2" required>
                    </div>

                    <div class="my-2">
                        <label for="db_name">Base de données:</label>
                        <input type="text" name="db_name" id="db_name" class="form-control px-2" required>
                    </div>

                    <div class="my-2">
                        <label for="db_login">Nom d'utilisateur:</label>
                        <input type="text" name="db_login" id="db_login" class="form-control px-2" required>
                    </div>

                    <div class="my-2">
                        <label for="db_mdp">Mot de passe:</label>
                        <input type="password" name="db_mdp" id="db_mdp" class="form-control px-2" required>
                    </div>

                    <div class="row no-gutters border-top align-items-center">
                        <div class="my-2">
                            <button type="button" class="btn btn-primary" onclick="validEtap1()">Connexion à la base de données</button>
                        </div>

                        <div class="col ml-2" style="display:none;" id="msg_connexiondb">
                            Tentative de connexion à la base de données en cours...
                        </div>
                    </div>

                </div>
                
                <div id="etape2" class="form-group" style="display:none;">
                    <h2>Deuxième étape: vos identifiants</h2>
                    
                    <p>
                        Vous devez choisir l'identifiant et le mot de passe qui vous permettront d'accéder à la partie gestion de votre site.<br>
                        Yapo a également besoin de savoir quelle est l'adresse de votre site: c'est le nom de domaine que vous venez d'acheter, sous la forme http://monsite.fr
                    </p>
                    
                    <div class="my-2">
                        <label for="admin_login">Identifiant administrateur:</label>
                        <input type="text" id="admin_login" name="admin_login" class="form-control px-2" placeholder="Insérez votre login" required>
                    </div>
                    
                    <div class="my-2">
                        <label for="admin_mdp">Mot de passe administrateur:</label>
                        <input type="text" id="admin_mdp" name="admin_mdp" class="form-control px-2" placeholder="Insérez votre mot de passe" oninput="watch_mdp(this.value)" required>
                        <ul class="list-group list-group-flush small">
                            <li class="list-group-item verif_loginMdp" style="color:red">Au moins 8 caractères</li>
                            <li class="list-group-item verif_loginMdp" style="color:red">Au moins 1 caractère spécial</li>
                            <li class="list-group-item verif_loginMdp" style="color:red">Au moins 1 majuscule</li>
                        </ul>
                    </div>
                    
                    <div class="my-2">
                        <label for="admin_url">Adresse de votre site:</label>
                        <input type="text" name="admin_url" id="admin_url" class="form-control px-2" placeholder="http://monsite.fr" required>
                    </div>
                    
                    <div class="my-2">
                        <label for="admin_titre">Le titre de votre site:</label>
                        <input type="text" name="admin_titre" id="admin_titre" class="form-control px-2" placeholder="Mon site" required>
                    </div>
                    
                    <div class="row no-gutters border-top align-items-center">
                        <div class="my-2">
                            <button type="button" class="btn btn-primary" onclick="validEtap2()">Enregistrement des infos</button>
                        </div>

                        <div class="col ml-2" style="display:none;" id="msg_infosAdmin">
                            Enregistrement des infos en cours...
                        </div>
                    </div>
                </div>
                
                <div id="etape3" class="form-group" style="display:none;">
                    <h2>Et voilà ! Votre site est désormais opérationnel !</h2>
                    
                    <p>
                        <strong><em>Toutefois</em></strong> Lorsque vous cliquerez sur le gros bouton vert situé plus bas, cette page s'autodétruira, alors prenez encore quelques secondes pour lire ce qui suit:
                    </p>
                    <ul class="list-group">
                        <li class="list-group-item">
                            <strong>Comment gérer votre site :</strong><br>
                            Pour publier du contenu et de personnaliser vos informations, rendez-vous à l'adresse suivante : <br><em>adressedevotresite.xy<strong>/admin</strong></em><br>
                            Connectez-vous, et vous voilà arrivé.e dans la partie gestion, ou admin, de Yapo. Des explications plus détaillées de chaque fonctionnalité vous y attendent.
                        </li>
                        <li class="list-group-item">
                            <strong>Personnalisez votre site :</strong><br>
                            Par défaut, votre page d'accueil affiche un texte standard, et la partie <em>à propos</em> de votre site n'attend que vous pour connaître vos adresses et réseaux pour pouvoir les afficher au monde entier.<br>
                            <strong><em>Prenez le temps d'aller les personnaliser !</em></strong><br>
                            C'est ainsi que vos visiteurs pourront savoir plus facilement et immédiatement qui vous êtes !
                        </li>
                        <li class="list-group-item">
                            <strong>N'hésitez pas à demander !</strong><br>
                            Yapo est conçu pour être le système le plus simple possible. Néanmoins, gérer un site web reste quelque chose d'un peu compliqué, et certaines options pourront vous demander un petit temps d'adaptation.<br>
                            Si vous avez le moindre problème, ou pour faire remonter un bug, n'hésitez pas à envoyer un mail à <a href="mailto:yapo@collectif8h30.fr">yapo@collectif8h30.fr</a> !<br>
                        </li>
                    </ul>
                    
                    <div class="my-2">
                        <button type="button" class="btn btn-success" onclick="validEtap3()">Finir l'installation !</button>
                    </div>
                </div>
                    
            </div>
        </div>
    </body>
    <!--<script src="install/install.js"></script>-->
</html>
