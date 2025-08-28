export const character = {
    x: 50,
    y: 0, // Will be initialized later
    size: 60,
    speed: 3,
    gravity: 0,
    frameIndex: 0,
    frameCount: 0,
    currentFrame: 0,
    totalFrames: 49, // A GIF összes képkockájának száma
    jump: function () {
        this.y -= this.speed;
    },
    fall: function () {
        this.y += this.gravity;
    },
    draw: function (ctx) {
        const characterImage = document.getElementById("characterImage");
        const frameWidth = characterImage.width / this.totalFrames;

        ctx.drawImage(characterImage, frameWidth * this.currentFrame, 0,
            frameWidth,
            characterImage.height,
            this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

        this.frameCount++;

        if (this.frameCount > 10) {
            this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
            this.frameCount = 0;
        }
    },
    update: function (question) {
        if (question.display) {
            this.gravity = 0.5;
        } else {
            this.gravity = 0;
        }
        this.currentFrame++;
        if (this.currentFrame >= this.totalFrames) {
            this.currentFrame = 0;
        }
    }
};
