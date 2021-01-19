<?php
ini_set('session.use_strict_mode', 1);
require_once('sessions.php');
my_session_start();

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();
    
function _imagecache_recursive_delete($dir) {
  $d = dir($dir);  
  if (is_dir($dir) && !is_link($dir)) {
    if ($d = opendir($dir)) {
      while (($entry = readdir($d)) !== false) {
        if ($entry == '.' || $entry == '..') continue;
        $path = $dir .'/'. $entry;
        if (is_file($path)) unlink($path);
        if (is_dir($path)) _imagecache_recursive_delete($path);
      }
      closedir($d);
    }
    return rmdir($dir);
  }
  return unlink($dir);
}

if(isset($_POST['cat']) && gettype($_POST['cat']) == "string"){
    if(isset($_POST['id']) && gettype($_POST['id']) == "string"){
        require_once('connexiondb.php');
        
        $cat = strip_tags($_POST['cat']);
        $id = strip_tags($_POST['id']);
        
        //On vérifie u'il n'existe pas déjà un projet avec cette clé
        $verif = $bdd->prepare('SELECT * FROM `liste_cats` WHERE id = "'.$id.'" ');
        $verif->execute();

        $foo = $verif->fetch();
        
        if($foo){
            $requete = $bdd->prepare('DELETE from `liste_cats` WHERE id = "'.$id.'"');
            $requete->execute();
            $requete->closeCursor();
            
            echo "plus dans la liste".PHP_EOL;
            
            $requete = $bdd->prepare('DROP TABLE `cat_'.$id.'`');
            $requete->execute();
            $requete->closeCursor();
            
            echo "y a plus sa table".PHP_EOL;
            
            //Et les fichiers du serveur
            $dir = '../../content/cat_'.$id;
            if (is_dir($dir)) { //Si le dossier existe bien
                echo 'il y a un dossier'.PHP_EOL;
                
                _imagecache_recursive_delete($dir);
                
                echo 'dossier supprimé'.PHP_EOL;
                
                $sitemap = '../../sitemap.txt';

                $lines = file($sitemap);
                foreach($lines as $index => $line){

                    if(stristr($line, 'cat_'.$id)){
                        unset($lines[$index]);
                    }
                }
                unset($line);

                file_put_contents($sitemap, $lines);
            } else {
                echo 'Pas de dossier à supprimer'.PHP_EOL;
            }
        }
    }
}
} else {
    echo "session_prblm";
}
?>