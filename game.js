const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let score = 0;
let obstaclesPassed = 0;


setCanvasSize();
window.addEventListener("resize", setCanvasSize);

const question = {
    text: "",
    correctAnswer: "",
    display: false,
    timer: 0
};

const character = {
    x: 50,
    y: canvas.height / 2,
    size: 60, // Méret növelése
    speed: 3,
    gravity: 0.5,
    frameIndex: 0,
    frameCount: 0,
    totalFrames: 49, // A GIF összes képkockájának száma
    jump: function () {
        this.y -= this.speed;
    },
    fall: function () {
        this.y += this.gravity;
    },
    draw: function () {
        const characterImage = document.getElementById("characterImage");
        const frameWidth = characterImage.height / this.totalFrames;

         ctx.drawImage(
            characterImage,
            frameWidth * this.frameIndex,
            0,
            frameWidth,
            characterImage.height,
            this.x - this.size,
            this.y - this.size,
            this.size * 2,
            this.size * 2
        );

        this.frameCount++;

        if (this.frameCount > 10) {
            this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
            this.frameCount = 0             ;
        }
    },
};


const obstacles = [];
function generateObstacles() {
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


document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        character.jump();
    }
});

function showQuestion() {
    if (question.display) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(question.text, canvas.width / 2 - ctx.measureText(question.text).width / 2, canvas.height / 2);
    }
}


// Frissítse az updateGame függvényt, hogy a kérdést is megjelenítse:

function updateScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Pontszám: " + score, 10, 60);
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    character.fall();
    character.draw();

    generateObstacles();

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        obstacles[i].draw();

        // Ütközés ellenőrzése
        if (
            character.x + character.size > obstacles[i].x &&
            character.x - character.size < obstacles[i].x + obstacles[i].width &&
            character.y - character.size < obstacles[i].y + obstacles[i].height &&
            character.y + character.size > obstacles[i].y
        ) {
            if (obstacles[i].isCorrectAnswer) {
                // Ha a játékos sikeresen áthalad a helyes válaszon, növelje a pontszámot
                score++;
            } else {
                // Ütközés esetén újraindítja a játékot
                obstacles.length = 0;
                character.y = canvas.height / 2;
                score = 0;
            }
        }
    }

    showQuestion();
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
}

fetchQuestion(); // Hívja meg a függvényt a játék kezdetekor

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

