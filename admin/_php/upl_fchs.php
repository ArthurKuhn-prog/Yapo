<?php
ini_set('session.use_strict_mode', 1);
require_once('sessions.php');
my_session_start();

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();
    
if($_SERVER['REQUEST_METHOD'] == "POST") {
    if(isset($_POST['prjt_cle']) && gettype($_POST['prjt_cle']) == 'string' && isset($_POST['prjt_cat']) && gettype($_POST['prjt_cat']) == 'string'){
        $prjt_cle = strip_tags($_POST['prjt_cle']);
        $prjt_cat = strip_tags($_POST['prjt_cat']);
        
        //Répertoire ou seront placés les images
        if(!is_dir('../../content/'.$prjt_cat.'/'.$prjt_cle)){ //Si le dossier n'existe pas encore
            mkdir('../../content/'.$prjt_cat.'/'.$prjt_cle, 0775, true); //On le créé
            $pathTo = '../../content/'.$prjt_cat.'/'.$prjt_cle.'/'; //Et on dit que c'est lui
        } else { //Sinon
            $pathTo = '../../content/'.$prjt_cat.'/'.$prjt_cle.'/'; //C'est lui, tout cimplement
        }
        
        $maxSize 	= '64'; //en Mo

        function cleanFileName ($chaine, $extension)
        {

            setlocale(LC_ALL, 'fr_FR');

            $chaine = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $chaine);

            $chaine = preg_replace('#[^0-9a-z]+#i', '-', $chaine);

            while(strpos($chaine, '--') !== false)
            {
                $chaine = str_replace('--', '-', $chaine);
            }

            $chaine = trim($chaine, '-');
            $chaine = strtolower($chaine);
            $chaine = preg_replace("@(-$extension)@", "", $chaine); //pour afficher l'extension
            return $chaine;
        }
        
        if($prjt_cle == "params"){
            $img_extsAutorisees = ['jpeg', 'jpg', 'JPG', 'png', 'gif']; //la liste des extensions autorisées
            $img_mimeAutorises = ['image/gif', 'image/jpg', 'image/JPG', 'image/jpeg', 'image/pjpeg', 'image/png']; //La liste des type MIME autorisés
        } else {
            $img_extsAutorisees = ['jpeg', 'jpg', 'JPG', 'png', 'gif', 'pdf']; //la liste des extensions autorisées
            $img_mimeAutorises = ['image/gif', 'image/jpg', 'image/JPG', 'image/jpeg', 'image/pjpeg', 'image/png', 'application/pdf']; //La liste des type MIME autorisés
        }

        $images = $_FILES['fichier'];
        
        $img_uploadExtension = strtolower(pathinfo($images['name'], PATHINFO_EXTENSION));//On récupère l'extension du fichier
        
        if(in_array($img_uploadExtension, $img_extsAutorisees)){ //Si l'extension fait partie des extensions autorisées
            //On va maintenant vérifier le type MIME
            $img_uploadMimeType = mime_content_type($images['tmp_name']); //On récupère le MIME du fichier
            
            //Pareil, in_array:
            if(in_array($img_uploadMimeType, $img_mimeAutorises)){ //Si le type MIME est bon
                //Si c'est assez petit (dernière vérif)
                if($images['size'] <= (1024* (1024 * $maxSize))){
                    $tmp = $images['tmp_name'];
                    if($prjt_cle != "params"){
                        if(move_uploaded_file($tmp, $pathTo.$images['name'])){
                            echo "ok";
                        } else {
                            echo "Erreur de chemin pour l'upload";
                        }
                    } else {
                        if(is_dir($pathTo)){
                            $objects = scandir($pathTo);
                            foreach ($objects as $object) { // pour chaque objet
                                if ($object != "." && $object != "..") {
                                    unlink($pathTo.$object);
                                }
                            }
                        }
                        
                        if(move_uploaded_file($tmp, $pathTo.$images['name'])){
                            echo true;
                        } else {
                            echo "Erreur de chemin pour l'upload";
                        }
                    }
                } else {
                    echo "Le fichier est trop gros. 64 Mo maximum par envoi !";
                }
            } else {
                echo "Type MIME non autorisé !";
            }
            
        } else { //Sinon
            echo "Extension non autorisée !";
        }
        
    }
}
} else {
    echo "session_prblm";
}
?>