<!DOCTYPE html>
<html lang="cs">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Přidání karty</title>
  <link rel="stylesheet" href="main.css">
  <link rel="stylesheet" href="add.css">
</head>

<body class="add-view">
  <nav class="view-switch">
    <a href="index.html" class="nav-link">📖 Prohlížení</a>
    <a href="test.html" class="nav-link">🧠 Testování</a>
    <a href="add.html" class="nav-link ">+ Přidání karty</a>
    <a href="list.php" class="nav-link active">🗑️ Seznam karet</a>
  </nav>

  <div class="card-list">
    

  <?php 
  include_once('config.php');
  $conn = new mysqli($host, $user, $pass, $db);
  $conn->set_charset("utf8mb4");

  $result = $conn->query("SELECT * FROM cards");

  if($result){
      while($row = $result->fetch_assoc()){
          echo <<<HTML
          <div class="card-item">
              <div class="card-info">
                  <strong>{$row['frontText']}</strong>
                  <img src="{$row['frontImg']}">
                  <strong>|</strong>
                  <strong>{$row['backText']}</strong>
                  <img src="{$row['backImg']}">

              </div>
              <form action="delete.php" method="POST" onsubmit="return confirm('Opravdu chcete kartu smazat?');">
                  <input type="hidden" name="id" value="{$row['id']}">
                  <input type="hidden" name="frontImg" value="{$row['frontImg']}">
                  <input type="hidden" name="backImg" value="{$row['backImg']}">

                  <button type="submit" name="delete" class="btn-delete">
                      🗑️ Smazat
                  </button>
              </form>
          </div>
  HTML;
      }
  } else {
      echo "<p>CHYBA: " . $conn->error . "</p>";
  }
  ?>
  </div>
</body>

</html>
