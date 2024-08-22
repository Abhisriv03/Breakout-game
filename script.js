const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const CONFIG = {
    canvasWidth: 900,
    canvasHeight: 600,
    paddleHeight: 10,
    paddleWidth: 100,
    ballRadius: 10,
    ballSpeed: { dx: 8, dy: -6 },
    paddleSpeed: 10,
    brick: {
        rowCount: 3,
        columnCount: 10,
        width: 75,
        height: 20,
        padding: 10,
        offsetTop: 30,
        offsetLeft: 30,
        colors: ["#0095DD", "#e91e63", "#ffc107", "#8bc34a", "#9c27b0"]
    },
    scoreFont: "16px Arial",
    scoreColor: "#fff"
};

let level = 1;
let maxLevel = 3;
let paddleX = (CONFIG.canvasWidth - CONFIG.paddleWidth) / 2;
let ballPosition = { x: CONFIG.canvasWidth / 2, y: CONFIG.canvasHeight - 30 };
let ballSpeed = { ...CONFIG.ballSpeed };

let rightPressed = false;
let leftPressed = false;

const bricks = [];
initializeBricks();

let score = 0;
let lives = 3;

canvas.width = CONFIG.canvasWidth;
canvas.height = CONFIG.canvasHeight;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function initializeBricks() {
    for (let c = 0; c < CONFIG.brick.columnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < CONFIG.brick.rowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1, color: CONFIG.brick.colors[r % CONFIG.brick.colors.length] };
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < CONFIG.brick.columnCount; c++) {
        for (let r = 0; r < CONFIG.brick.rowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ballPosition.x > b.x &&
                    ballPosition.x < b.x + CONFIG.brick.width &&
                    ballPosition.y > b.y &&
                    ballPosition.y < b.y + CONFIG.brick.height
                ) {
                    ballSpeed.dy = -ballSpeed.dy;
                    b.status = 0;
                    score++;
                    updateScore();
                    if (score === CONFIG.brick.rowCount * CONFIG.brick.columnCount) {
                        if (level < maxLevel) {
                            level++;
                            CONFIG.brick.rowCount++;
                            initializeBricks();
                            resetBallAndPaddle();
                            updateLevel();
                        } else {
                            alert("YOU WIN, CONGRATULATIONS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }
}

function updateScore() {
    document.getElementById("score").textContent = `Score: ${score}`;
}

function updateLives() {
    document.getElementById("lives").textContent = `Lives: ${lives}`;
}

function updateLevel() {
    document.getElementById("level").textContent = `Level: ${level}`;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballPosition.x, ballPosition.y, CONFIG.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - CONFIG.paddleHeight, CONFIG.paddleWidth, CONFIG.paddleHeight);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < CONFIG.brick.columnCount; c++) {
        for (let r = 0; r < CONFIG.brick.rowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (CONFIG.brick.width + CONFIG.brick.padding) + CONFIG.brick.offsetLeft;
                const brickY = r * (CONFIG.brick.height + CONFIG.brick.padding) + CONFIG.brick.offsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, CONFIG.brick.width, CONFIG.brick.height);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (ballPosition.x + ballSpeed.dx > canvas.width - CONFIG.ballRadius || ballPosition.x + ballSpeed.dx < CONFIG.ballRadius) {
        ballSpeed.dx = -ballSpeed.dx;
    }
    if (ballPosition.y + ballSpeed.dy < CONFIG.ballRadius) {
        ballSpeed.dy = -ballSpeed.dy;
    } else if (ballPosition.y + ballSpeed.dy > canvas.height - CONFIG.ballRadius) {
        if (ballPosition.x > paddleX && ballPosition.x < paddleX + CONFIG.paddleWidth) {
            ballSpeed.dy = -ballSpeed.dy;
        } else {
            lives--;
            updateLives();
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                resetBallAndPaddle();
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - CONFIG.paddleWidth) {
        paddleX += CONFIG.paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= CONFIG.paddleSpeed;
    }

    ballPosition.x += ballSpeed.dx;
    ballPosition.y += ballSpeed.dy;
    requestAnimationFrame(draw);
}

function resetBallAndPaddle() {
    ballPosition.x = CONFIG.canvasWidth / 2;
    ballPosition.y = CONFIG.canvasHeight - 30;
    ballSpeed = { ...CONFIG.ballSpeed };
    paddleX = (CONFIG.canvasWidth - CONFIG.paddleWidth) / 2;
}

function restartGame() {
    document.location.reload();
}

draw();
