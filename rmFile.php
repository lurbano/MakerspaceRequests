<?php


    // Get POST data (json)
    $json = file_get_contents('php://input');
    // Converts it into a PHP object
    $data = json_decode($json);

    $eData['type'] = 'remove';

    $upDir = "/var/www/html/MakerspaceRequests/uploads/";
    $fname = $upDir . $data->id ."/".$data->name;
    //echo $fname;

    //echo 'rmFile: ';

    if ($data->action == "remove"){
        $a = 1;
        //echo $fname;
        unlink($fname);
        $eData['fname'] = $fname;
        $eData['status'] = 'Removed';
        echo json_encode($eData);
        //echo "Removed " . $fname . ":" . $data->name;
        //echo json_encode($data);
    }

    

?>
