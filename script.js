const ARRAY_MAX_SIZE = 10;
const SECRET_PATTERN_LENGTH = 3;
const GAME_TIME = 60;

let gameArray = [];
let secretPattern = [];
let timeRemaining = GAME_TIME;
let timerId = null;
let gameActive = false;

const arrayContainer = document.getElementById('array-container');
const insertIndexInput = document.getElementById('insert-index-input');
const insertValueInput = document.getElementById('insert-value-input');
const deleteIndexInput = document.getElementById('delete-index-input');
const searchPatternInput = document.getElementById('search-pattern-input');
const feedbackMessage = document.getElementById('feedback-message');
const secretPatternDisplay = document.getElementById('secret-pattern-display');
const timerDisplay = document.getElementById('timer-display');

const insertBtn = document.getElementById('insert-btn');
const deleteBtn = document.getElementById('delete-btn');
const searchBtn = document.getElementById('search-btn');
const resetBtn = document.getElementById('reset-btn');

let audioContext;
const initAudio = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
};

const playSound = (type) => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    switch (type) {
        case 'insert':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.2);
            break;
        case 'error':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
            break;
        case 'win':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.linearRampToValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.linearRampToValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.4);
            break;
    }
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
};

document.body.addEventListener('click', initAudio, { once: true });

const showFeedback = (message, type) => {
    feedbackMessage.textContent = message;
    feedbackMessage.className = type;
};

const renderArray = (animationInfo = {}) => {
    arrayContainer.innerHTML = '';
    for (let i = 0; i < ARRAY_MAX_SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (i < gameArray.length) {
            cell.textContent = gameArray[i];
            
            if (animationInfo.type === 'insert' && i === animationInfo.index) {
                cell.classList.add('fade-in');
            } else if (animationInfo.type === 'insert' && i > animationInfo.index) {
                cell.classList.add('slide-right');
            } else if (animationInfo.type === 'delete' && i >= animationInfo.index) {
                cell.classList.add('slide-left');
            }
        } else {
            cell.classList.add('empty');
            cell.textContent = ' ';
        }
        arrayContainer.appendChild(cell);
    }
};

const handleInsert = () => {
    if (!gameActive) startGame();
    if (!gameActive || gameArray.length >= ARRAY_MAX_SIZE) {
        showFeedback("Array is full!", 'error');
        playSound('error');
        return;
    }

    const index = parseInt(insertIndexInput.value);
    const value = parseInt(insertValueInput.value);

    if (isNaN(index) || isNaN(value) || value < 0 || value > 9) {
        showFeedback("Invalid index or value (0-9).", 'error');
        playSound('error');
        return;
    }
    if (index < 0 || index > gameArray.length) {
        showFeedback(`Index out of bounds! (0-${gameArray.length})`, 'error');
        playSound('error');
        return;
    }

    gameArray.splice(index, 0, value);
    renderArray({ type: 'insert', index: index });
    showFeedback(`Inserted ${value} at index ${index}.`, 'info');
    playSound('insert');
    insertIndexInput.value = '';
    insertValueInput.value = '';
};

const handleDelete = () => {
    if (!gameActive) startGame();
    if (!gameActive || gameArray.length === 0) {
        showFeedback("Array is empty!", 'error');
        playSound('error');
        return;
    }

    const index = parseInt(deleteIndexInput.value);
    if (isNaN(index) || index < 0 || index >= gameArray.length) {
        showFeedback(`Index out of bounds! (0-${gameArray.length - 1})`, 'error');
        playSound('error');
        return;
    }

    const cells = arrayContainer.childNodes;
    const cellToDelete = cells[index];
    cellToDelete.classList.add('shrink-fade-out');

    const deletedValue = gameArray[index];
    gameArray.splice(index, 1);
    
    setTimeout(() => {
        renderArray({ type: 'delete', index: index });
        showFeedback(`Deleted element at index ${index}.`, 'info');
    }, 280);
    
    playSound('error');
    deleteIndexInput.value = '';
};

const handleSearch = async () => {
    if (!gameActive) startGame();
    if (!gameActive) return;

    const patternText = searchPatternInput.value;
    const pattern = patternText.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

    if (pattern.length === 0) {
        showFeedback("Enter a valid pattern (e.g., 1,2,3).", 'error');
        playSound('error');
        return;
    }
    
    showFeedback('Searching for pattern...', 'info');
    searchBtn.disabled = true;

    let found = false;
    const cells = arrayContainer.childNodes;

    for (let i = 0; i <= gameArray.length - pattern.length; i++) {
        let currentSlice = gameArray.slice(i, i + pattern.length);
        let isMatch = JSON.stringify(currentSlice) === JSON.stringify(pattern);
        
        for (let j = 0; j < pattern.length; j++) {
            cells[i + j].classList.add('highlight-search');
        }
        await new Promise(resolve => setTimeout(resolve, 400));
        for (let j = 0; j < pattern.length; j++) {
            cells[i + j].classList.remove('highlight-search');
        }

        if (isMatch) {
            showFeedback(`Pattern found at index ${i}!`, 'success');
            for (let j = 0; j < pattern.length; j++) {
                cells[i + j].classList.add('highlight-found');
            }
            found = true;
            checkWinCondition(pattern);
            break;
        }
    }

    if (!found) {
        showFeedback("Pattern not found.", 'error');
    }
    searchBtn.disabled = false;
};

const checkWinCondition = (foundPattern) => {
    if (JSON.stringify(foundPattern) === JSON.stringify(secretPattern)) {
        stopTimer();
        const timeTaken = GAME_TIME - timeRemaining;
        showFeedback(`CODE CRACKED in ${timeTaken} seconds!`, 'success');
        playSound('win');
        gameActive = false;
    }
};

const generateSecretPattern = () => {
    secretPattern = [];
    for (let i = 0; i < SECRET_PATTERN_LENGTH; i++) {
        secretPattern.push(Math.floor(Math.random() * 10));
    }
    secretPatternDisplay.textContent = `Find Pattern: [${secretPattern.join(', ')}]`;
};

const updateTimer = () => {
    timeRemaining--;
    timerDisplay.textContent = `Time: ${timeRemaining}`;
    if (timeRemaining <= 10) {
        timerDisplay.classList.add('low-time');
    }
    if (timeRemaining <= 0) {
        stopTimer();
        showFeedback("Time's up! The vault is locked!", 'error');
        gameActive = false;
    }
};

const startTimer = () => {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(updateTimer, 1000);
};

const stopTimer = () => {
    clearInterval(timerId);
    timerId = null;
};

const startGame = () => {
    if (gameActive) return;
    gameActive = true;
    startTimer();
    showFeedback("Timer started! Find the secret code.", 'info');
};

const resetGame = () => {
    gameArray = [];
    stopTimer();
    timeRemaining = GAME_TIME;
    gameActive = false;
    
    insertIndexInput.value = '';
    insertValueInput.value = '';
    deleteIndexInput.value = '';
    searchPatternInput.value = '';
    
    timerDisplay.textContent = `Time: ${GAME_TIME}`;
    timerDisplay.classList.remove('low-time');
    showFeedback("New game started. Make your first move to begin.", 'info');
    generateSecretPattern();
    renderArray();
};

insertBtn.addEventListener('click', handleInsert);
deleteBtn.addEventListener('click', handleDelete);
searchBtn.addEventListener('click', handleSearch);
resetBtn.addEventListener('click', resetGame);

document.addEventListener('DOMContentLoaded', resetGame);