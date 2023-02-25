<?php


    // Get POST data (json)
    $json = file_get_contents('php://input');
    // Converts it into a PHP object
    $data = json_decode($json);

    // echo json_encode($data);
    // echo json_encode($data->name);
    //echo json_encode($_FILES);

    $upDir = "/var/www/html/MakerspaceRequests/uploads/";
    $fname = $upDir . $data->id ."/".$data->name;
    //echo $fname;

    //echo 'rmFile: ';

    if ($data->action == "remove"){
        $a = 1;
        //echo $fname;
        unlink($fname);
        echo "Removed " . $fname . ":" . $data->name;
        echo json_encode($data);
    }

    

?>
