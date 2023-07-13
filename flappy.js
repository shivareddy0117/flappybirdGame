var canvas = document.getElementById('gameCanvas');
canvas.width = 800;  // Set the canvas width to 800 pixels
canvas.height = 600;  // Set the canvas height to 600 pixels
var ctx = canvas.getContext('2d');



// Game Objects
var bird = {
    x: 144,
    y: 150,
    velocity: 0
};
var pipes = [];
pipes.push({
    x: canvas.width,
    width: 50,
    height: Math.floor(Math.random() * (canvas.height - 200) + 50)
});

// Game Variables
var gravity = 0.5;
var gap = 170;
var score = 0;
var gameRunning = false;

var countdownValue = 3;
var countdown = setInterval(function() {
    countdownValue--;
    if(countdownValue <= 0) {
        gameRunning = true;
        clearInterval(countdown);
    }
}, 1000);

// Game Loop
function draw() {
    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Bird
    ctx.fillStyle = "red";
    ctx.fillRect(bird.x, bird.y, 20, 20);

    // Draw Pipes
    for(var i = 0; i < pipes.length; i++) {
        ctx.fillStyle = "green";
        ctx.fillRect(pipes[i].x, 0, pipes[i].width, pipes[i].height);
        ctx.fillRect(pipes[i].x, pipes[i].height + gap, pipes[i].width, canvas.height - pipes[i].height - gap);

        // Move Pipes
        if(gameRunning) {
            pipes[i].x--;

            // Create New Pipes
            if(pipes[i].x == 200) {
                pipes.push({
                    x: canvas.width,
                    width: 50,
                    height: Math.floor(Math.random() * (canvas.height - 200) + 50)
                });
            }

            // Detect Collision
            if(bird.y + 20 > canvas.height || 
                (bird.x < pipes[i].x + pipes[i].width &&
                bird.x + 20 > pipes[i].x &&
                bird.y < pipes[i].height) ||
                (bird.x < pipes[i].x + pipes[i].width &&
                bird.x + 20 > pipes[i].x &&
                bird.y + 20 > pipes[i].height + gap)
            ) {
                gameRunning = false;
            }

            // Increase Score
            if(pipes[i].x == bird.x) {
                score++;
            }
        }
    }

    // Draw Score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, canvas.height - 20);

    // Draw Countdown
    if(!gameRunning && countdownValue > 0) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(countdownValue, canvas.width/2, canvas.height/2);
    }

    // Apply Gravity
    if(gameRunning) {
        bird.velocity += gravity;
        bird.y += bird.velocity;
    }

    // Call Game Loop
    if(gameRunning || countdownValue > 0){
        requestAnimationFrame(draw);
    } else {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
    }
}

// Event Listener for Jumping
window.addEventListener('keydown', function(e) {
    if(e.key == " " && (gameRunning || countdownValue > 0)){
        bird.velocity = -5;
    }
});

// Start Game
draw();
