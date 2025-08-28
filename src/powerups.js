export const activePowerups = [];

export const shieldImage = new Image();
shieldImage.src = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJtMTIgMjEuNzVsLTguNzUtMy43N3YtOC4xM2MwLTMuNTUgMi4yOS02LjggNS42Mi04LjM4bDIuMjUtMS4wMWwxLjYyLTAuNzNsMS4yNi0wLjU2bDEuMjUgMC41NmwxLjYyIDAuNzNsMi4yNSAxLjAxbDUuNjIgOC4zOHY4LjEzbC04Ljc1IDMuNzdtMCAwIiBmaWxsPSIjZmZmIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41Ii8+PHBhdGggZD0ibTEyIDIxLjc1bC04Ljc1LTMuNzd2LTguMTNjMC0zLjTUDIuMjktNi44IDUuNjItOC4zOGwyLjI1LTEuMDFsMS42Mi0wLjczbDQuMTMgMS44NWw1LjYyIDguMzh2OC4xM2wtOC43NSAzLjc3bTAgMCIgZmlsbD0iIzQxN2VmNCIvPjwvc3ZnPg==';

const slowmoImage = new Image();
slowmoImage.src = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMC41IiBmaWxsPSIjZmZmIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41Ii8+PHBhdGggZD0iTTEyIDYuNXY1LjVoMy45IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=';


export function spawnPowerup(canvas) {
    const powerupTypes = ['shield', 'slowmo'];
    const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];

    const powerup = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 100) + 50, // Avoid spawning too close to edges
        size: 40,
        type: type,
    };
    activePowerups.push(powerup);
}

export function updatePowerups(gameSpeed) {
    for (let i = activePowerups.length - 1; i >= 0; i--) {
        const powerup = activePowerups[i];
        powerup.x -= gameSpeed;

        // Remove power-up if it goes off-screen
        if (powerup.x + powerup.size < 0) {
            activePowerups.splice(i, 1);
        }
    }
}

export function drawPowerups(ctx) {
    activePowerups.forEach(powerup => {
        if (powerup.type === 'shield') {
            ctx.drawImage(shieldImage, powerup.x, powerup.y, powerup.size, powerup.size);
        } else if (powerup.type === 'slowmo') {
            ctx.drawImage(slowmoImage, powerup.x, powerup.y, powerup.size, powerup.size);
        }
    });
}
