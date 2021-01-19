<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <script src="../../../admin/_js/ajax.js"></script>
        <script src="../../../admin/_js/vue.js"></script>
        <script src="../../../_js/composantsPage.js"></script>
        <script src="https://unpkg.com/marked@0.3.6"></script>
        <script src="../../../lightbox/js/lightbox-plus-jquery.min.js"></script>
        <link rel="stylesheet" type="text/css" href="../../../bootstrap/css/bootstrap.css">
        <link rel="stylesheet" href="../../../lightbox/css/lightbox.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500&display=swap" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="../../../_css/style.css">
    </head>
    <body class="container-fluid">
        <div hidden id="cle"><?php echo $cle ?></div>
        <div hidden id="cat"><?php echo $cat ?></div>
        
        <div class="row">
            
            <?php require_once('../../../_php/nav.php') ?>

            <div id="page_body">
            </div>
            
        </div>
        
        <div>
            <div id="footer">
            </div>
        </div>
    </body>
    <script src="../../../_js/head.js"></script>
    <script src="../../../_js/footer.js"></script>
    
    <?php 
    if(file_exists('pageBody.js')){
        echo '<script src="pageBody.js"></script>';
    } else {
        echo '<script src="../../../_js/pageBody.js"></script>';
    }
    ?>
    
</html>