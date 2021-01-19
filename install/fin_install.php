<?php

if(isset($_POST['boum']) && gettype($_POST['boum']) == "string"){
    $boum = strip_tags($_POST['boum']);
    
    if($boum == 'boum'){
        echo 'BAM'.PHP_EOL;
        
        $dir = '../install';
            if (is_dir($dir)) { //Si le dossier existe bien
                $objects = scandir($dir); // on scan le dossier pour récupérer ses objets
                foreach ($objects as $object) { // pour chaque objet
                    if ($object != "." && $object != "..") { // si l'objet n'est pas . ou ..
                        if (filetype($dir."/".$object) == "dir"){ //Si l'objet est lui-même un dossier
                            $dir_objects = scandir($dir."/".$object); //On le scanne à son tour
                            foreach($dir_objects as $dir_object){
                                unlink($dir."/".$object."/".$dir_object);
                            }
                            reset($dir_objects); // on remet à 0 les objets
                            rmdir($dir."/".$object);
                        } else unlink($dir."/".$object); // on supprime l'objet
                    }
                }

                reset($objects); // on remet à 0 les objets
                rmdir($dir); // on supprime le dossier
            }
    }
}

?>