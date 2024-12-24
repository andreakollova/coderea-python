import { fetchRandomCard, fetchCardsByCategory } from "./database.js";
import "./theme-toggle.js";
import { supabase } from "./database.js"; // Added supabase import
import { highlightDifferences } from "./compareCodes.js";

const cardContainer = document.getElementById("card-container");
const getStartedButton = document.getElementById("get-started");
const categoryButtonsContainer = document.getElementById("category-buttons"); // New container for category buttons

// Categories for filtering
const categories = [
  "Lesson 1",
  "Lesson 2",
  "Lesson 3",
  "Lesson 4",
  "Lesson 5",
  "Lesson 6",
  "Lesson 7",
  "Lesson 8",
  "Lesson 9",
  "Lesson 10",
  "Lesson 11",
  "Lesson 12",
  "Lesson 13",
  "Lesson 14",
  "Lesson 15",
];

// Function to add line numbers to the coding area
function addLineNumbers(textarea) {
  const lineNumbersDiv = document.createElement("div");
  lineNumbersDiv.className = "line-numbers";

  // Generate initial line numbers
  updateLineNumbers(textarea, lineNumbersDiv);

  // Update line numbers on input
  textarea.addEventListener("input", () => {
    updateLineNumbers(textarea, lineNumbersDiv);
  });

  // Update line numbers on scroll
  textarea.addEventListener("scroll", () => {
    lineNumbersDiv.scrollTop = textarea.scrollTop;
  });

  return lineNumbersDiv;
}

// Function to update line numbers dynamically
function updateLineNumbers(textarea, lineNumbersDiv) {
  const linesCount = textarea.value.split("\n").length || 1;
  const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 16;

  // Adjust the height of line numbers div to match textarea height
  lineNumbersDiv.innerHTML = Array.from(
    { length: linesCount },
    (_, i) => `<span>${i + 1}</span>`
  ).join("");
  lineNumbersDiv.style.lineHeight = `${lineHeight}px`;
}

