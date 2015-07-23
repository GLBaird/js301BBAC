<?php

session_start();

if ($_SESSION['userID'] != $_POST['userID']) {
    die("invalid-user");
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

if (file_exists("moments.json")) {
    $moments = json_decode( file_get_contents("moments.json"), true );

    if (array_key_exists($_POST['userID'], $moments)) {
        $list = $moments[$_POST['userID']];
        echo json_encode($list);
        die();
    }
    
} 


echo json_encode(array());


?>