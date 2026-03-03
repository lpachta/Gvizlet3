/**
* Zavola PHP request na server a vrati pole js objektu karet.
* 
* return [] nactene karty
*/
export async function getCards() {
  try {
    const response = await fetch('api.php');

    if (!response.ok) {
      throw new Error(`Server vrátil chybu: ${response.status}`);
    }

    const loadedCards = await response.json();

    // Převod 0/1 (string/number) na boolean
    const upraveneKarty = loadedCards.map(k => ({
      ...k,
      starred: Boolean(Number(k.starred))
    }));

    return upraveneKarty;

  } catch (err) {
    console.error("Chyba při načítání dat:", err);
    return [];
  }
}

/**
 * Univerzální funkce pro aktualizaci stavu hvězdičky v DB
 * @param {number|string} id - ID karty
 * @param {boolean} isStarred - Nový stav (true/false)
 */
export async function updateCardStar(id, isStarred) {
  try {
    const response = await fetch('api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Převádíme boolean zpět na 0/1 pro databázi, pokud to PHP vyžaduje
      body: JSON.stringify({
        id: id,
        starred: isStarred ? 1 : 0
      })
    });

    if (!response.ok) {
      throw new Error(`Server odpověděl chybou: ${response.status}`);
    }

    return await response.json(); // Vrátíme odpověď serveru (např. {success: true})
  } catch (err) {
    console.error("Chyba při ukládání do DB:", err);
    throw err; // Vyhodíme chybu dál, aby na ni mohl reagovat hlavní skript
  }
}


