export const particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.color = `hsl(${Math.random() * 60 + 0}, 100%, 50%)`; // Red-orange-yellow palette
        this.ttl = Math.random() * 100 + 50; // Time to live
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.ttl--;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function createExplosion(x, y) {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y));
    }
}

export function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].ttl <= 0) {
            particles.splice(i, 1);
        }
    }
}

export function drawParticles(ctx) {
    particles.forEach(p => p.draw(ctx));
}
