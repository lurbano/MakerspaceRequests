<?php

    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);
    //echo json_encode($_FILES);

    $id = $_POST['id'];

    $convertables = ["jpg", "png"];

    $upDir = "./jobs/$id/uploads/";
    if (!is_dir($upDir)){
        mkdir($upDir);
    }

    $data['type'] = 'upload';

    if (!empty($_FILES)) {
        $fname = $upDir . $_FILES['file']['name'];
        $ext = pathinfo($fname, PATHINFO_EXTENSION);
        //echo $fname;
        /* Save the uploaded file to the local filesystem */
        if ( move_uploaded_file($_FILES['file']['tmp_name'], $fname) ) { 
            //echo 'File Upload: Success'; 
            $data['status'] = 'Success';
            if (in_array(strtolower($ext), $convertables)) {
                //echo "conveting ".$ext. " ";
                $tname = $upDir . "th_". $_FILES['file']['name'];
                $cmd = 'convert '.$fname.' -resize 100x100 '.$tname;
                $thcvt = system($cmd);
                //echo $thcvt;
                $data['msg'] = file_exists($tname);
            }

            
        } else { 
            $data['status'] = 'Failure';
            $data['error'] = $_FILES['file']['error'];
            // echo 'File Upload: Failure, #' . $_FILES['file']['error']; 
            
        }
    }
    echo json_encode($data);
    //echo json_encode($_POST['id']);

?>
