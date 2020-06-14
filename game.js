
function drawCanvas() {
    let canvas = document.querySelector("canvas");
    let c = canvas.getContext("2d");

    for (let i = 0; i < canvas.width; i += 40) {
        for (let j = 0; j < canvas.height; j += 40) {
            c.fillStyle = "#dfdede";
            c.fillRect(i, j, 39, 39);
        }
    }
}

function drawSnake(location) {
    let canvas = document.querySelector("canvas");
    let c = canvas.getContext("2d");

    for (let i = 0; i < location.length; i++) {
        c.fillStyle = "#2a2a28";
        c.fillRect(location[i].x * 40, location[i].y * 40, 39, 39);
    }
}

function drawCabbage(location) {
    let canvas = document.querySelector("canvas");
    let c = canvas.getContext("2d");

    c.fillStyle = "#38d076";
    c.fillRect(location.x * 40, location.y * 40, 39, 39);
}

function generateRandomLocation(maxX, maxY) {
    let x = Math.floor(Math.random() * maxX);
    let y = Math.floor(Math.random() * maxY);
    return { x: x, y: y };
}

function newDirectionIsValid(oldDirection, newDirection) {
    if (oldDirection === "right" && newDirection === "left") {
        return false;
    } else if (oldDirection === "left" && newDirection === "right") {
        return false;
    } else if (oldDirection === "up" && newDirection === "down") {
        return false;
    } else if (oldDirection === "down" && newDirection === "up") {
        return false;
    } else {
        return true;
    }
}

function moveSnake(snake, dir) {
    let newHead = {};
    if (dir == "right") {
        newHead = { x: snake[0].x + 1, y: snake[0].y };
    } else if (dir == "left") {
        newHead = { x: snake[0].x - 1, y: snake[0].y };
    } else if (dir == "up") {
        newHead = { x: snake[0].x, y: snake[0].y - 1 };
    } else if (dir == "down") {
        newHead = { x: snake[0].x, y: snake[0].y + 1 };
    }
    snake.unshift(newHead);
    return snake;
}

function hitSnake(location, snakeBody) {
    let found = snakeBody.filter(element => {
        return (element.x === location.x && element.y === location.y);
    });
    if (found.length > 0) {
        return true;
    }
    return false;
}

function hitCabbage(snakeHead, cabbage) {
    if (snakeHead.x === cabbage.x && snakeHead.y === cabbage.y) {
        return true;
    } else {
        return false;
    }
}

function hitWall(head) {
    if (head.x > WIDTH || head.y > HEIGHT || head.x < 0 || head.y < 0) {
        return true;
    } else {
        return false;
    }
}

function keyListener(event) {
    if (event.keyCode === 37) {
        newDirection = "left";
    } else if (event.keyCode === 38) {
        newDirection = "up";
    } else if (event.keyCode === 39) {
        newDirection = "right";
    } else if (event.keyCode === 40) {
        newDirection = "down";
    } else if (event.keyCode === 32) {
        if (paused) {
            paused = false;
            rAFId = requestAnimationFrame(playGame);
        } else {
            paused = true;
            cancelAnimationFrame(rAFId);
        }
    }
}

window.addEventListener("keydown", keyListener);


const WIDTH = 20;
const HEIGHT = 15;
let level = 1;
let cabbagesEaten = 0;
let livesRemaining = 1;
let paused = false;
let newDirection = "right";
let speed = 400;
let levelTimeAccumulator = 0;
let lastRedrawTime = 0;
let accumulatedTime = 0;
let previousSnake = [];
let snake = [{ x: 2, y: 3 }, { x: 2, y: 2 }];
let dir = "right";
let rAFId = null;

let cabbage = generateRandomLocation(WIDTH, HEIGHT);

let gameInfo = document.querySelector('#game-info');

function playGame(time) {

    accumulatedTime += time - lastRedrawTime;
    levelTimeAccumulator += time - lastRedrawTime;

    // Time to change the level ?
    if (levelTimeAccumulator >= 30000) {
        speed = speed * 0.8;
        level++;
        levelTimeAccumulator = 0;
    }

    // Time to redraw the canvas ?
    if (accumulatedTime >= speed) {

        // If last arrowkey pressed is a valid new direction
        if (newDirectionIsValid(dir, newDirection)) {
            dir = newDirection;
        }

        previousSnake = [...snake];
        snake = moveSnake(snake, dir);

        // New snake head hits the cabbage ?
        if (hitCabbage(snake[0], cabbage)) {
            cabbagesEaten++;
            // create new cabbage (anywhere but on top of the snake)
            do {
                cabbage = generateRandomLocation(WIDTH, HEIGHT);
            } while (hitSnake(cabbage, snake));
        } else {
            // No cabbage eaten, no tail "growth"
            snake.pop();
        }

        // New snake head hits the wall
        if (hitWall(snake[0])) {
            livesRemaining--;
        }

        // New snake head hits own body
        if (hitSnake(snake[0], previousSnake)) {
            livesRemaining--;
        }

        gameInfo.textContent = `level: ${level} / elud: ${livesRemaining} / punktid: ${cabbagesEaten}`;

        drawCanvas();
        drawSnake(snake);
        drawCabbage(cabbage);

        accumulatedTime = 0;
    }

    lastRedrawTime = time;

    if (livesRemaining === 0) {
        if (confirm('Kaotasid ! Vajuta OK et uuesti proovida.')) {
            window.location = '/snake-game/';
        }
        return;
    }
    rAFId = requestAnimationFrame(playGame);
}

rAFId = requestAnimationFrame(playGame);