// Function to display a card on the UI
function displayCard(card) {
  cardContainer.innerHTML = ""; // Clear existing content

  let userCode = ""; // Store user-entered code

  const cardElement = document.createElement("li"); // Create a new card element
  cardElement.className = "card";

  // Card structure
  cardElement.innerHTML = `
        <div class="assignment-area">
            <h3 class="card-title">${card.title}</h3>
            <span class="card-category">
                <img src="./icons/Lesson-${
                  categories.indexOf(card.category) + 1
                }.svg" 
                     alt="${card.category} Icon" 
                     class="category-icon">
                ${card.category || "General"}
            </span>
            <p class="card-content">${card.content}</p>
            <div class="card-buttons">
                <button class="show-result">Zobraziť riešenie</button>
                <button class="show-explanation">Vysvetlenie</button>
            </div>
        </div>
        <div class="coding-area-container">
            <div class="top-bar">
                <span class="top-bar-text">Python</span>
                <button class="copy-code-btn" aria-label="Copy code">Kopírovať kód</button>
            </div>
            <div class="coding-area" style="display: flex;">
                <div class="line-numbers"></div>
                <textarea id="user-code" placeholder="Začni písať kód..."></textarea>
            </div>
        </div>
        <div class="code-result" style="display: none;">
            <div class="result-display">
                <div class="original-code">
                    <div class="top-bar">
                        <span>Správny kód</span>
                        <button class="copy-code-btn" aria-label="Copy original code">Kopírovať kód</button>
                    </div>
                    <div class="coding-area" style="display: flex;">
                        <div class="line-numbers"></div>
                        <pre><code>${card.result}</code></pre>
                    </div>
                </div>
                <div class="user-code">
                    <div class="top-bar">
                        <span>Môj kód</span>
                        <button class="copy-code-btn" aria-label="Copy your code">Kopírovať kód</button>
                    </div>
                    <div class="coding-area" style="display: flex;">
                        <div class="line-numbers"></div>
                        <pre id="user-code-result"></pre>
                    </div>
                </div>
            </div>
            <button class="back-button">Back</button>
        </div>
        <div class="explanation-box" style="display: none;">
            <div class="toggle-container">
                <label class="toggle-label">
                    <input type="checkbox" class="toggle-easy">
                    <span class="slider"></span>
                    Rozšírené vysvetlenie
                </label>
            </div>
            <p class="explanation-content">${
              card.explanation || "No explanation available."
            }</p>
        </div>
    `;

  // Add line numbers to the user code textarea
  const textarea = cardElement.querySelector("#user-code");
  const lineNumbersDiv = addLineNumbers(textarea);
  cardElement
    .querySelector(".coding-area .line-numbers")
    .appendChild(lineNumbersDiv);

  // Add line numbers to the Original Code section
  const originalCodePre = cardElement.querySelector(".original-code pre code");
  const originalLineNumbersDiv = addLineNumbersStatic(
    originalCodePre.textContent
  );
  cardElement
    .querySelector(".original-code .line-numbers")
    .appendChild(originalLineNumbersDiv);

  // Add line numbers to the User Code Result section
  const userCodeResultPre = cardElement.querySelector("#user-code-result");
  const userLineNumbersDiv = addLineNumbersStatic("");
  cardElement
    .querySelector(".user-code .line-numbers")
    .appendChild(userLineNumbersDiv);

  // Show Result button functionality
  // Show Result button functionality
  const showResultButton = cardElement.querySelector(".show-result");

  showResultButton.addEventListener("click", () => {
    const assignmentArea = cardElement.querySelector(".assignment-area");
    const codingArea = cardElement.querySelector(".coding-area");
    const codeResult = cardElement.querySelector(".code-result");
    const userCodeResult = cardElement.querySelector("#user-code-result"); // <pre id="user-code-result"></pre>

    userCode = textarea.value; // Capture user code
    userCodeResult.textContent = userCode; // Populate user code result section

    const resultHTML = highlightDifferences(card.result, userCode);
    userCodeResult.innerHTML = resultHTML;

    // Update line numbers in the User Code Result section
    updateLineNumbersStatic(userCode, userLineNumbersDiv);

    // Show/Hide relevant sections
    assignmentArea.style.display = "none";
    codingArea.style.display = "none";
    codeResult.style.display = "block";

    // Hide the top bar with "Python"
    const pythonTopBar = document.querySelector(".top-bar:first-child"); // Assuming this is the bar you want to hide
    if (pythonTopBar) {
      pythonTopBar.style.display = "none"; // Hide the bar
    }
  });

  // Back button functionality
  const backButton = cardElement.querySelector(".back-button");
  backButton.addEventListener("click", () => {
    const assignmentArea = cardElement.querySelector(".assignment-area");
    const codingArea = cardElement.querySelector(".coding-area");
    const codeResult = cardElement.querySelector(".code-result");

    // Show/Hide relevant sections
    assignmentArea.style.display = "block";
    codingArea.style.display = "flex";
    codeResult.style.display = "none";

    // Restore user code in the textarea and update line numbers
    textarea.value = userCode;
    updateLineNumbers(textarea, lineNumbersDiv);

    // Restore the top bar with "Python"
    const pythonTopBar = document.querySelector(".top-bar:first-child"); // Assuming this is the bar you want to restore
    if (pythonTopBar) {
      pythonTopBar.style.display = "flex"; // Restore the bar
    }
  });

  // Show Explanation button functionality
  const showExplanationButton = cardElement.querySelector(".show-explanation");
  showExplanationButton.addEventListener("click", () => {
    const explanationBox = cardElement.querySelector(".explanation-box");
    explanationBox.style.display =
      explanationBox.style.display === "none" ? "block" : "none";
  });

  // Easy Explanation toggle functionality
  const toggleEasy = cardElement.querySelector(".toggle-easy");
  const explanationContent = cardElement.querySelector(".explanation-content");

  toggleEasy.addEventListener("change", () => {
    explanationContent.textContent = toggleEasy.checked
      ? card["easy-explanation"] || "No easy explanation available."
      : card.explanation || "No explanation available.";
  });

  cardContainer.appendChild(cardElement); // Append the generated card to the container
}

// Helper function to generate static line numbers for non-editable content
// Function to update line numbers dynamically for editable content
function addLineNumbersStatic(content) {
  const linesCount = content.split("\n").length || 1;
  const lineNumbersDiv = document.createElement("div");
  lineNumbersDiv.className = "line-numbers";

  // Generate line numbers
  lineNumbersDiv.innerHTML = Array.from(
    { length: linesCount },
    (_, i) => `<span>${i + 1}</span>`
  ).join("");

  return lineNumbersDiv;
}

