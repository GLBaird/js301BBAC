<?php

session_start();

if ($_SESSION['userID'] != $_POST['userID']) {
    die("invalid-user");
}

if (!isset($_POST['moment']) || !isset($_POST['type'])) {
    die("missing-data");
}

if($_FILES["picture"]["error"][0] != UPLOAD_ERR_OK) {
    die("upload-error:".$_FILES["picture"]["error"][0]);
}

$tmp_name = $_FILES["picture"]["tmp_name"][0];
$new_name = "uploads/".time()."-".$_FILES["picture"]["name"][0];

move_uploaded_file($tmp_name, $new_name);

if (file_exists("moments.json")) {
    $moments = json_decode( file_get_contents("moments.json"), true );
} else {
    $moments = array();
}
    
if (!array_key_exists($_POST['userID'], $moments)) {
    $moments[$_POST['userID']] = array();
}


$moments[$_POST['userID']][] = array(
    "moment" => $_POST['moment'],
    "type" => $_POST['type'],
    "date" => time(),
    "picture" => $new_name
);

if (file_put_contents("moments.json", json_encode($moments)) === false) {
    die("file-write-error");
}

echo "success";

?>