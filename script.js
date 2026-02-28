let currentIndex = 0;
let showOnlyStarred = false;
let currentList = [...mojeKarty];

const cardInner = document.getElementById('cardInner');
const starBtn = document.getElementById('starBtn');

function updateUI() {
  // Reset otočení
  cardInner.classList.remove('is-flipped');

  const data = currentList[currentIndex];

  if (!data) {
    document.getElementById('fText').innerText = "Žádné karty";
    document.getElementById('bText').innerText = "";
    document.getElementById('fImg').style.display = "none";
    document.getElementById('bImg').style.display = "none";
    document.getElementById('counter').innerText = "0 / 0";
    starBtn.classList.remove('active');
    return;
  }

  // Texty
  document.getElementById('fText').innerText = data.frontText;
  document.getElementById('bText').innerText = data.backText;

  // Obrázky
  setupImage('fImg', data.frontImg);
  setupImage('bImg', data.backImg);

  // Hvězda
  if (data.starred) starBtn.classList.add('active');
  else starBtn.classList.remove('active');

  // Počítadlo
  document.getElementById('counter').innerText = `${currentIndex + 1} / ${currentList.length}`;
}

function setupImage(id, src) {
  const img = document.getElementById(id);
  if (src) {
    img.src = src;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }
}

function flipCard() {
  if (currentList.length > 0) cardInner.classList.toggle('is-flipped');
}

function nextCard() {
  if (currentIndex < currentList.length - 1) {
    currentIndex++;
    updateUI();
  }
}

function prevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    updateUI();
  }
}

function toggleStar() {
  const data = currentList[currentIndex];
  if (!data) return;

  data.starred = !data.starred;
  updateUI();
}

function toggleFilter() {
  showOnlyStarred = !showOnlyStarred;
  const btn = document.getElementById('filterBtn');

  if (showOnlyStarred) {
    currentList = mojeKarty.filter(k => k.starred);
    btn.classList.add('active');
    btn.innerText = "Zobrazit vše";
  } else {
    currentList = [...mojeKarty];
    btn.classList.remove('active');
    btn.innerText = "Pouze označené";
  }

  currentIndex = 0;
  updateUI();
}

// Spuštění při načtení
updateUI();
