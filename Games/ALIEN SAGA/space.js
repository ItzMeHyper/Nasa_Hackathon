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
    document.getElementById("left").addEventListener("click", () => {
        if (gameOver) return;
        if (ship.x - shipVelocityX >= 0) {
            ship.x -= shipVelocityX; // Move left
        }
    });

    document.getElementById("right").addEventListener("click", () => {
        if (gameOver) return;
        if (ship.x + shipVelocityX + ship.width <= board.width) {
            ship.x += shipVelocityX; // Move right
        }
    });

    document.getElementById("shoot").addEventListener("click", () => {
        if (!gameOver) {
            shoot({ code: "Space" }); // Simulate shooting
        }
    });

    // Reset button event listener
    document.getElementById("reset").addEventListener("click", resetGame);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        // Play game over sound if not already played
        if (gameOverSound.paused) {
            gameOverSound.currentTime = 0;
            gameOverSound.play();
        }

        // Draw Game Over background
        context.fillStyle = "rgba(0, 0, 0, 0.7)"; // Semi-transparent black
        context.fillRect(0, 0, boardWidth, boardHeight);

        // Draw Game Over text
        context.fillStyle = "red"; // Change color to red for emphasis
        context.font = "48px courier";
        context.fillText("GAME OVER", boardWidth / 4, boardHeight / 2);
        context.font = "24px courier";
        context.fillText("SCORE : " + score, boardWidth / 4 + 20, boardHeight / 2 + 40);

        // Show reset button
        document.getElementById("reset").style.display = "block";

        return; // Stop further updates
    }

    context.clearRect(0, 0, board.width, board.height);

    // Ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    // Aliens
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            // If alien touches the borders
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;

                // Move all aliens up by one row
                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

            if (alien.y >= ship.y) {
                gameOver = true;
            }
        }
    }

    // Bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "red";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Bullet collision with aliens
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 50;
            }
        }
    }

    // Clear bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift(); // Removes the first element of the array
    }

    // Next level
    if (alienCount === 0) {
        // Increase the number of aliens in columns and rows by 1
        score += alienColumns * alienRows * 50; // Bonus points :)
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2); // Cap at 16/2 -2 = 6
        alienRows = Math.min(alienRows + 1, rows - 4); // Cap at 16-4 = 12
        if (alienVelocityX > 0) {
            alienVelocityX += 0.2; // Increase the alien movement speed towards the right
        } else {
            alienVelocityX -= 0.2; // Increase the alien movement speed towards the left
        }
        alienArray = [];
        bulletArray = [];
        createAliens();
    }

    // Score
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText("Score: " + score, 5, 20);
}

function moveShip(e) {
    if (gameOver) {
        return;
    }

    if (e.code === "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; // Move left one tile
    } else if (e.code === "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX; // Move right one tile
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
    if (gameOver) {
        return;
    }

    if (e.code === "Space") {
        // Shoot
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

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   // a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   // a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  // a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    // a's bottom left corner passes b's top left corner
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

    // Hide the reset button
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

function handleTouchEnd(event) {
    if (gameOver) return;
    shoot({ code: "Space" }); // Simulate shooting
}
