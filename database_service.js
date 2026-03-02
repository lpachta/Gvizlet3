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
