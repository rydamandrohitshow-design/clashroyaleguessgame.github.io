// Data for the game (34 CARDS)
const ALL_CARDS = [
    // --- Common Cards (Image Names) ---
    // NOTE: All image paths now include "images/"
    { name: "Archers", img: "images/archers.png" },
    { name: "Knight", img: "images/knight.png" },
    { name: "Goblins", img: "images/goblins.png" },
    { name: "Skeletons", img: "images/skeletons.png" },
    { name: "Zap", img: "images/zap.png" },
    { name: "Minions", img: "images/minions.png" },
    { name: "Ice Spirit", img: "images/ice_spirit.png" },
    { name: "Cannon", img: "images/cannon.png" },
    { name: "Bomber", img: "images/bomber.png" },
    { name: "Royal Giant", img: "images/royal_giant.png" },
    { name: "Arrows", img: "images/arrows.png" },
    
    // --- Rare Cards (Image Names) ---
    { name: "Hog Rider", img: "images/hog_rider.png" },
    { name: "Mini Pekka", img: "images/mini_pekka.png" }, 
    { name: "Musketeer", img: "images/musketeer.png" },
    { name: "Valkyrie", img: "images/valkyrie.png" },
    { name: "Giant", img: "images/giant.png" },
    { name: "Fireball", img: "images/fireball.png" },
    { name: "Tombstone", img: "images/tombstone.png" },
    { name: "Ice Golem", img: "images/ice_golem.png" },
    { name: "Battle Ram", img: "images/battle_ram.png" },
    { name: "Wizard", img: "images/wizard.png" },

    // --- Epic Cards (Image Names) ---
    { name: "Pekka", img: "images/pekka.png" }, 
    { name: "Baby Dragon", img: "images/baby_dragon.png" },
    { name: "Witch", img: "images/witch.png" },
    { name: "Balloon", img: "images/balloon.png" },
    { name: "Prince", img: "images/prince.png" },
    { name: "Golem", img: "images/golem.png" },
    { name: "Lightning", img: "images/lightning.png" },
    { name: "Goblin Barrel", img: "images/goblin_barrel.png" },
    { name: "Skeleton Army", img: "images/skeleton_army.png" },

    // --- Legendary Cards (Image Names) ---
    { name: "The Log", img: "images/the_log.png" },
    { name: "Princess", img: "images/princess.png" },
    { name: "Electro Wizard", img: "images/electro_wizard.png" },
    { name: "Lumberjack", img: "images/lumberjack.png" },
];

// --- Game Variables and DOM Elements ---
let currentCard = {};
let incorrectGuesses = 0;
const MAX_SCALE = 40; 
const SCALE_DECREASE_PER_GUESS = 4; 
const MIN_SCALE = 1;

const imageElement = document.getElementById('card-image');
const guessCountElement = document.getElementById('guess-count');
const feedbackElement = document.getElementById('feedback');
const guessInput = document.getElementById('user-guess');
const guessButton = document.getElementById('guess-button');

// --- Initialization ---
function startGame() {
    // 1. Pick a random card
    const randomIndex = Math.floor(Math.random() * ALL_CARDS.length);
    currentCard = ALL_CARDS[randomIndex];
    
    // 2. Reset game state and input
    incorrectGuesses = 0;
    guessInput.value = '';
    
    guessInput.disabled = true; 
    guessButton.disabled = true;

    // FIX START: Disable transition before setting MAX_SCALE (eliminates the zoom-in animation bug)
    imageElement.style.transition = 'none'; 

    // Apply MAX_SCALE and hide image before loading new source 
    imageElement.style.transform = `scale(${MAX_SCALE})`; 
    imageElement.style.opacity = 0; 
    imageElement.style.imageRendering = 'pixelated'; 

    // 3. Set image source
    imageElement.src = currentCard.img; 

    // 4. FIX: Wait for the new image to fully load before showing it
    imageElement.onload = function() {
        // FIX END: Re-enable transition for the smooth reveal later on
        imageElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; 
        
        // Now that the image is loaded and MAX_SCALE is applied, show it
        imageElement.style.opacity = 1;

        // 5. Reset display elements and enable input
        guessCountElement.textContent = `Incorrect Guesses: 0`;
        feedbackElement.textContent = "Guess the highly pixelated card!";
        guessInput.disabled = false;
        guessButton.disabled = false;
    }
}

// --- Main Guessing Function ---
function checkGuess() {
    const userGuess = guessInput.value.trim().toLowerCase();
    const correctName = currentCard.name.toLowerCase();

    if (userGuess === "") {
        feedbackElement.textContent = "Please enter a card name!";
        return;
    }

    if (userGuess === correctName) {
        // Correct Guess (WIN)
        imageElement.style.transform = `scale(${MIN_SCALE})`; // Fully un-pixellate
        imageElement.style.imageRendering = 'auto'; // Turn off pixelation effect
        feedbackElement.textContent = `🎉 CORRECT! The card was the ${currentCard.name}! It took you ${incorrectGuesses} wrong guesses.`;
        guessInput.disabled = true; 
        guessButton.disabled = true;
    } else {
        // Incorrect Guess
        incorrectGuesses++;
        guessCountElement.textContent = `Incorrect Guesses: ${incorrectGuesses}`;
        feedbackElement.textContent = "❌ INCORRECT! Try again.";

        // Calculate new scale level (un-pixellating the image)
        let currentScale = parseFloat(imageElement.style.transform.replace('scale(', '').replace(')', ''));
        let newScale = currentScale - SCALE_DECREASE_PER_GUESS;
        
        // Ensure scale doesn't go below MIN_SCALE (full size)
        if (newScale < MIN_SCALE) {
            newScale = MIN_SCALE;
        }

        // Apply new scale (The smooth 'zoom-in' / un-pixellation)
        imageElement.style.transform = `scale(${newScale})`;

        if (newScale === MIN_SCALE) {
            // Fully Un-pixellated (GAME OVER)
            imageElement.style.imageRendering = 'auto'; // Turn off pixelation effect
            feedbackElement.textContent = `GAME OVER! The card was the ${currentCard.name}.`;
            guessInput.disabled = true;
            guessButton.disabled = true;
        }
    }
    guessInput.value = ''; // Clear input field
}

// Attach event listeners and start the game
document.addEventListener('DOMContentLoaded', () => {
    guessButton.onclick = checkGuess;
    guessInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !guessInput.disabled) {
            checkGuess();
        }
    });
    // Start the game when the page loads
    startGame();
});

// Expose startGame to the global scope so the "Start New Game" button can use it
window.startGame = startGame;