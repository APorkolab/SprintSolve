import { character } from './character.js';
import { wrapText } from './utils.js';

export const obstacles = []; // This will hold the wall segments
export const tunnels = []; // This will hold the tunnel data for collision and text rendering

export function generateWallWithTunnels(canvas, questionState) {
    obstacles.length = 0; // Clear existing wall segments
    tunnels.length = 0; // Clear existing tunnels

    const wallWidth = 100;
    const numberOfTunnels = 4;
    // Ensure there's a minimum gap, e.g., 1.5 times character size
    const tunnelHeight = Math.max(150, character.size * 1.5);
    const wallColor = '#FF4500';

    // Calculate the total height of the solid parts of the wall
    const totalTunnelHeight = numberOfTunnels * tunnelHeight;
    const totalWallHeight = canvas.height - totalTunnelHeight;

    if (totalWallHeight < 0) {
        console.error("Not enough space for tunnels. Reduce tunnel height or number of tunnels.");
        return;
    }

    // The height of each wall segment (5 segments for 4 tunnels)
    const wallSegmentHeight = totalWallHeight / (numberOfTunnels + 1);

    let currentY = 0;

    for (let i = 0; i < numberOfTunnels + 1; i++) {
        // Add wall segment
        obstacles.push({
            x: canvas.width,
            y: currentY,
            width: wallWidth,
            height: wallSegmentHeight,
            isWall: true,
            draw: function (ctx, wallImage) { // wallImage passed as argument
                ctx.fillStyle = wallColor;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                // The wallImage is not suitable for the new design, so we don't draw it.
                // If we wanted to use it, we would do it here.
            },
            update: function (gameSpeed) {
                this.x -= gameSpeed;
            }
        });

        // Add tunnel after the segment (except for the last one)
        if (i < numberOfTunnels) {
            const tunnelY = currentY + wallSegmentHeight;
            tunnels.push({
                x: canvas.width,
                y: tunnelY,
                width: wallWidth,
                height: tunnelHeight,
                isCorrect: i === questionState.correctAnswer,
                answerText: questionState.answers[i],
                draw: function (ctx) {
                    // Tunnels are empty space, but we draw the answer text in them.
                    ctx.fillStyle = "white";
                    ctx.font = "14px 'Press Start 2P'";
                    ctx.textAlign = "center";

                    const maxWidth = this.width - 10; // Padding
                    const lineHeight = 18;
                    const x = this.x + this.width / 2;
                    const y = this.y + this.height / 2;

                    wrapText(ctx, this.answerText, x, y, maxWidth, lineHeight);

                    ctx.textAlign = "left"; // Reset alignment
                },
                update: function (gameSpeed) {
                    this.x -= gameSpeed;
                }
            });
            currentY += wallSegmentHeight + tunnelHeight;
        }
    }
}

export function checkCollisions(character, canvas) {
    // 1. Check for floor and ceiling collisions
    if (character.y - character.size / 2 <= 0) {
        return 'ceiling';
    }
    if (character.y + character.size / 2 >= canvas.height) {
        return 'floor';
    }

    // Only perform wall/tunnel collision checks if there are obstacles
    if (obstacles.length === 0) {
        return null;
    }

    const wallX = obstacles[0].x;
    const wallWidth = obstacles[0].width;
    const charRight = character.x + character.size / 2;
    const charLeft = character.x - character.size / 2;

    // Check for collision only when the character is horizontally aligned with the wall
    if (charRight < wallX || charLeft > wallX + wallWidth) {
        return null;
    }

    // 2. Check for wall collision (with solid parts)
    for (const obstacle of obstacles) {
        if (
            charRight > obstacle.x &&
            charLeft < obstacle.x + obstacle.width &&
            character.y + character.size / 2 > obstacle.y &&
            character.y - character.size / 2 < obstacle.y + obstacle.height
        ) {
            return 'wall'; // Collision with a solid wall segment
        }
    }

    // 3. If no wall collision, it must be in a tunnel. Determine which one.
    // This code runs only if the character is horizontally overlapping the wall structure.
    for (const tunnel of tunnels) {
        if (
            character.y >= tunnel.y &&
            character.y <= tunnel.y + tunnel.height
        ) {
            // The character is vertically aligned with this tunnel.
            // Since we already checked for wall collision, passing through here is a success.
            return tunnel.isCorrect ? 'correct' : 'incorrect';
        }
    }

    // This part should ideally not be reached if the character is within the wall's x-span,
    // but as a fallback, we can consider it a wall hit.
    return 'wall';
}
