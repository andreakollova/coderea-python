/**
 * INITIALIZE FILTERED CARDS
 * Ensures filtered cards default to the provided array.
 */
export function initializeFilteredCards(cards) {
    return [...cards];
}

/**
 * FILTER CARDS BY CATEGORY
 * Filters cards based on the selected category.
 */
export function filterCardsByCategory(cards, category) {
    return cards.filter((card) => card.category === category);
}

/**
 * SHUFFLE CARDS
 * Randomizes the order of cards in an array.
 */
export function shuffleCards(cards) {
    const shuffled = [...cards]; // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * GET UNIQUE CATEGORIES
 * Retrieves a list of unique categories from the provided cards array.
 */
export function getUniqueCategories(cards) {
    const categories = cards.map((card) => card.category);
    return [...new Set(categories)];
}

/**
 * FILTER AND SHUFFLE BY MULTIPLE CATEGORIES
 * Filters cards that belong to the provided categories and shuffles them.
 */
export function filterAndShuffleByCategories(cards, categories) {
    const filtered = cards.filter((card) => categories.includes(card.category));
    return shuffleCards(filtered);
}
