<?php
// --- KONFIGURACE (Doplň své údaje z InfinityFree) ---
$host = 'sqlXXX.infinityfree.com';
$db   = 'if0_XXXXXX_databaze';
$user = 'if0_XXXXXX';
$pass = 'tvoje_heslo';

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8");

$message = "";

// Zpracování formuláře po odeslání
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fText = $conn->real_escape_string($_POST['frontText']);
    $bText = $conn->real_escape_string($_POST['backText']);
    $fImg  = $conn->real_escape_string($_POST['frontImg']);
    $bImg  = $conn->real_escape_string($_POST['backImg']);

    $sql = "INSERT INTO cards (frontText, backText, frontImg, backImg) VALUES ('$fText', '$bText', '$fImg', '$bImg')";
    
    if ($conn->query($sql)) {
        $message = "<div style='color: green;'>Karta úspěšně přidána! ✅</div>";
    } else {
        $message = "<div style='color: red;'>Chyba: " . $conn->error . "</div>";
    }
}
?>

<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <title>Admin - Přidat kartu</title>
    <style>
        body { font-family: sans-serif; background: #f0f2f5; display: flex; justify-content: center; padding: 50px; }
        .form-card { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
        button:hover { background: #1d4ed8; }
        .back-link { display: block; margin-top: 15px; text-align: center; color: #6b7280; text-decoration: none; font-size: 0.9rem; }
    </style>
</head>
<body>

<div class="form-card">
    <h2>Nová karta 📖</h2>
    <?php echo $message; ?>
    <form method="POST">
        <label>Přední text (Otázka):</label>
        <input type="text" name="frontText" required placeholder="Např. Pes">
        
        <label>Zadní text (Odpověď):</label>
        <input type="text" name="backText" required placeholder="Např. Dog">
        
        <label>URL obrázku vepředu (volitelné):</label>
        <input type="text" name="frontImg" placeholder="https://... nebo img/pes.jpg">
        
        <label>URL obrázku vzadu (volitelné):</label>
        <input type="text" name="backImg" placeholder="https://...">
        
        <button type="submit">Uložit kartu</button>
    </form>
    <a href="index.html" class="back-link">← Zpět na zkoušení</a>
</div>

</body>
</html>