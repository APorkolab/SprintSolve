import { character } from './character.js';
import { obstacles, tunnels, checkCollisions, generateWallWithTunnels } from './obstacles.js';
import { questionState, fetchQuestion } from './questions.js';
import { setCanvasSize, drawGameOverScreen, updateScore, showQuestion, drawMessage, drawShieldStatus } from './ui.js';
import { playJumpSound, playScoreSound, playGameOverSound, playBackgroundMusic, stopBackgroundMusic } from './audio.js';
import { activePowerups, spawnPowerup, updatePowerups, drawPowerups } from './powerups.js';
import { particles, createExplosion, updateParticles, drawParticles } from './particles.js';
import { loadGameAssets } from './assets.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let assets;
let gameState = 'playing'; // Start directly in the game
let score = { value: 0 };
let gameSpeed = 4;
const selectedCategoryId = 9;
let hasShield = false;
let displayMessage = { text: '', ttl: 0, color: 'white' };
let collisionProcessed = false;
let roundJustStarted = true;

function showTemporaryMessage(text, durationInFrames, color = 'white') {
    displayMessage.text = text;
    displayMessage.ttl = durationInFrames;
    displayMessage.color = color;
}

function checkPowerupCollisions() {
    for (let i = activePowerups.length - 1; i >= 0; i--) {
        const powerup = activePowerups[i];
        const dist = Math.hypot(character.x - powerup.x, character.y - powerup.y);
        if (dist - character.size / 2 - powerup.size / 2 < 1) {
            if (powerup.type === 'shield') hasShield = true;
            activePowerups.splice(i, 1);
        }
    }
}

async function resetForNewRound() {
    character.y = canvas.height / 2;
    character.velocity_y = 0;
    character.gravity = 0;
    await fetchQuestion(selectedCategoryId);
    generateWallWithTunnels(canvas, questionState);
    collisionProcessed = false;
    roundJustStarted = true;
}

function restartGame() {
    score.value = 0;
    gameSpeed = 4;
    hasShield = false;
    activePowerups.length = 0;
    particles.length = 0;
    gameState = 'playing';
    playBackgroundMusic();
    resetForNewRound();
}

function gameOver() {
    stopBackgroundMusic();
    playGameOverSound();
    createExplosion(character.x, character.y);
    gameState = 'gameOver';
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);

    if (gameState === 'playing') {
        character.update();
        character.draw(ctx, assets.character);

        obstacles.forEach(obstacle => {
            obstacle.update(gameSpeed);
            obstacle.draw(ctx, assets.obstacle);
        });
        tunnels.forEach(tunnel => {
            tunnel.update(gameSpeed);
            tunnel.draw(ctx);
        });

        updatePowerups(gameSpeed);
        drawPowerups(ctx);
        checkPowerupCollisions();

        if (!collisionProcessed) {
            const collisionResult = checkCollisions(character, canvas);
            if (collisionResult) {
                collisionProcessed = true;
                if (collisionResult === 'correct') {
                    playScoreSound();
                    score.value++;
                    showTemporaryMessage('Helyes!', 60, 'green');
                    if (Math.random() < 0.25) spawnPowerup(canvas);
                    setTimeout(resetForNewRound, 500);
                } else if (collisionResult === 'incorrect') {
                    showTemporaryMessage('Rossz!', 60, 'red');
                    setTimeout(resetForNewRound, 500);
                } else if (['wall', 'ceiling', 'floor'].includes(collisionResult)) {
                    if (hasShield) {
                        hasShield = false;
                        obstacles.forEach(o => o.x += 150);
                        tunnels.forEach(t => t.x += 150);
                        collisionProcessed = false;
                    } else {
                        gameOver();
                    }
                }
            }
        }

        if (obstacles.length > 0 && obstacles[0].x < -obstacles[0].width) {
            showTemporaryMessage('Rossz!', 60, 'red');
            resetForNewRound();
        }

        if (questionState.display) showQuestion(ctx, questionState, canvas);
        updateScore(ctx, score);
        if (hasShield) drawShieldStatus(ctx);
        if (displayMessage.ttl > 0) {
            drawMessage(ctx, canvas, displayMessage.text, displayMessage.color);
            displayMessage.ttl--;
        }
    } else if (gameState === 'gameOver') {
        drawGameOverScreen(ctx, canvas, score);
    }

    updateParticles();
    drawParticles(ctx);

    requestAnimationFrame(updateGame);
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && gameState === 'playing') {
        if (roundJustStarted) {
            character.gravity = 0.5;
            roundJustStarted = false;
        }
        character.jump();
        playJumpSound();
    }
});

canvas.addEventListener('click', function(event) {
    if (gameState === 'gameOver') {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const buttonX = canvas.width / 2 - 100;
        const buttonY = canvas.height / 2 + 20;
        if (x >= buttonX && x <= buttonX + 200 && y >= buttonY && y <= buttonY + 50) {
            restartGame();
        }
    }
});

async function init() {
    setCanvasSize(canvas);
    window.addEventListener("resize", () => setCanvasSize(canvas));

    // Show a loading message
    ctx.fillStyle = "black";
    ctx.font = "20px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("Loading assets...", canvas.width / 2, canvas.height / 2);

    assets = await loadGameAssets();

    playBackgroundMusic();
    await resetForNewRound();
    updateGame();
}

init();
