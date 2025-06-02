// filepath: FlappyBirdGame/FlappyBirdGame/src/script.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    jump: function() {
        this.velocity += this.lift;
    },
    update: function() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    show: function() {
        const birdImg = new Image();
        birdImg.src = 'assets/bird.png';
        ctx.drawImage(birdImg, this.x, this.y, this.width, this.height);
    }
};

let pipes = [];
let score = 0;
let frame = 0;
const pipeWidth = 50;
const pipeGap = 100;

function setup() {
    document.addEventListener('keydown', () => {
        bird.jump();
    });

    setInterval(() => {
        if (frame % 75 === 0) {
            let pipeHeight = Math.random() * (canvas.height - pipeGap - 20) + 20;
            pipes.push({
                x: canvas.width,
                top: pipeHeight,
                bottom: canvas.height - pipeHeight - pipeGap
            });
        }

        update();
        draw();
        frame++;
    }, 1000 / 60);
}

function update() {
    bird.update();

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
        }

        if (bird.x + bird.width > pipes[i].x && bird.x < pipes[i].x + pipeWidth) {
            if (bird.y < pipes[i].top || bird.y + bird.height > canvas.height - pipes[i].bottom) {
                resetGame();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(new Image().src = 'assets/bg.png', 0, 0, canvas.width, canvas.height);
    bird.show();

    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function resetGame() {
    pipes = [];
    score = 0;
    bird.y = 150;
    bird.velocity = 0;
}

window.onload = setup;