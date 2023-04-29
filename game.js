const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let score = 0;
let obstaclesPassed = 0;
let questionDelay = 15000; // 15 seconds
const questionTimeout = 15 * 1000;
let questionTimer = questionTimeout;

setCanvasSize();
window.addEventListener("resize", setCanvasSize);

const question = {
    text: "",
    correctAnswer: "",
    answers: [],
    display: false,
    timer: 0
};

const character = {
    x: 50,
    y: canvas.height / 2,
    size: 60, // Méret növelése
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
    draw: function () {
        const characterImage = document.getElementById("characterImage");
        const frameWidth = characterImage.width / this.totalFrames;

        ctx.drawImage(characterImage, frameWidth * this.currentFrame, 0,
            frameWidth,
            characterImage.height,
            character.x - character.size / 2, character.y - character.size / 2, character.size, character.size);

        this.frameCount++;

        if (this.frameCount > 10) {
            this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
            this.frameCount = 0;
        }
    },
    update: function () {
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


const obstacles = [];
function generateObstacles() {
    if (!question.display) {
    const minHeight = 20;
    const maxHeight = canvas.height / 4 - minHeight;
    const gap = 150;
    const obstacleWidth = 50;

    let lastObstacle = obstacles.length > 0 ? obstacles[obstacles.length - 1] : null;
    if (!lastObstacle || lastObstacle.x < canvas.width - obstacleWidth * 3) {
        const correctAnswerPosition = Math.floor(Math.random() * 4);

        for (let i = 0; i < 4; i++) {
            let obstacleY = (canvas.height / 4) * i;

            obstacles.push({
                x: canvas.width,
                y: obstacleY,
                width: obstacleWidth,
                height: Math.random() * (maxHeight - minHeight) + minHeight,
                isCorrectAnswer: i === correctAnswerPosition,
                draw: function() {
                    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--obstacle-color').trim();
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                },
                update: function() {
                    this.x -= 2;
                    }
                });
            }
        }
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        character.jump();
    }
});

function showQuestion() {
    if (!question.display) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(question.text, 10, 30);
    }
}


// Frissítse az updateGame függvényt, hogy a kérdést is megjelenítse:

function updateScore() {
    if (!question.display) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Pontszám: " + score, 10, 60);
    }
}



function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    character.fall();
    character.draw();

    if (!question.display) {
        questionTimer -= 1000 / 60; // 60 FPS-hez igazítva
        if (questionTimer <= 0) {
            question.display = true;
            questionTimer = questionTimeout;
        }
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        obstacles[i].draw();
        obstacles[i].checkCollision && obstacles[i].checkCollision();
    }

    if (!question.display) {
        showQuestion();
    } else {
        questionTimer -= 1000 / 60; // 60 FPS-hez igazítva
        if (questionTimer <= 0) {
            question.display = true;
            questionTimer = questionTimeout;
        }
    }

    updateScore();

    requestAnimationFrame(updateGame);
}

updateGame();


async function fetchQuestion() {
    const response = await fetch("questions.php");
    const data = await response.json();

    question.text = data.question;
    question.correctAnswer = data.correct_answer;
    question.display = true;
    question.answers = data.answers;

    // Töröljük a meglévő akadályokat
    obstacles.length = 0;
    // Hozzuk létre az új vízszintes akadályokat
    generateHorizontalObstacles();

    setTimeout(fetchQuestion, questionDelay);
}


fetchQuestion();

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function generateHorizontalObstacles() {
    const gap = character.size * 3; // Nagyobb rés a karakter számára
    const obstacleWidth = 20;
    const yPos = canvas.height / 2 - gap / 2;
    const xPos = canvas.width / 2 - (obstacleWidth / 2);

    if (question.display) {
        // Akadályok generálása..
        for (let i = 0; i < question.answers.length; i++) {
            const isCorrectAnswer = question.correctAnswer === question.answers[i];
            obstacles.push({
                x: xPos + i * obstacleWidth,
                y: yPos,
                width: obstacleWidth,
                height: canvas.height - yPos,
                isCorrectAnswer: isCorrectAnswer,
                draw: function () {
                    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--obstacle-color').trim();
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                },
                update: function () {
                    if (question.display) {
                        this.x -= 2;
                    }
                },
                checkCollision: function () {
                    if (
                        character.x + character.size > this.x &&
                        character.x - character.size < this.x + this.width &&
                        character.y + character.size > this.y
                    ) {
                        if (this.isCorrectAnswer) {
                            score++; // Növelje a pontszámot, ha helyes választ választott
                            question.display = false; // Rejtse el a kérdést
                            questionTimer = questionTimeout; // Állítsa vissza az időzítőt
                            fetchQuestion(); // Töltse be a következő kérdést
                        } else {
                            gameOver();
                        }
                    }
                }
            });
        }
    } else {
        obstacles.length = 0;
    }
}


function gameOver() {
    // Állítsa le a játékot és mutassa a Game Over üzenetet
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2 - 20);

    // Újraindítási logika
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        character.y = canvas.height / 2;
        obstacles.length = 0;
        score = 0;
        question.display = false;
        questionTimer = questionTimeout;
        updateGame();

        // Hívja meg a fetchQuestion függvényt új kérdés betöltéséhez
        fetchQuestion();
    }, 3000); // 3 másodperces késleltetés az újraindítás előtt
}
updateGame();