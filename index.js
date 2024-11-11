const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');
const score1Display = document.getElementById('score1');
const score2Display = document.getElementById('score2');
const player1WinsDisplay = document.getElementById('player1Wins');
const player2WinsDisplay = document.getElementById('player2Wins');

let player1Score = 0;
let player2Score = 0;
let player1Wins = 0;
let player2Wins = 0;
let isPlaying = false;
let animationFrameId;

const winningScore = 5;
const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;
let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;
let ballX, ballY, ballSpeedX, ballSpeedY;

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = Math.random() > 0.5 ? 4 : -4;
    ballSpeedY = (Math.random() - 0.5) * 5;
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, 'black'); // Background
    drawDivider(); // Moving Divider Line
    drawRect(0, player1Y, paddleWidth, paddleHeight, 'white'); // Player 1 paddle
    drawRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight, 'white'); // Player 2 paddle
    drawCircle(ballX, ballY, ballSize, 'white'); // Ball
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collision with top and bottom walls
    if (ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Collision with paddles
    if (
        (ballX <= paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) ||
        (ballX >= canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Point for Player 2
    if (ballX < 0) {
        player2Score++;
        updateScore();
        if (player2Score >= winningScore) endGame("Player 2");
        else resetBall();
    }

    // Point for Player 1
    if (ballX > canvas.width) {
        player1Score++;
        updateScore();
        if (player1Score >= winningScore) endGame("Player 1");
        else resetBall();
    }
}

function updateScore() {
    score1Display.textContent = player1Score;
    score2Display.textContent = player2Score;
}

function updateWins() {
    player1WinsDisplay.textContent = `Játékos 1: ${player1Wins} győzelem`;
    player2WinsDisplay.textContent = `Játékos 2: ${player2Wins} győzelem`;
}

function endGame(winner) {
    isPlaying = false;
    cancelAnimationFrame(animationFrameId);
    if (winner === "Player 1") {
        player1Wins++;
    } else {
        player2Wins++;
    }
    player1Score = 0;
    player2Score = 0;
    updateScore();
    updateWins();
}

// Game reset with "Play" button
playButton.addEventListener('click', function () {
    if (!isPlaying) {
        isPlaying = true;
        resetBall();
        player1Score = 0;
        player2Score = 0;
        updateScore();
        gameLoop();
    }
});

let dividerOffset = 0;
const dividerSpeed = 2;

function drawDivider() {
    ctx.fillStyle = 'white';
    const segmentHeight = 15;
    const gap = 10;

    for (let y = dividerOffset; y < canvas.height; y += segmentHeight + gap) {
        drawRect(canvas.width / 2 - 1, y, 2, segmentHeight, 'white');
    }

    dividerOffset += dividerSpeed;
    if (dividerOffset > segmentHeight + gap) {
        dividerOffset = 0;
    }
}

let player1Up = false;
let player1Down = false;
let player2Up = false;
let player2Down = false;

const paddleSpeed = 5;

function movePaddles() {
    if (player1Up && player1Y > 0) {
        player1Y -= paddleSpeed;
    }
    if (player1Down && player1Y < canvas.height - paddleHeight) {
        player1Y += paddleSpeed;
    }
    if (player2Up && player2Y > 0) {
        player2Y -= paddleSpeed;
    }
    if (player2Down && player2Y < canvas.height - paddleHeight) {
        player2Y += paddleSpeed;
    }
}

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'w':
            player1Up = true;
            break;
        case 's':
            player1Down = true;
            break;
        case 'ArrowUp':
            player2Up = true;
            break;
        case 'ArrowDown':
            player2Down = true;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.key) {
        case 'w':
            player1Up = false;
            break;
        case 's':
            player1Down = false;
            break;
        case 'ArrowUp':
            player2Up = false;
            break;
        case 'ArrowDown':
            player2Down = false;
            break;
    }
});

function gameLoop() {
    if (isPlaying) {
        draw();
        movePaddles();
        moveBall();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}
