<?php
header('Content-Type: application/json');
include_once('config.php');

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed"]));
}

// Načtení karet
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM cards");
    echo json_encode($result->fetch_all(MYSQLI_ASSOC));
}

// Aktualizace hvězdičky (pro toggleStar)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $starred = $data['starred'] ? 1 : 0;
    $conn->query("UPDATE cards SET starred = $starred WHERE id = $id");
    echo json_encode(["status" => "success"]);
}
?>
