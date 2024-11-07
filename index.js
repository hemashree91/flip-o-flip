const cards = document.querySelectorAll('.card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let timer;
let timeElapsed = 0;
let score = 0;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.querySelector('.inner-card').classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.querySelector('.back-card img').src === secondCard.querySelector('.back-card img').src;

    if (isMatch) {
        disableCards();
        updateScore(10); 
    } else {
        unflipCards();
        updateScore(-1); 
    }
    updateMoves();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    matchedPairs++;
    if (matchedPairs === cards.length / 2) {
        document.querySelector('.win').style.display = 'block';
        clearInterval(timer);
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.querySelector('.inner-card').classList.remove('flip');
        secondCard.querySelector('.inner-card').classList.remove('flip');

        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function updateMoves() {
    moves++;
    document.querySelector('.moves').textContent = `Moves: ${moves}  ||`;
}

function updateScore(points) {
    score += points;
    document.querySelector('.score').textContent = `Score: ${score}`;
}

function resetGame() {
    moves = 0;
    matchedPairs = 0;
    timeElapsed = 0;
    score = 0;
    document.querySelector('.moves').textContent = ' Moves:0';
    document.querySelector('.timer').textContent = 'Time: 0sec';
    document.querySelector('.score').textContent = 'Score: 0';
    document.querySelector('.win').style.display = 'none';
    clearInterval(timer);
    cards.forEach(card => {
        card.querySelector('.inner-card').classList.remove('flip');
        card.addEventListener('click', flipCard);
    });
    startTimer();
    shuffle();
}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
    });
}

function startTimer() {
    timer = setInterval(() => {
        timeElapsed++;
        document.querySelector('.timer').textContent = `Time: ${timeElapsed}sec`;
    }, 1000);
}


function handleMediaChange(e) {
    const gridContainer = document.querySelector('.grid');
    if (e.matches) { 
        gridContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else {
        gridContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    }
}

const mediaQuery = window.matchMedia('(max-width: 400px 600px)');


handleMediaChange(mediaQuery);


mediaQuery.addEventListener('change', handleMediaChange);

document.querySelector('.btn button').addEventListener('click', resetGame);

cards.forEach(card => {
    card.addEventListener('click', flipCard);
});

shuffle();
startTimer();
