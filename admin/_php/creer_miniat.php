<?php

ini_set('session.use_strict_mode', 1);
require_once('sessions.php');
my_session_start();

// Link image type to correct image loader and saver
// - makes it easier to add additional types later on
// - makes the function easier to read
const IMAGE_HANDLERS = [
    IMAGETYPE_JPEG => [
        'load' => 'imagecreatefromjpeg',
        'save' => 'imagejpeg',
        'quality' => 100
    ],
    IMAGETYPE_PNG => [
        'load' => 'imagecreatefrompng',
        'save' => 'imagepng',
        'quality' => 0
    ],
    IMAGETYPE_GIF => [
        'load' => 'imagecreatefromgif',
        'save' => 'imagegif'
    ]
];

if(isset($_SESSION['YapoAuth']) && $_SESSION['YapoAuth'] == true){
    
    my_session_regenerate_id();

//CETTE FONCTION DE CREATION DE THUMBNAIL A ETE ECRITE PAR Rik Schennink, PUBLIEE SUR LE SITE pqina.nl. MERCI A LUI!

/**
 * @param $src - a valid file location
 * @param $dest - a valid file target
 * @param $targetWidth - desired output width
 * @param $targetHeight - desired output height or null
 */
function createThumbnail($src, $dest, $targetWidth, $targetHeight = null) {

    // 1. Load the image from the given $src
    // - see if the file actually exists
    // - check if it's of a valid image type
    // - load the image resource

    // get the type of the image
    // we need the type to determine the correct loader
    $type = exif_imagetype($src);

    // if no valid type or no handler found -> exit
    if (!$type || !IMAGE_HANDLERS[$type]) {
        return null;
    }

    // load the image with the correct loader
    $image = call_user_func(IMAGE_HANDLERS[$type]['load'], $src);

    // no image found at supplied location -> exit
    if (!$image) {
        return null;
    }


    // 2. Create a thumbnail and resize the loaded $image
    // - get the image dimensions
    // - define the output size appropriately
    // - create a thumbnail based on that size
    // - set alpha transparency for GIFs and PNGs
    // - draw the final thumbnail

    // get original image width and height
    $width = imagesx($image);
    $height = imagesy($image);

    // maintain aspect ratio when no height set
    if ($targetHeight == null) {

        // get width to height ratio
        $ratio = $width / $height;

        // if is portrait
        // use ratio to scale height to fit in square
        if ($width > $height) {
            $targetHeight = floor($targetWidth / $ratio);
        }
        // if is landscape
        // use ratio to scale width to fit in square
        else {
            $targetHeight = $targetWidth;
            $targetWidth = floor($targetWidth * $ratio);
        }
    }

    // create duplicate image based on calculated target size
    $thumbnail = imagecreatetruecolor($targetWidth, $targetHeight);

    // set transparency options for GIFs and PNGs
    if ($type == IMAGETYPE_GIF || $type == IMAGETYPE_PNG) {

        // make image transparent
        imagecolortransparent(
            $thumbnail,
            imagecolorallocate($thumbnail, 0, 0, 0)
        );

        // additional settings for PNGs
        if ($type == IMAGETYPE_PNG) {
            imagealphablending($thumbnail, false);
            imagesavealpha($thumbnail, true);
        }
    }

    // copy entire source image to duplicate image and resize
    imagecopyresampled(
        $thumbnail,
        $image,
        0, 0, 0, 0,
        $targetWidth, $targetHeight,
        $width, $height
    );


    // 3. Save the $thumbnail to disk
    // - call the correct save method
    // - set the correct quality level

    // save the duplicate version of the image to disk
    return call_user_func(
        IMAGE_HANDLERS[$type]['save'],
        $thumbnail,
        $dest,
        IMAGE_HANDLERS[$type]['quality']
    );
}

if(isset($_POST['image']) && gettype($_POST['image']) == "string"){
    if(isset($_POST['cle']) && gettype($_POST['cle']) == "string"){
        if(isset($_POST['cat']) && gettype($_POST['cat']) == "string"){
            $img = strip_tags($_POST['image']);
            $cle = strip_tags($_POST['cle']);
            $cat = strip_tags($_POST['cat']);

            $width = 500;
            
            $ext = pathinfo($img, PATHINFO_EXTENSION);
            
            if($ext){
                if(is_dir('../../content/cat_'.$cat.'/'.$cle.'/thumbs')){
                    createThumbnail($img, '../../content/cat_'.$cat.'/'.$cle.'/thumbs/main.'.$ext, $width);
                    echo 'fichier créé: cat_'.$cat.'/'.$cle.'/thumbs/main.'.$ext.PHP_EOL;
                } else {
                    mkdir('../../content/cat_'.$cat.'/'.$cle.'/thumbs', 0775);
                    createThumbnail($img, '../../content/cat_'.$cat.'/'.$cle.'/thumbs/main.'.$ext, $width);
                    echo 'fichier créé: cat_'.$cat.'/'.$cle.'/thumbs/main.'.$ext.PHP_EOL;
                }
            } else {
                echo "pas d'extension".PHP_EOL;
            }
        } else {
            echo "pas de cat".PHP_EOL;
        }
    } else {
        echo "pas de clé".PHP_EOL;
    }
} else {
    echo "pas d'image".PHP_EOL;
}
    
}

?>