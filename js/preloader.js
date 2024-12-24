window.addEventListener("load", function () {
    const loaderContainer = document.querySelector(".loader-container");

    // Wait for all content to load
    const checkContentLoaded = () => {
        const cardContainer = document.querySelector("#card-container");
        const categoryButtons = document.querySelector("#category-buttons");

        if (
            cardContainer && cardContainer.children.length > 0 && // Ensure cards are loaded
            categoryButtons && categoryButtons.children.length > 0 // Ensure categories are loaded
        ) {
            // Content is fully loaded, hide the preloader
            loaderContainer.style.opacity = "0"; // Smooth fade-out transition
            setTimeout(() => {
                loaderContainer.style.display = "none"; // Remove from DOM after fade-out
            }, 300); // Match the CSS transition duration
        } else {
            // Retry after a short delay
            setTimeout(checkContentLoaded, 100); // Retry every 100ms
        }
    };

    // Initial check
    checkContentLoaded();
});
