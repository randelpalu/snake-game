
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

    for (let i = 0; i < location.length; i++) {
        c.fillStyle = "#38d076";
        c.fillRect(location[i].x * 40, location[i].y * 40, 39, 39);
    }
}

function generateRandomLocation(maxX, maxY) {
    let x = Math.floor(Math.random() * maxX);
    let y = Math.floor(Math.random() * maxY);
    return { x: x, y: y };
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
    }
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
    snake.pop();  // remove the tail element, if no cabbage was eaten
    newHead = {};
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

let newDirection = "right";

function init() {
    let level = 1;
    let speed = 400;
    let cabbagesEaten = 0;
    let levelTimeAccumulator = 0;
    let lastRedrawTime = 0;
    let accumulatedTime = 0;
    let snake = [{ x: 2, y: 3 }, { x: 2, y: 2 }, { x: 2, y: 1 }];
    let dir = "right";

    let cabbage = [generateRandomLocation(20, 15)];

    window.addEventListener("keydown", keyListener);

    function refreshGame(time) {
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
            // If last arrowkey pressed is valid direction
            if (newDirectionIsValid(dir, newDirection)) {
                dir = newDirection;
            }

            snake = moveSnake(snake, dir);
            drawCanvas();
            drawSnake(snake);
            drawCabbage(cabbage);

            accumulatedTime = 0;
        }

        lastRedrawTime = time;
        requestAnimationFrame(refreshGame);
    }

    requestAnimationFrame(refreshGame);
}
