<?php

    // Get POST data (json)
    $json = file_get_contents('php://input');
    // Converts it into a PHP object
    $data = json_decode($json);

    echo $json;

    // $id = trim(`python dbMan.py -i '{}'`);
    // echo "{id: $id}";

?>
