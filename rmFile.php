<?php


    // Get POST data (json)
    $json = file_get_contents('php://input');
    // Converts it into a PHP object
    $data = json_decode($json);

    // echo json_encode($data);
    // echo json_encode($data->name);
    //echo json_encode($_FILES);

    $upDir = "/var/www/html/MakerspaceRequests/uploads/";
    $fname = $upDir . $data->name;
    //echo $fname;

    //echo 'rmFile: ';

    if ($data->action == "remove"){
        $a = 1;
        //echo $fname;
        unlink($fname);
        echo "Removed " . $data->name;
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