// Ensure line numbers for Original Code are added
const originalCodePre = document.querySelector(".original-code pre code");
const originalCodeLineNumbersDiv = document.querySelector(
  ".original-code .line-numbers"
);
if (originalCodePre && originalCodeLineNumbersDiv) {
  const originalContent = originalCodePre.textContent;
  updateLineNumbersStatic(originalContent, originalCodeLineNumbersDiv);
}

// Function to ensure line numbers stay in sync
function updateLineNumbersStatic(content, lineNumbersDiv) {
  const linesCount = content.split("\n").length || 1;
  lineNumbersDiv.innerHTML = Array.from(
    { length: linesCount },
    (_, i) => `<span>${i + 1}</span>`
  ).join("");
}

// Function to fetch categories with cards
async function fetchCategoriesWithCards() {
  try {
    const categoryButtons = [];
    for (const category of categories) {
      const cards = await fetchCardsByCategory(category);
      if (cards.length > 0) {
        categoryButtons.push(category);
      }
    }
    return categoryButtons;
  } catch (error) {
    console.error("Error fetching categories with cards:", error);
    return [];
  }
}

// Function to display cards by category
async function displayCardsByCategory(category) {
  try {
    const cards = await fetchCardsByCategory(category);
    cardContainer.innerHTML = ""; // Clear existing cards
    if (cards.length > 0) {
      // Shuffle and display cards
      const shuffledCards = cards.sort(() => 0.5 - Math.random());
      shuffledCards.forEach((card) => {
        card.category = category; // Ensure the correct category is explicitly assigned
        displayCard(card);
      });
    } else {
      cardContainer.innerHTML = "<p>No cards available in this category.</p>";
    }
  } catch (error) {
    console.error("Error fetching cards by category:", error);
    cardContainer.innerHTML =
      "<p>Failed to load cards. Please try again later.</p>";
  }
}

// Create category buttons dynamically based on available cards
async function createCategoryButtons() {
  const availableCategories = await fetchCategoriesWithCards();

  availableCategories.forEach((category, index) => {
    const button = document.createElement("button");
    button.className = "category-option button-primary";

    // Create a span to hold the text
    const textSpan = document.createElement("span");
    textSpan.textContent = category;

    // Create an img element for the icon
    const icon = document.createElement("img");
    icon.src = `./icons/Lesson-${index + 1}.svg`; // Match icon to category index
    icon.alt = `${category} Icon`;
    icon.className = "category-icon"; // Add a class for styling if needed

    // Append the icon and text to the button
    button.appendChild(icon);
    button.appendChild(textSpan);

    button.addEventListener("click", () => displayCardsByCategory(category));

    categoryButtonsContainer.appendChild(button);
  });
}

// Event listener for the "GET STARTED" button
getStartedButton.addEventListener("click", async () => {
  try {
    const card = await fetchRandomCard();
    if (card) {
      displayCard(card);
    } else {
      cardContainer.innerHTML = "<p>No cards available.</p>";
    }
  } catch (error) {
    console.error("Error fetching card:", error);
    cardContainer.innerHTML =
      "<p>Failed to load cards. Please try again later.</p>";
  }
});

// Fetch and display a random card on page load
document.addEventListener("DOMContentLoaded", async () => {
  await createCategoryButtons(); // Add category buttons dynamically
  try {
    const card = await fetchRandomCard();
    if (card) {
      displayCard(card);
    } else {
      cardContainer.innerHTML = "<p>No cards available to display.</p>";
    }
  } catch (error) {
    console.error("Error initializing app:", error);
    cardContainer.innerHTML =
      "<p>Failed to load cards. Please try again later.</p>";
  }
});
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const headerLogo = document.querySelector(".header-logo");

// Set Initial Theme
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);
updateLogo(savedTheme);

function updateThemeIcon(theme) {
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
}

function updateLogo(theme) {
  headerLogo.src =
    theme === "dark" ? "./images/logo-dark.png" : "./images/logo-light.png";
}

// Toggle Theme
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
  updateLogo(newTheme);
}

themeToggle.addEventListener("click", toggleTheme);
