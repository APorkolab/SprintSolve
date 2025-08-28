import { shieldImage } from './powerups.js';

export function setCanvasSize(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

export function drawStartScreen(ctx, canvas) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '40px "Press Start 2P"';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('SprintSolve', canvas.width / 2, canvas.height / 2 - 80);

    ctx.fillStyle = '#FF6A00';
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 20, 200, 50);
    ctx.font = '20px "Press Start 2P"';
    ctx.fillStyle = 'white';
    ctx.fillText('Start Game', canvas.width / 2, canvas.height / 2 + 55);
}

export function drawGameOverScreen(ctx, canvas, score) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '40px "Press Start 2P"';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 80);

    ctx.font = '20px "Press Start 2P"';
    ctx.fillText(`Pontszám: ${score.value}`, canvas.width / 2, canvas.height / 2 - 20);

    // "Play Again" gomb
    ctx.fillStyle = '#FF6A00';
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 20, 200, 50);
    ctx.font = '20px "Press Start 2P"';
    ctx.fillStyle = 'white';
    ctx.fillText('Play Again', canvas.width / 2, canvas.height / 2 + 55);
}

export function updateScore(ctx, score) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Pontszám: " + score.value, 10, 60);
}

export function showQuestion(ctx, question) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(question.text, 10, 30);
}

export function drawMessage(ctx, canvas, text) {
    ctx.font = '24px "Press Start 2P"';
    ctx.fillStyle = 'rgba(255, 0, 0, 1)';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 120);
    ctx.textAlign = 'left'; // Reset alignment
}

export function drawShieldStatus(ctx) {
    ctx.drawImage(shieldImage, 10, 90, 40, 40);
}

export function drawCategorySelectScreen(ctx, canvas, categories) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px "Press Start 2P"'; // Smaller font for longer text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Select a Category', canvas.width / 2, canvas.height / 2 - 180);

    if (categories.length === 0) {
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText('Loading categories...', canvas.width / 2, canvas.height / 2);
        return;
    }

    const buttonHeight = 40;
    const buttonPadding = 15;
    // Simple pagination might be needed for many categories, but for now, we'll just display the first few.
    const displayCategories = categories.slice(0, 5);
    const totalHeight = (buttonHeight + buttonPadding) * displayCategories.length - buttonPadding;
    let startY = (canvas.height - totalHeight) / 2;

    displayCategories.forEach((category, index) => {
        const y = startY + index * (buttonHeight + buttonPadding);
        ctx.fillStyle = '#FF6A00';
        ctx.fillRect(canvas.width / 2 - 200, y, 400, buttonHeight);
        ctx.font = '14px "Press Start 2P"';
        ctx.fillStyle = 'white';
        ctx.fillText(category.name, canvas.width / 2, y + 25);
    });
}
