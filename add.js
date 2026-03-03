const dom = {
  addViewBtn: document.getElementById('add-view-btn'),
  addCardView: document.getElementById('add-card-view'),
  saveCardBtn: document.getElementById('save-card-btn'),
  cancelAddBtn: document.getElementById('cancel-add-btn'),
  frontInput: document.getElementById('frontText'),
  backInput: document.getElementById('backText'),
};


function init() {
  dom.addViewBtn?.addEventListener('click', () => toggleAddMode(true));
  dom.cancelAddBtn?.addEventListener('click', () => toggleAddMode(false));
}

function toggleAddMode(showAdd) {
  if (showAdd) {
    dom.quizContent.style.display = 'none';
    dom.addCardView.style.display = 'block';
    dom.finishMessage.style.display = 'none';
  } else {
    dom.addCardView.style.display = 'none';
    // refreshLists() zajistí, že se vrátíme do správného stavu prohlížení
    refreshLists();
  }
}
