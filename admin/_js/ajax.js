function ajaxGet(url, callback){ // On envoie en paramètre l'url a atteindre, et une fonction "callback" qu'on va appeler en retour
    var req = new XMLHttpRequest();
    req.open("GET", url);
    
    req.addEventListener("load", function(){
        if(req.status >= 200 || req.status < 400){
            //On appelle la fonction callback en lui passant le résultat si ça a marché
            callback(req.responseText);
        } else{
            console.error(req.status + " " + req.statusText + " " + url);
        }
        
    });
    
    req.addEventListener("error", function(){
        console.error("Erreur réseau sur l'url: " + url);
    });
    
    req.send(null);
    
}

function ajaxPost(url, data, callback, isData){ //Execute un appel AJAX POST. Prend en parametre: l'url ou envoyer, les données à envoyer, et une fonction callback à appeler
    var req = new XMLHttpRequest(); //On créé un objet-requête
    
    req.open("post", url, true); //Qui cette fois contient une requête POST, mais toujours asynchrone

    req.addEventListener("load", function(){
        if(req.status >= 200 || req.status < 400){ //Si la requête atteint le serveur et s'éxécute
            //Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        }
        else{ //Si elle l'atteint mais n'arrive pas à s'éxécuter
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    
    req.addEventListener("error",function(){ //Si la requête n'atteint même pas le serveur
        console.error("Erreur réseau avec l'url: " + url);
    });
    
    //Ajout pour contrôler ou non si on envoie au format JSON
    if(isData){
        req.send(data);
    }
    else{
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
        req.send(data); //Seule différence avec la ajaxGet, cette fois on envoie bien les données au serveur
    }
}