export const obstacles = [];

export function generateHorizontalObstacles(canvas, character, question) {
    const gap = character.size * 3;
    const obstacleWidth = 20;
    const yPos = canvas.height / 2 - gap / 2;
    const xPos = canvas.width / 2 - (obstacleWidth / 2);

    obstacles.length = 0; // Clear existing obstacles

    const isMovingSet = Math.random() < 0.25; // 25% chance for the whole set to be moving
    const moveRange = [canvas.height / 2 - 100, canvas.height / 2 + 100];
    let vy = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1); // Random vertical speed and direction

    if (question.display) {
        for (let i = 0; i < question.answers.length; i++) {
            obstacles.push({
                x: xPos + i * obstacleWidth,
                y: yPos,
                width: obstacleWidth,
                height: canvas.height - yPos,
                isCorrectAnswer: i === question.correctAnswer,
                isMoving: isMovingSet,
                vy: vy,
                moveRange: moveRange,
                draw: function (ctx) {
                    ctx.fillStyle = this.isMoving ? '#CC0000' : '#FF4500'; // Different color for moving obstacles
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                },
                update: function (gameSpeed) {
                    this.x -= gameSpeed;
                    if (this.isMoving) {
                        this.y += this.vy;
                        if (this.y < this.moveRange[0] || this.y > this.moveRange[1]) {
                            this.vy *= -1;
                        }
                    }
                }
            });
        }
    }
}

export function checkCollisions(character, question) {
    for (const obstacle of obstacles) {
        if (
            character.x + character.size / 2 > obstacle.x &&
            character.x - character.size / 2 < obstacle.x + obstacle.width &&
            character.y + character.size / 2 > obstacle.y
        ) {
            return obstacle.isCorrectAnswer ? 'correct' : 'incorrect';
        }
    }
    return null; // No collision
}
