<?php

    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);
    //echo json_encode($_FILES);

    $id = $_POST['id'];

    $convertables = ["jpg", "png"];

    $upDir = "./uploads/$id/";
    if (!is_dir($upDir)){
        mkdir($upDir);
    }

    if (!empty($_FILES)) {
        $fname = $upDir . $_FILES['file']['name'];
        $ext = pathinfo($fname, PATHINFO_EXTENSION);
        //echo $fname;
        /* Save the uploaded file to the local filesystem */
        if ( move_uploaded_file($_FILES['file']['tmp_name'], $fname) ) { 
            echo 'File Upload: Success'; 
            if (in_array(strtolower($ext), $convertables)) {
                echo "conveting ".$ext. " ";
                $tname = $upDir . "th_". $_FILES['file']['name'];
                $cmd = 'convert '.$fname.' -resize 100x100 '.$tname;
                $thcvt = system($cmd);
                echo $thcvt;
            }
            
        } else { 
            echo 'File Upload: Failure, #' . $_FILES['file']['error']; 
        }
    }
    //echo json_encode($_POST['id']);

?>
