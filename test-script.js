let currentIndex = 0;
let showOnlyStarred = false;
let isShuffled = false;
let currentList = [];

const cardInner = document.getElementById('cardInner');

// Inicializace: vezmeme data a připravíme test
function initTest() {
  let list = showOnlyStarred ? mojeKarty.filter(k => k.starred) : [...mojeKarty];
  if (isShuffled) {
    list = list.sort(() => Math.random() - 0.5);
  }
  currentList = list;
  currentIndex = 0;
  updateUI();
}

function updateUI() {
  cardInner.classList.remove('is-flipped');

  if (currentList.length === 0) {
    document.getElementById('quiz-content').style.display = "none";
    document.getElementById('finish-message').style.display = "block";
    return;
  }

  const data = currentList[currentIndex];
  document.getElementById('fText').innerText = data.frontText;
  document.getElementById('bText').innerText = data.backText;

  setupImage('fImg', data.frontImg);
  setupImage('bImg', data.backImg);

  const starBtn = document.getElementById('starBtn');
  starBtn.classList.toggle('active', data.starred);

  document.getElementById('counter').innerText = `${currentIndex + 1} / ${currentList.length}`;
}

function handleResult(knewIt) {
  if (knewIt) {
    // Pokud věděl, vyřadíme kartu ze seznamu pro tento pokus
    currentList.splice(currentIndex, 1);
    // Pokud jsme byli na poslední kartě, posuneme se na novou poslední
    if (currentIndex >= currentList.length) currentIndex = 0;
  } else {
    // Pokud nevěděl, jen skočíme na další kartu v pořadí
    currentIndex = (currentIndex + 1) % currentList.length;
  }
  updateUI();
}

// Ostatní funkce zůstávají podobné
function flipCard() { cardInner.classList.toggle('is-flipped'); }

function toggleStar() {
  currentList[currentIndex].starred = !currentList[currentIndex].starred;
  updateUI();
}

function toggleShuffle() {
  isShuffled = !isShuffled;
  document.getElementById('shuffleBtn').classList.toggle('active', isShuffled);
  document.getElementById('shuffleBtn').innerText = isShuffled ? "🔀 Náhodně: ZAP" : "🔀 Náhodně: VYP";
  initTest();
}

function toggleFilter() {
  showOnlyStarred = !showOnlyStarred;
  document.getElementById('filterBtn').classList.toggle('active', showOnlyStarred);
  document.getElementById('filterBtn').innerText = showOnlyStarred ? "Zobrazit vše" : "Pouze označené";
  initTest();
}

function setupImage(id, src) {
  const img = document.getElementById(id);
  if (src) { img.src = src; img.style.display = "block"; }
  else { img.style.display = "none"; }
}

initTest();
