<?php

    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);
    //echo json_encode($_FILES);

    $id = $_POST['id'];

    // $upDir = '/var/www/html/MakerspaceRequests/uploads/' . $id . "/";

    $upDir = "./uploads/$id/";

    if (!is_dir($upDir)){
        mkdir($upDir);
    }

    if (!empty($_FILES)) {
        $fname = $upDir . $_FILES['file']['name'];
        //echo $fname;
        /* Save the uploaded file to the local filesystem */
        if ( move_uploaded_file($_FILES['file']['tmp_name'], $fname) ) { 
            echo 'File Upload: Success'; 
        } else { 
            echo 'File Upload: Failure'; 
        }
    }
    //echo json_encode($_POST['id']);

?>
