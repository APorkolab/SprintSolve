// Using free, public domain sounds from freesound.org for placeholder purposes.
// It is recommended to host your own assets.

const sounds = {
    jump: new Audio('https://freesound.org/data/previews/135/135936_2434988-lq.mp3'),
    score: new Audio('https://freesound.org/data/previews/270/270319_5123851-lq.mp3'),
    gameOver: new Audio('https://freesound.org/data/previews/219/219244_4082829-lq.mp3'),
    background: new Audio('https://freesound.org/data/previews/396/396740_5218259-lq.mp3'),
};

// Set properties for background music
sounds.background.loop = true;
sounds.background.volume = 0.3;

export function playJumpSound() {
    sounds.jump.currentTime = 0;
    sounds.jump.play();
}

export function playScoreSound() {
    sounds.score.currentTime = 0;
    sounds.score.play();
}

export function playGameOverSound() {
    sounds.gameOver.currentTime = 0;
    sounds.gameOver.play();
}

export function playBackgroundMusic() {
    sounds.background.play();
}

export function stopBackgroundMusic() {
    sounds.background.pause();
    sounds.background.currentTime = 0;
}
