import { getCards, updateCardStar } from './database_service.js';

// --- KONFIGURACE A STAV ---
const state = {
  currentIndex: 0,
  showOnlyStarred: false,
  isShuffled: false,
  workingList: [], // Aktuálně aktivní balíček karet
  solvedIndexes: new Set(), // Použito pouze v test-view
  allCards: [],
};

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
  isTestView: document.body.classList.contains('test-view'),
  lBtn: document.getElementById('btn-l'),
  rBtn: document.getElementById('btn-r'),
  reloadBtn: document.getElementById('reload-btn'),
  btnWrong: document.getElementById('btn-wrong'),
  btnRight: document.getElementById('btn-right'),
};


/**
* Inicializace aplikace
*
* Nacte karty a prida event listenery.
*/
async function init() {
  // Načtení dat z PHP serveru
  const loadedCards = await getCards();
  state.allCards = loadedCards;
  if (loadedCards.length > 0) {
    refreshLists();
  }

  // Keybinds
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') nextCard();
    if (e.key === 'ArrowLeft') prevCard();
  });
  dom.cardInner.addEventListener("click", flipCard);
  dom.lBtn?.addEventListener("click", prevCard);
  dom.rBtn?.addEventListener("click", nextCard);
  dom.starBtn?.addEventListener("click", toggleStar);
  dom.shuffleBtn.addEventListener("click", toggleShuffle);
  dom.filterBtn.addEventListener("click", toggleFilter);
  dom.reloadBtn?.addEventListener("click", () => { location.reload() });
  dom.btnWrong?.addEventListener("click", () => { handleResult(false) });
  dom.btnRight?.addEventListener("click", () => { handleResult(true) });
}

/**
 * 
 * @param {seznam} loadedCards nactene karty, ktere se vyfiltruji
*/
function refreshLists() {
  // Filtrace a kopírování v jednom kroku
  state.workingList = (state.showOnlyStarred
    ? state.allCards.filter(k => k.starred)
    : [...state.allCards]);

  if (state.isShuffled) {
    state.workingList.sort(() => Math.random() - 0.5);
  }

  state.currentIndex = 0;
  state.solvedIndexes.clear();
  updateUI();
}

// --- 3. AKTUALIZACE UI ---
function updateUI() {
  if (!dom.cardInner) return;

  dom.cardInner.classList.remove('is-flipped');

  // Identifikace zbývajících karet (v Test módu filtrujeme vyřešené)
  const activePool = dom.isTestView
    ? state.workingList.filter((_, i) => !state.solvedIndexes.has(i))
    : state.workingList;

  // A. PRÁZDNÝ STAV
  if (activePool.length === 0) {
    toggleView(false);
    dom.fText.innerText = state.showOnlyStarred ? "Žádné hvězdičky" : "Prázdno";
    dom.bText.innerText = "";
    renderImage(dom.fImg, null);
    renderImage(dom.bImg, null);
    dom.counter.innerText = "0 / 0";
    if (dom.starBtn) dom.starBtn.style.visibility = "hidden";
    return;
  }

  // B. AKTIVNÍ STAV
  toggleView(true);
  if (dom.starBtn) dom.starBtn.style.visibility = "visible";

  // Určení aktuální karty
  // V Testu vždy bereme první z "activePool", v Indexu podle currentIndexu
  const activeCard = dom.isTestView ? activePool[0] : state.workingList[state.currentIndex];

  // Synchronizace globálního indexu (důležité pro toggleStar)
  state.currentIndex = state.workingList.indexOf(activeCard);

  // Vykreslení obsahu
  dom.fText.innerText = activeCard.frontText;
  dom.bText.innerText = activeCard.backText;
  renderImage(dom.fImg, activeCard.frontImg);
  renderImage(dom.bImg, activeCard.backImg);

  // Aktualizace stavu hvězdy a počítadla
  dom.starBtn?.classList.toggle('active', !!activeCard.starred);

  dom.counter.innerText = dom.isTestView
    ? `${activePool.length} zbývá`
    : `${state.currentIndex + 1} / ${state.workingList.length}`;
}

// --- 4. AKCE ---
function nextCard() {
  if (!dom.isTestView && state.currentIndex < state.workingList.length - 1) {
    state.currentIndex++;
    updateUI();
  }
}

function prevCard() {
  if (!dom.isTestView && state.currentIndex > 0) {
    state.currentIndex--;
    updateUI();
  }
}

function handleResult(knewIt) {
  if (knewIt) {
    state.solvedIndexes.add(state.currentIndex);
  } else {
    // Přesun na konec: vyjmout a vložit
    const [card] = state.workingList.splice(state.currentIndex, 1);
    state.workingList.push(card);
  }
  updateUI();
}

async function toggleStar() {
  const card = state.workingList[state.currentIndex];
  if (card) {
    card.starred = !card.starred;
    updateUI();

    // Odeslání změny do databáze
    //TODO: chyt chybu
    await updateCardStar(card.id, card.starred);
  }
}

function toggleShuffle() {
  state.isShuffled = !state.isShuffled;
  dom.shuffleBtn?.classList.toggle('active', state.isShuffled);
  dom.shuffleBtn.innerText = state.isShuffled ? "🔀 Náhodně" : "➡️ Pořadí";
  refreshLists();
}

function toggleFilter() {
  state.showOnlyStarred = !state.showOnlyStarred;
  dom.filterBtn?.classList.toggle('active', state.showOnlyStarred);
  dom.filterBtn.innerText = state.showOnlyStarred ? "⭐ Hvězdy" : "📁 Vše";
  refreshLists();
}

// --- POMOCNÉ FUNKCE ---
function renderImage(imgEl, src) {
  if (!imgEl) return;
  imgEl.src = src || "";
  imgEl.style.display = src ? "block" : "none";
}

function toggleView(showQuiz) {
  if (dom.quizContent) dom.quizContent.style.display = showQuiz ? "block" : "none";
  if (dom.finishMessage) dom.finishMessage.style.display = showQuiz ? "none" : "block";
}

function flipCard() {
  if (state.workingList.length > 0) dom.cardInner?.classList.toggle('is-flipped');
}

init();
