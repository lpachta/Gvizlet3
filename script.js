// --- KONFIGURACE A STAV ---
let state = {
  currentIndex: 0,
  showOnlyStarred: false,
  isShuffled: false,
  masterList: [], // Filtrovaný základ (všechny nebo hvězdy)
  workingList: [], // To, co reálně vidíme (po zamíchání)
  solvedIndexes: new Set(), // Pro Test mód: indexy karet, které už "víme"
};

// --- ELEMENTY ---
const dom = {
  cardInner: document.getElementById('cardInner'),
  starBtn: document.getElementById('starBtn'),
  counter: document.getElementById('counter'),
  fText: document.getElementById('fText'),
  bText: document.getElementById('bText'),
  fImg: document.getElementById('fImg'),
  bImg: document.getElementById('bImg'),
  shuffleBtn: document.getElementById('shuffleBtn'),
  filterBtn: document.getElementById('filterBtn'),
  quizContent: document.getElementById('quiz-content'),
  finishMessage: document.getElementById('finish-message'),
  isTestView: document.body.classList.contains('test-view')
};

// --- 1. INICIALIZACE ---
function init() {
  // Načtení dat z data.js (mojeKarty)
  refreshLists();

  // Event listener pro klávesnici (šipky)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') nextCard();
    if (e.key === 'ArrowLeft') prevCard();
  });
}

// --- 2. LOGIKA DAT ---
function refreshLists() {
  // 1. Filtrování
  state.masterList = state.showOnlyStarred
    ? mojeKarty.filter(k => k.starred)
    : [...mojeKarty];

  // 2. Míchání
  state.workingList = [...state.masterList];
  if (state.isShuffled) {
    state.workingList.sort(() => Math.random() - 0.5);
  }

  state.currentIndex = 0;
  state.solvedIndexes.clear(); // Vždy resetujeme postup při změně filtru/míchání
  updateUI();
}

// --- 3. AKTUALIZACE UI ---
function updateUI() {
  if (!dom.cardInner) return;

  dom.cardInner.classList.remove('is-flipped');

  // Výpočet karet, které zbývají (jen pro test mód)
  const remainingCards = dom.isTestView
    ? state.workingList.filter((_, i) => !state.solvedIndexes.has(i))
    : state.workingList;

  if (remainingCards.length === 0) {
    showScreen(false);
    // Vymažeme starý obsah, aby tam nestrašil
    dom.fText.innerText = state.showOnlyStarred ? "Nemáš žádné označené karty" : "Seznam je prázdný";
    dom.bText.innerText = "";
    renderImage(dom.fImg, null);
    renderImage(dom.bImg, null);
    dom.counter.innerText = "0 / 0";
    // Skryjeme hvězdičku, když není co označovat
    if (dom.starBtn) dom.starBtn.style.visibility = "hidden";
    return;
  }

  showScreen(true);

  // Aktuální karta (v testu bereme první nevyřešenou, v indexu podle indexu)
  let activeCard;
  if (dom.isTestView) {
    // Najdeme první index, který není v solvedIndexes
    state.currentIndex = state.workingList.findIndex((_, i) => !state.solvedIndexes.has(i));
    activeCard = state.workingList[state.currentIndex];
  } else {
    activeCard = state.workingList[state.currentIndex];
  }

  // Vykreslení obsahu
  dom.fText.innerText = activeCard.frontText;
  dom.bText.innerText = activeCard.backText;
  renderImage(dom.fImg, activeCard.frontImg);
  renderImage(dom.bImg, activeCard.backImg);

  // Hvězda - explicitní nastavení třídy
  if (activeCard.starred) dom.starBtn.classList.add('active');
  else dom.starBtn.classList.remove('active');

  // Počítadlo (v testu: zbývá / celkem | v indexu: aktuální / celkem)
  dom.counter.innerText = dom.isTestView
    ? `${remainingCards.length} zbývá`
    : `${state.currentIndex + 1} / ${state.workingList.length}`;
}

// --- 4. AKCE ---
function nextCard() {
  if (state.currentIndex < state.workingList.length - 1) {
    state.currentIndex++;
    updateUI();
  }
}

function prevCard() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    updateUI();
  }
}

function handleResult(knewIt) {
  if (knewIt) {
    state.solvedIndexes.add(state.currentIndex);
  } else {
    // Pokud neví, karta zůstává, jen se "přeskočí" (posune na konec nevyřešených)
    // Jednoduchý trik: vyndat z pole a dát na konec
    const card = state.workingList.splice(state.currentIndex, 1)[0];
    state.workingList.push(card);
  }
  updateUI();
}

function toggleStar() {
  const card = state.workingList[state.currentIndex];
  if (card) {
    card.starred = !card.starred;
    updateUI();
  }
}

function toggleShuffle() {
  state.isShuffled = !state.isShuffled;
  dom.shuffleBtn.classList.toggle('active', state.isShuffled);
  dom.shuffleBtn.innerText = state.isShuffled ? "🔀 Náhodně" : "➡️ Pořadí";
  refreshLists();
}

function toggleFilter() {
  state.showOnlyStarred = !state.showOnlyStarred;
  dom.filterBtn.classList.toggle('active', state.showOnlyStarred);
  dom.filterBtn.innerText = state.showOnlyStarred ? "⭐ Pouze hvězdy" : "📁 Všechny";
  refreshLists();
}

// --- POMOCNÉ FUNKCE ---
function renderImage(imgEl, src) {
  if (src) { imgEl.src = src; imgEl.style.display = "block"; }
  else { imgEl.style.display = "none"; }
}

function showScreen(showQuiz) {
  if (!dom.quizContent || !dom.finishMessage) return;
  dom.quizContent.style.display = showQuiz ? "block" : "none";
  dom.finishMessage.style.display = showQuiz ? "none" : "block";
  if (!showQuiz) dom.fText.innerText = "Hotovo!";
}

function flipCard() {
  if (state.workingList.length > 0) dom.cardInner.classList.toggle('is-flipped');
}

init();
