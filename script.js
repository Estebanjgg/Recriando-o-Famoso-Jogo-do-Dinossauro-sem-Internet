const dino = document.getElementById("dino");
const branch = document.getElementById("branch");
const scoreDisplay = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const gameContainer = document.getElementById("gameContainer");

const jumpSound = new Audio("sounds/jump.mp3");
const crashSound = new Audio("sounds/crash.mp3");

let isJumping = false;
let score = 0;
let gameOver = false;
let branchPosition = gameContainer.offsetWidth;

let jumpHeight = 0;
const maxJumpHeight = 100;
const jumpSpeed = 5;

let lastTime = null;

function startGame() {
  isJumping = false;
  score = 0;
  gameOver = false;
  branchPosition = gameContainer.offsetWidth;
  scoreDisplay.innerText = score;
  dino.style.bottom = "0px";
  branch.style.left = branchPosition + "px";

  startScreen.style.display = "none";
  gameOverScreen.style.display = "none";

  lastTime = null;
  requestAnimationFrame(animateBranch);
}

function animateBranch(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  if (gameOver) return;

  const moveSpeed = 0.3 * delta;

  branchPosition -= moveSpeed;
  branch.style.left = branchPosition + "px";

  if (branchPosition < -branch.offsetWidth) {
    branchPosition = gameContainer.offsetWidth;
    score++;
    scoreDisplay.innerText = score;
  }

  const dinoBottom = parseInt(
    window.getComputedStyle(dino).getPropertyValue("bottom")
  );
  if (branchPosition > 50 && branchPosition < 90 && dinoBottom < 40) {
    crashSound.play();
    endGame();
    return;
  }

  requestAnimationFrame(animateBranch);
}

function jump() {
  if (isJumping) return;
  isJumping = true;
  jumpSound.play();

  function animateJump() {
    if (jumpHeight < maxJumpHeight) {
      jumpHeight += jumpSpeed;
      dino.style.bottom = jumpHeight + "px";
      requestAnimationFrame(animateJump);
    } else {
      requestAnimationFrame(animateFall);
    }
  }

  function animateFall() {
    if (jumpHeight > 0) {
      jumpHeight -= jumpSpeed;
      dino.style.bottom = jumpHeight + "px";
      requestAnimationFrame(animateFall);
    } else {
      jumpHeight = 0;
      dino.style.bottom = "0px";
      isJumping = false;
    }
  }

  requestAnimationFrame(animateJump);
}

function endGame() {
  gameOver = true;
  finalScore.innerText = "Puntaje: " + score;
  gameOverScreen.style.display = "flex";
}

document.addEventListener("keydown", function (event) {
  if (
    (event.code === "Space" || event.key === " ") &&
    !gameOver &&
    startScreen.style.display === "none"
  ) {
    jump();
  }
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
