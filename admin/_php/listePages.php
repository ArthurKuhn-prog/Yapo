<?php
    if(isset($_GET['id']) && gettype($_GET['id']) == "string"){
        if(isset($_GET['cat']) && gettype($_GET['cat']) == "string"){
            $id = strip_tags($_GET['id']);
            $cat = strip_tags($_GET['cat']);   
        }
    }
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title> - <?php echo $cat; ?></title>
        <script src="../../admin/_js/ajax.js"></script>
        <script src="../../admin/_js/vue.js"></script>
        <script src="../../_js/composantsPage.js"></script>
        <script src="https://unpkg.com/marked@0.3.6"></script>
        <link rel="stylesheet" type="text/css" href="../../bootstrap/css/bootstrap.css">
        <script src="../../lightbox/js/lightbox-plus-jquery.min.js"></script>
        <link rel="stylesheet" href="../../lightbox/css/lightbox.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500&display=swap" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="../../_css/style.css">
        <style>
        </style>
    </head>
    <body class="container-fluid">
        <p hidden id="id"><?php echo $id; ?></p>
        <p hidden id="cat"><?php echo $cat; ?></p>
        <div class="row">
            <?php require_once('../../_php/nav.php') ?>

            <div id="liste_pages_body">
            </div>
        </div>
        
        <div>
            <div id="footer">
            </div>
        </div>
    </body>
    <script src="../../_js/head.js"></script>
    <script src="../../_js/footer.js"></script>
    
    <?php 
    if(file_exists('listePageBody.js')){
        echo '<script src="listePageBody.js"></script>';
    } else {
        echo '<script src="../../_js/listePageBody.js"></script>';
    }
    ?>
    
</html>