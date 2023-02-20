<?php
    $data = [];
    $data["id"] = trim(`python dbMan.py -i '{}'`);
    echo json_encode($data);
?>
