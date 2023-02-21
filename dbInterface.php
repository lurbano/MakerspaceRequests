<?php

    // Get POST data (json)
    $json = file_get_contents('php://input');
    // Converts it into a PHP object
    $input = json_decode($json);

    //echo json_encode($input->action);

    $data = [];

    if (!empty($input->action)){
        // if ($input->action == "getNewID"){
        //     $data["id"] = trim(`echo -e '{}' | python dbInterface.py`);
        // }
        $descriptorspec = array(
            0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
            1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
            2 => array("file", "/tmp/error-output.txt", "a") // stderr is a file to write to
         );
        $process = proc_open('python dbInterface.py', $descriptorspec, $pipes, null, null);
        if (is_resource($process)) {
            // $pipes now looks like this:
            // 0 => writeable handle connected to child stdin
            // 1 => readable handle connected to child stdout
            // Any error output will be appended to /tmp/error-output.txt
        
            fwrite($pipes[0], $json);
            fclose($pipes[0]);
            $data['response'] = trim(stream_get_contents($pipes[1]));
            fclose($pipes[1]);
            $return_value = proc_close($process);
        }
    }

    echo json_encode($data);

    // $id = trim(`python dbMan.py -i '{}'`);
    // echo "{id: $id}";

?>
