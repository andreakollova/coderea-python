/**
 * VARIABLES
 */
const wishlist = new Set(); // Wishlist tracking
const favorites = new Set(); // Favorites tracking

/**
 * SELECT HTML ELEMENTS
 */
const wishlistGrid = document.querySelector('.wishlist-grid');
const wishlistTitle = document.querySelector('.wishlist h2');

/**
 * SAVE STATE TO LOCAL STORAGE
 */
function saveStateToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify([...wishlist]));
    localStorage.setItem('favorites', JSON.stringify([...favorites]));
}

/**
 * LOAD STATE FROM LOCAL STORAGE
 */
export function loadStateFromLocalStorage(cards) {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    wishlist.clear();
    favorites.clear();
    savedWishlist.forEach(id => wishlist.add(id));
    savedFavorites.forEach(id => favorites.add(id));

    populateWishlist(cards); // Populate "Moje Tréningy" section
    toggleWishlistTitleVisibility(); // Ensure correct visibility
}

/**
 * TOGGLE WISHLIST (HEART)
 */
export function toggleWishlist(card) {
    const cardId = card.id;
    if (wishlist.has(cardId)) {
        wishlist.delete(cardId);
        removeFromWishlist(cardId);
    } else {
        wishlist.add(cardId);
        addToWishlist(card);
    }
    toggleWishlistTitleVisibility();
    updateWishlistUI(cardId);
    saveStateToLocalStorage(); // Save state after toggling
}

/**
 * TOGGLE FAVORITES (STAR)
 */
export function toggleFavorites(card) {
    const cardId = card.id;
    if (favorites.has(cardId)) {
        favorites.delete(cardId);
    } else {
        favorites.add(cardId);
    }
    updateFavoritesUI(cardId);
    saveStateToLocalStorage(); // Save state after toggling
}

/**
 * ADD CARD TO WISHLIST GRID
 */
function addToWishlist(card) {
    const wishlistCard = document.createElement('li');
    wishlistCard.setAttribute('data-id', card.id);

    // Generate category tag with icon dynamically
    const categoryTag = `
        <span class="card-category">
            <img src="./icons/${card.category}.svg" alt="${card.category} Icon" class="category-icon"> ${card.category}
        </span>
    `;

    wishlistCard.innerHTML = `
        <h3>${card.title}</h3>
        ${categoryTag}
        <img src="${card.img_url}" alt="${card.title}" style="max-width: 100%; height: auto;">
        <p>${card.content}</p>
        <span class="wishlist-star ${favorites.has(card.id) ? 'active' : ''}" data-id="${card.id}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
        </span>
        <span class="wishlist-heart ${wishlist.has(card.id) ? 'active' : ''}" data-id="${card.id}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        </span>
    `;

    wishlistGrid.appendChild(wishlistCard);

    // Add event listeners for heart and star icons
    wishlistCard.querySelector('.wishlist-heart').addEventListener('click', () => toggleWishlist(card));
    wishlistCard.querySelector('.wishlist-star').addEventListener('click', () => toggleFavorites(card));
}

/**
 * REMOVE CARD FROM WISHLIST GRID
 */
function removeFromWishlist(cardId) {
    const cardElement = wishlistGrid.querySelector(`[data-id="${cardId}"]`);
    if (cardElement) {
        wishlistGrid.removeChild(cardElement);
    }
}

/**
 * POPULATE WISHLIST ON PAGE LOAD
 */
function populateWishlist(cards) {
    wishlistGrid.innerHTML = ''; // Clear existing grid
    wishlist.forEach(id => {
        const card = cards.find(card => card.id === id);
        if (card) {
            addToWishlist(card); // Add each card to the wishlist section
        }
    });
}

/**
 * TOGGLE WISHLIST TITLE VISIBILITY
 */
function toggleWishlistTitleVisibility() {
    wishlistTitle.style.display = wishlist.size > 0 ? 'block' : 'none';
}

/**
 * UPDATE WISHLIST UI
 */
function updateWishlistUI(cardId) {
    const heartIcons = document.querySelectorAll(`[data-id="${cardId}"] .wishlist-heart`);
    heartIcons.forEach(icon => {
        if (wishlist.has(cardId)) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });
}

/**
 * UPDATE FAVORITES UI
 */
function updateFavoritesUI(cardId) {
    const starIcons = document.querySelectorAll(`[data-id="${cardId}"] .wishlist-star`);
    starIcons.forEach(icon => {
        if (favorites.has(cardId)) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });
}

/**
 * INTEGRATE WISHLIST AND FAVORITES STATE
 */
export function integrateWishlistState(cardElement, card) {
    const heartIcon = cardElement.querySelector('.wishlist-heart');
    const starIcon = cardElement.querySelector('.wishlist-star');

    if (wishlist.has(card.id)) {
        heartIcon.classList.add('active');
    } else {
        heartIcon.classList.remove('active');
    }

    if (favorites.has(card.id)) {
        starIcon.classList.add('active');
    } else {
        starIcon.classList.remove('active');
    }

    heartIcon.addEventListener('click', () => toggleWishlist(card));
    starIcon.addEventListener('click', () => toggleFavorites(card));
}

/**
 * GET CATEGORY COLOR
 */
export function getCategoryColor(category) {
    switch (category) {
        case 'Rozcvička': return '#FFD700'; // Gold
        case 'Strelecké': return '#FF4500'; // OrangeRed
        case 'Prihrávkové': return '#1E90FF'; // DodgerBlue
        case 'Herné': return '#32CD32'; // LimeGreen
        case 'Zábavné': return '#FF69B4'; // HotPink
        case 'Technické': return '#8A2BE2'; // BlueViolet
        default: return '#D3D3D3'; // LightGray
    }
}
