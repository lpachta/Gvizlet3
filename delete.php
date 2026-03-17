<?php
error_reporting(E_ALL);
//ini_set('display_errors', 1);

include_once('config.php');

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) { die("Chyba připojení: " . $conn->connect_error); }

$conn->set_charset("utf8mb4");

if (isset($_POST['delete'])) {
    $id = intval($_POST['id']);
    $imageDir = "img/";
    $frontImg = $imageDir . basename($_POST['frontImg']);
    $backImg  = $imageDir . basename($_POST['backImg']);

    $stmt = $conn->prepare("DELETE FROM cards WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if (file_exists($frontImg)) { unlink($frontImg); }
        if (file_exists($backImg)) { unlink($backImg); }

        echo "<h2>Karta byla úspěšně odstraněna!</h2>";
        echo "<a href='list.php' style='padding:10px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;'>⬅ Zpět na seznam karet</a>";
    } else {
        echo "Chyba při mazání z databáze: " . $stmt->error;
        echo "<br><a href='add.html'>Zkusit znovu</a>";
    }
    
    $stmt->close();
}

$conn->close();
?>
