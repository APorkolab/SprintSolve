export const character = {
    x: 150, // Fixed horizontal position
    y: 0, // Will be initialized later
    size: 60,
    velocity_y: 0,
    gravity: 0.5,
    jump_strength: -10,
    jump: function () {
        this.velocity_y = this.jump_strength;
    },
    draw: function (ctx, characterImage) {
        if (!characterImage) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        // Rotate based on vertical velocity for a more dynamic feel
        const angle = Math.atan2(this.velocity_y, 20) * 0.3;
        ctx.rotate(angle);

        // Draw the entire GIF. The browser handles the animation.
        ctx.drawImage(characterImage, -this.size / 2, -this.size / 2, this.size, this.size);

        ctx.restore();
    },
    update: function () {
        this.velocity_y += this.gravity;
        this.y += this.velocity_y;
    }
};
