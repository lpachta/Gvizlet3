<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once('config.php');

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) { die("Chyba: " . $conn->connect_error); }

$conn->set_charset("utf8mb4");

if (isset($_POST['submit'])) {
    $frontText = $_POST['frontText'];
    $backText = $_POST['backText'];
    $targetDir = "img/"; 

    function uploadImage($fileField, $targetDir) {
        if (!empty($_FILES[$fileField]['name'])) {
            $fileName = time() . "_" . basename($_FILES[$fileField]['name']);
            $targetFilePath = $targetDir . $fileName;
            if (move_uploaded_file($_FILES[$fileField]['tmp_name'], $targetFilePath)) {
                return $targetDir . $fileName;
            }
        }
        return null;
    }

    $frontImgName = uploadImage('frontImg', $targetDir);
    $backImgName = uploadImage('backImg', $targetDir);

    $stmt = $conn->prepare("INSERT INTO cards (frontText, backText, frontImg, backImg, starred) VALUES (?, ?, ?, ?, 0)");
    $stmt->bind_param("ssss", $frontText, $backText, $frontImgName, $backImgName);
    if ($stmt->execute()) {
        echo "<h2>Karta byla úspěšně vytvořena!</h2>";
        echo "<a href='add.html' style='padding:10px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;'>⬅ Zpět na přidávání</a>";
    } else {
        echo "Chyba při ukládání: " . $conn->error;
        echo "<br><a href='add.html'>Zkusit znovu</a>";
    }
    $stmt->close();
}
$conn->close();
?>
