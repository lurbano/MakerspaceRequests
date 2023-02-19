<?php

    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);
    //echo json_encode($_FILES);

    $upDir = "/var/www/html/MakerspaceRequests/uploads/";

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


    // // get information from the url parameters if one of the parameters in called 'name'
    // if (!empty($_GET['picoID'])){
        
    //     $_GET["time"] = time();
    //     //$_GET['saved'] = True;

    //     //save info to database file
    //     $dbFileName = 'pico_' . $_GET['picoID'] . '.json';

    //     $file = fopen($dbFileName, 'a');
    //     fwrite($file, json_encode($_GET)."\n");
    //     fclose($file);
    //     //send the information back as confimration
    //     echo json_encode($_GET);
    // } else {
    //     echo "DATA NOT SAVED";
        
    // }

    

?>
