import { character } from './character.js';
import { obstacles, checkCollisions, generateHorizontalObstacles } from './obstacles.js';
import { questionState, loadCategories, fetchQuestion } from './questions.js';
import { setCanvasSize, drawStartScreen, drawGameOverScreen, updateScore, showQuestion, drawMessage, drawCategorySelectScreen, drawShieldStatus } from './ui.js';
import { playJumpSound, playScoreSound, playGameOverSound, playBackgroundMusic, stopBackgroundMusic } from './audio.js';
import { activePowerups, spawnPowerup, updatePowerups, drawPowerups } from './powerups.js';
import { particles, createExplosion, updateParticles, drawParticles } from './particles.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameState = 'start'; // 'start', 'categorySelect', 'playing', 'gameOver'
let score = { value: 0 };
let gameSpeed = 2;
let categories = [];
let selectedCategoryId = null;
let hasShield = false;
let slowmoActive = false;
let slowmoTimer = 0;

const questionTimeout = 15 * 1000;
let questionTimer = questionTimeout;
let displayMessage = { text: '', ttl: 0 };

function showTemporaryMessage(text, durationInFrames) {
    displayMessage.text = text;
    displayMessage.ttl = durationInFrames;
}

function checkPowerupCollisions() {
    for (let i = activePowerups.length - 1; i >= 0; i--) {
        const powerup = activePowerups[i];
        const dist = Math.hypot(character.x - powerup.x, character.y - powerup.y);

        if (dist - character.size / 2 - powerup.size / 2 < 1) {
            if (powerup.type === 'shield') {
                hasShield = true;
            } else if (powerup.type === 'slowmo') {
                slowmoActive = true;
                slowmoTimer = 300; // 5 seconds at 60fps
            }
            activePowerups.splice(i, 1);
        }
    }
}

async function getNewQuestionAndGenerateObstacles() {
    await fetchQuestion(selectedCategoryId);
    generateHorizontalObstacles(canvas, character, questionState);
}

function restartGame() {
    score.value = 0;
    gameSpeed = 2;
    hasShield = false;
    slowmoActive = false;
    slowmoTimer = 0;
    activePowerups.length = 0;
    particles.length = 0; // Clear any remaining particles
    character.y = canvas.height / 2;
    questionState.display = false;
    questionTimer = questionTimeout;
    gameState = 'categorySelect';
    ctx.textAlign = 'left';
}

function gameOver() {
    stopBackgroundMusic();
    playGameOverSound();
    createExplosion(character.x, character.y);
    gameState = 'gameOver';
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const background = document.getElementById('background');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (gameState === 'playing') {
        character.update(questionState);
        character.fall();
        character.draw(ctx);

        if (slowmoActive) {
            slowmoTimer--;
            if (slowmoTimer <= 0) {
                slowmoActive = false;
            }
        }

        const currentSpeed = slowmoActive ? gameSpeed / 2 : gameSpeed;

        obstacles.forEach(obstacle => {
            obstacle.update(currentSpeed);
            obstacle.draw(ctx);
        });

        updatePowerups(currentSpeed);
        drawPowerups(ctx);

        checkPowerupCollisions();
        const obstacleCollision = checkCollisions(character, questionState);
        if (obstacleCollision === 'correct') {
            playScoreSound();
            score.value++;
            gameSpeed += 0.2;
            showTemporaryMessage('Speed Up!', 60);

            if (Math.random() < 0.25) { // 25% chance to spawn a power-up on correct answer
                spawnPowerup(canvas);
            }

            questionState.display = false;
            questionTimer = questionTimeout;
            getNewQuestionAndGenerateObstacles();
        } else if (obstacleCollision === 'incorrect') {
            if (hasShield) {
                hasShield = false;
                obstacles.length = 0;
                questionState.display = false;
                getNewQuestionAndGenerateObstacles();
            } else {
                gameOver();
            }
        }

        if (questionState.display) {
            questionTimer -= 1000 / 60;
            if (questionTimer <= 0) {
                gameOver();
            }
            showQuestion(ctx, questionState);
        }

        updateScore(ctx, score);

        if (hasShield) {
            drawShieldStatus(ctx);
        }
        if (displayMessage.ttl > 0) {
            drawMessage(ctx, canvas, displayMessage.text);
            displayMessage.ttl--;
        }
    } else if (gameState === 'start') {
        drawStartScreen(ctx, canvas);
    } else if (gameState === 'categorySelect') {
        drawCategorySelectScreen(ctx, canvas, categories);
    } else if (gameState === 'gameOver') {
        drawGameOverScreen(ctx, canvas, score);
    }

    // Always update and draw particles, they will only exist after gameOver
    updateParticles();
    drawParticles(ctx);

    requestAnimationFrame(updateGame);
}

// Event Listeners
document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && gameState === 'playing') {
        character.jump();
        playJumpSound();
    }
});

canvas.addEventListener('click', async function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (gameState === 'start') {
        const buttonX = canvas.width / 2 - 100;
        const buttonY = canvas.height / 2 + 20;
        if (x >= buttonX && x <= buttonX + 200 && y >= buttonY && y <= buttonY + 50) {
            gameState = 'categorySelect';
        }
    } else if (gameState === 'categorySelect') {
        const buttonHeight = 40;
        const buttonPadding = 15;
        const displayCategories = categories.slice(0, 5);
        const totalHeight = (buttonHeight + buttonPadding) * displayCategories.length - buttonPadding;
        let startY = (canvas.height - totalHeight) / 2;

        displayCategories.forEach((category, index) => {
            const buttonY = startY + index * (buttonHeight + buttonPadding);
            if (x >= canvas.width / 2 - 200 && x <= canvas.width / 2 + 200 && y >= buttonY && y <= buttonY + buttonHeight) {
                selectedCategoryId = category.id;
                gameState = 'playing';
                playBackgroundMusic();
                getNewQuestionAndGenerateObstacles();
            }
        });
    } else if (gameState === 'gameOver') {
        const buttonX = canvas.width / 2 - 100;
        const buttonY = canvas.height / 2 + 20;
        if (x >= buttonX && x <= buttonX + 200 && y >= buttonY && y <= buttonY + 50) {
            restartGame();
        }
    }
});

// Initial setup
async function init() {
    setCanvasSize(canvas);
    character.y = canvas.height / 2;
    window.addEventListener("resize", () => setCanvasSize(canvas));
    categories = await loadCategories();
    updateGame();
}

init();
