let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; // 32 * 16
let context;

// Ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
};

let shipImg;
let shipVelocityX = tileSize; // Ship moving speed

// Aliens
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; // Number of aliens to defeat
let alienVelocityX = 3; // Alien moving speed

// Bullets
let bulletArray = [];
let bulletVelocityY = -10; // Bullet moving speed

let score = 0;
let gameOver = false;

const clickSound = new Audio("effects/laser.mp3");
const gameOverSound = new Audio("effects/gameover.mp3"); // Game Over sound

const COLORS = {
    background: "rgba(0, 0, 0, 0.7)",
    gameOverText: "red",
    scoreText: "white",
};

const FONTS = {
    gameOver: "48px courier",
    score: "16px courier",
};

function playSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); // Used for drawing on the board

    // Load images
    shipImg = new Image();
    shipImg.src = "./ship.png";
    shipImg.onload = function () {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    alienImg = new Image();
    alienImg.src = "./alien.png";
    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);

    // Add touch event listeners for mobile controls
    board.addEventListener("touchstart", handleTouchStart);
    board.addEventListener("touchmove", handleTouchMove);
    board.addEventListener("touchend", handleTouchEnd);

    // Button event listeners
    const resetButton = document.getElementById("reset");
    const leftButton = document.getElementById("left");
    const rightButton = document.getElementById("right");
    const shootButton = document.getElementById("shoot");

    leftButton.addEventListener("click", () => {
        if (gameOver) return;
        if (ship.x - shipVelocityX >= 0) {
            ship.x -= shipVelocityX; // Move left
        }
    });

    rightButton.addEventListener("click", () => {
        if (gameOver) return;
        if (ship.x + shipVelocityX + ship.width <= board.width) {
            ship.x += shipVelocityX; // Move right
        }
    });

    shootButton.addEventListener("click", () => {
        if (!gameOver) {
            shoot({ code: "Space" }); // Simulate shooting
        }
    });

    resetButton.addEventListener("click", resetGame);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        handleGameOver();
        return; // Stop further updates
    }

    context.clearRect(0, 0, board.width, board.height);
    drawShip();
    updateAliens();
    drawAliens();
    updateBullets();
    drawBullets();
    checkNextLevel();
    drawScore();
}

function handleGameOver() {
    if (gameOverSound.paused) {
        gameOverSound.currentTime = 0;
        gameOverSound.play();
    }

    context.fillStyle = COLORS.background;
    context.fillRect(0, 0, boardWidth, boardHeight);
    context.fillStyle = COLORS.gameOverText;
    context.font = FONTS.gameOver;
    context.fillText("GAME OVER", boardWidth / 4, boardHeight / 2);
    context.fillText("SCORE : " + score, boardWidth / 4 + 20, boardHeight / 2 + 40);
    document.getElementById("reset").style.display = "block";
}

function drawShip() {
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
}

function updateAliens() {
    let changeDirection = false;

    for (let alien of alienArray) {
        if (alien.alive) {
            alien.x += alienVelocityX;

            // Check for boundary collisions
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                changeDirection = true;
            }
        }
    }

    if (changeDirection) {
        alienVelocityX *= -1;
        for (let alien of alienArray) {
            alien.y += alienHeight; // Move all aliens down
        }
    }
}

function drawAliens() {
    for (let alien of alienArray) {
        if (alien.alive) {
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
            if (alien.y >= ship.y) {
                gameOver = true;
            }
        }
    }
}

function updateBullets() {
    for (let bullet of bulletArray) {
        bullet.y += bulletVelocityY;
    }

    // Check for bullet collisions with aliens
    for (let bullet of bulletArray) {
        for (let alien of alienArray) {
            if (bullet.y < 0 || bullet.used) continue; // Skip if bullet is off-screen or used
            if (alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true; // Mark bullet as used
                alien.alive = false; // Mark alien as hit
                alienCount--;
                score += 50; // Increase score
            }
        }
    }

    // Remove used or off-screen bullets
    bulletArray = bulletArray.filter(bullet => bullet.y >= 0 && !bullet.used);
}

function drawBullets() {
    context.fillStyle = "red";
    for (let bullet of bulletArray) {
        if (!bullet.used) {
            context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    }
}

function checkNextLevel() {
    if (alienCount === 0) {
        score += alienColumns * alienRows * 50; // Bonus points :)
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2); // Cap at 6
        alienRows = Math.min(alienRows + 1, rows - 4); // Cap at 12
        if (alienVelocityX > 0) {
            alienVelocityX += 0.2; // Increase speed
        } else {
            alienVelocityX -= 0.2; // Increase speed
        }
        alienArray = [];
        bulletArray = [];
        createAliens();
    }
}

function drawScore() {
    context.fillStyle = COLORS.scoreText;
    context.font = FONTS.score;
    context.fillText("Score: " + score, 5, 20);
}

function moveShip(e) {
    if (gameOver) return;

    if (e.code === "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; // Move left
    } else if (e.code === "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX; // Move right
    }
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img: alienImg,
                x: alienX + c * alienWidth,
                y: alienY + r * alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true
            };
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e) {
    if (gameOver) return;

    if (e.code === "Space") {
        let bullet = {
            x: ship.x + shipWidth * 15 / 32,
            y: ship.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false
        };
        playSound();
        bulletArray.push(bullet);
    }
}

function resetGame() {
    score = 0;
    gameOver = false;
    alienArray = [];
    bulletArray = [];
    alienCount = 0;
    alienRows = 2;
    alienColumns = 3;
    alienVelocityX = 1;
    ship.x = shipX; // Reset ship position
    document.getElementById("reset").style.display = "none";
    createAliens();
    requestAnimationFrame(update);
}

// Touch control functions
let touchStartX;
let touchEndX;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX;

    if (gameOver) return;

    if (touchEndX < touchStartX && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; // Move left
    } else if (touchEndX > touchStartX && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX; // Move right
    }

    touchStartX = touchEndX; // Update start position
}

function handleTouchEnd() {
    if (gameOver) return;
    shoot({ code: "Space" }); // Simulate shooting
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   // a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   // a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  // a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    // a's bottom left corner passes b's top left corner
}
