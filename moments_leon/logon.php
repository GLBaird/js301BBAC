<?php

session_start();

if (!isset($_POST['type'])
    || !isset($_POST['username'])
    || !isset($_POST['password'])) {
    die("missing-data");
}

if (file_exists("users.json")) {
    $users = json_decode (file_get_contents("users.json") );    
} else {
    $users = array();
}


if ($_POST['type'] == "logon") {
    
    foreach($users as $user) {
        
        if ($user['name'] == $_POST['username']
            && $user['password'] == $_POST['password']) {
            $_SESSION['userID'] = $user['userID'];
            die("valid-user");
        } elseif ($user['name'] == $_POST['username']) {
            die("wrong-password");
        }
        
    }
    
    die("invalid-user");
    
} elseif ($_POST['type'] == "new") {
    $users[] = array(
        "name" => $_POST['username'],
        "password" => $_POST['password'],
        "userID" => time()
    );
    
    if (file_put_contents("users.json", json_encode($users)) === false) {
        die ("write-error");
    }
    
    die("success");
} else {
    die("unknown-type");
}

?>