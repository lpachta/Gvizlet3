<?php
$host = "sql109.infinityfree.com";
$user = "if0_40896557";
$pass = "7uJk1S0Jhx";
$db   = "if0_40896557_database";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) { die("Chyba: " . $conn->connect_error); }

$conn->set_charset("utf8mb4");

if (isset($_POST['submit'])) {
    $frontText = $_POST['frontText'];
    $backText = $_POST['backText'];
    $targetDir = "uploads/"; 

    function uploadImage($fileField, $targetDir) {
        if (!empty($_FILES[$fileField]['name'])) {
            $fileName = time() . "_" . basename($_FILES[$fileField]['name']);
            $targetFilePath = $targetDir . $fileName;
            if (move_uploaded_file($_FILES[$fileField]['tmp_name'], $targetFilePath)) {
                return $fileName;
            }
        }
        return null;
    }

    $frontImgName = uploadImage('frontImg', $targetDir);
    $backImgName = uploadImage('backImg', $targetDir);

    $stmt = $conn->prepare("INSERT INTO flashcards (frontText, backText, frontImg, backImg, starred) VALUES (?, ?, ?, ?, 0)");
    $stmt->bind_param("ssss", $frontText, $backText, $frontImgName, $backImgName);

    if ($stmt->execute()) {
        echo "Karta byla úspěšně vytvořena!";
    } else {
        echo "Chyba při ukládání: " . $conn->error;
    }

    $stmt->close();
}
$conn->close();
?>
