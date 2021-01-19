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
    
if(isset($_POST['prjt_cat']) && gettype($_POST['prjt_cat']) == "string"){
    if(isset($_POST['prjt_cle']) && gettype($_POST['prjt_cle']) == "string"){
        require_once("connexiondb.php");
        
        $cat = strip_tags($_POST['prjt_cat']);
        $cle = strip_tags($_POST['prjt_cle']);
        
        $verif = $bdd->prepare('SELECT * FROM `'.$cat.'` WHERE prjt_cle = "'.$cle.'" ');
        $verif->execute();

        $foo = $verif->fetch();

        if($foo){
            //On supprime de la bdd
            $requete = $bdd->prepare('DELETE from `'.$cat.'` WHERE prjt_cle = "'.$cle.'" ');
            $requete->execute();
            $requete->closeCursor();
            
            echo 'bdd nettoyée'.PHP_EOL;
            
            //Et les fichiers du serveur
            $dir = '../../content/'.$cat.'/'.$cle;
            if (is_dir($dir)) { //Si le dossier existe bien
                echo 'il y a un dossier'.PHP_EOL;
                _imagecache_recursive_delete($dir);
                
                echo 'dossier supprimé'.PHP_EOL;
            } else {
                echo 'Pas de dossier à supprimer'.PHP_EOL;
            }
            
            if($cat != "cat_actu"){
                $sitemap = '../../sitemap.txt';

                $lines = file($sitemap);
                foreach($lines as $index => $line){

                    if(stristr($line, $cle)){
                        unset($lines[$index]);
                    }
                }
                unset($line);

                file_put_contents($sitemap, $lines);
            }
            
        } else {
            echo "pas de projet correspondant dans la bdd";
        }
    }
}
}
?>