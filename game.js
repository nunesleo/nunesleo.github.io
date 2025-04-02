// CONSTANTS AND VARIABLES
let gameState = "oneTurn"; // oneTurn, twoTurn, oneWalking, twoWalking
let lastTimestamp;
let animationFrameId;
let turnTime = 0;

let ballX = 200;
let ballY = 300;
let thomasX = ballX + 10;
let thomasY = ballY + 10;
let tylerX = ballX - 50;
let tylerY = ballY - 50;

let vel = 3;
let angleX = 1;
let angleY = 1;
const ballSize = 10;

let scoreP1 = 0;
let scoreP2 = 0;

const canvas = document.getElementById("game");
const restartButton = document.getElementById("restart");
const p1ScoreField = document.getElementById("p1Score");
const p2ScoreField = document.getElementById("p2Score");
const p1ScoreContainer = document.getElementById("p1ScoreDiv");
const p2ScoreContainer = document.getElementById("p2ScoreDiv");
const ctx = canvas.getContext("2d");
const thomasImage = new Image();
const tylerImage = new Image();
thomasImage.src = "./media/thomas.png";
tylerImage.src = "./media/tyler.png";

thomasImage.onload = function () {
    console.log("Imagem carregada!");
};

tylerImage.onload = function () {
    console.log("Imagem carregada!");
};

const delay = ms => new Promise(res => setTimeout(res, ms));

// FUNCTIONS
function drawScenario() {
    ctx.fillStyle = "#91c84d";
    ctx.fillRect(0, 0, 400, 600);
    ctx.fillStyle = "red";
    ctx.fillRect(200, 50, 15, 15);
    ctx.fillRect(200, 550, 15, 15);
}

function drawBall() {
    ctx.fillStyle = "white";
    ctx.fillRect(ballX, ballY, ballSize, ballSize);
}

function drawThomas() {
    ctx.drawImage(thomasImage, thomasX, thomasY);
}

function drawTyler() {
    ctx.drawImage(tylerImage, tylerX, tylerY);
}

function resetGame() {
    ballX = 200;
    ballY = 300;
    vel = 3;
    angleX = Math.random() * 2 - 1;
    angleY = Math.random() * 2 - 1;

    let magnitude = Math.sqrt(angleX * angleX + angleY * angleY);
    angleX /= magnitude;
    angleY /= magnitude;

    drawScenario();
    drawBall();
    p1ScoreField.textContent = "Tyler Score: " + scoreP1;
    p2ScoreField.textContent = "Thomas Score: " + scoreP2;
    lastTimestamp = null;
    if (gameState == "oneTurn") {
        drawTyler();
    } else if (gameState == "twoTurn") {
        drawThomas();
    }
}

function animate(timestamp) {
    if (turnTime > 300) {
        // Control speed
        if (vel > 0) {
            vel -= 0.008;
        } else {
            vel = 0;
        }

        // Update position
        ballX += vel * angleX;
        ballY += vel * angleY;

        // Collision with walls
        if (ballX <= 0 || ballX >= 390) {
            angleX *= -1;
        }
        if (ballY <= 0 || ballY >= 590) {
            angleY *= -1;
        }
        // Collision with P1 goal --> P2 should earn points
        if (ballX >= 190 && ballX <= 215 && ballY >= 40 && ballY <= 65) {
            scoreP2 += 1;
            resetGame();
            return
        }

        // Collision with P2 goal --> P1 should earn points
        if (ballX >= 190 && ballX <= 215 && ballY >= 540 && ballY <= 565) {
            scoreP1 += 1;
            resetGame();
            return
        }
    } else {
        turnTime += 1;
    }


    drawScenario();
    drawBall();
    if (gameState == "oneTurn") {
        drawTyler();
    } else if (gameState == "twoTurn") {
        drawThomas();
    }
    lastTimestamp = timestamp;
    window.cancelAnimationFrame(animationFrameId)
    window.requestAnimationFrame(animate);
}

// EVENT LISTENERS
restartButton.addEventListener("click", function () {
    resetGame();
    playGame();
});

async function throwBallNearTheHole() {
    angleX = 200 - ballX + Math.random() * 80 - 40;


    if (gameState == "oneTurn") {
        gameState = "twoTurn"
        turnTime = 0
        thomasX = ballX + 10
        thomasY = ballY + 10

        p2ScoreField.style.fontWeight = "bold"
        p1ScoreField.style.fontWeight = "normal"
        angleY = 50 - ballY + Math.random() * 80 - 40;
    }
    else if (gameState == "twoTurn") {
        gameState = "oneTurn"
        turnTime = 0;
        tylerX = ballX - 50
        tylerY = ballY - 50
        p1ScoreField.style.fontWeight = "bold"
        p2ScoreField.style.fontWeight = "normal"
        angleY = 565 - ballY + Math.random() * 80 - 40;
    }



    let magnitude = Math.sqrt(angleX * angleX + angleY * angleY);
    angleX /= magnitude;
    angleY /= magnitude;
    vel = 3;
    animationFrameId = window.requestAnimationFrame(animate);
}


async function playGame() {
    gameState = "twoTurn"
    while (true) {
        await throwBallNearTheHole();
        await delay(5500);
    }
}

