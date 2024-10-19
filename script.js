function Snake() {
  this.direction = "right"; // Default direction

  this.snake = [
    {
      left: 500,
      top: 380,
    },
    {
      left: 480,
      top: 380,
    },
    {
      left: 460,
      top: 380,
    },
  ];

  this.apples = [];

  this.board = {
    height: 800,
    width: 1600,
  };

  this.element = 20;
}

// Starts the game and adds event listeners for the arrow keys to change the snake direction and the game loop interval
Snake.prototype.start = function () {
  let _this = this;
  let board = document.getElementById("game-board");

  if (
    board.style.height !== this.board.height + "px" &&
    board.style.width !== this.board.width + "px"
  ) {
    board.style.height = this.board.height + "px";
    board.style.width = this.board.width + "px";
  }

  document.addEventListener("keydown", function (event) {
    const key = event.key;

    let newDirection;

    switch (key) {
      case "ArrowUp":
        newDirection = "up";
        break;
      case "ArrowRight":
        newDirection = "right";
        break;
      case "ArrowDown":
        newDirection = "down";
        break;
      case "ArrowLeft":
        newDirection = "left";
        break;
    }
    if (["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(key)) {
      _this.direction = key.toLowerCase().replace("arrow", "");
    }
  });

  for (let i = 0; i < 5; i++) {
    this.addApple();
  }

  this.render();
};

// Renders the snake and apples on the game board and updates the game loop interval
Snake.prototype.render = function () {
  let _this = this;

  window.setInterval(() => {
    _this.move();
    _this.checkCollision();

    let board = document.getElementById("game-board");
    board.innerHTML = "";

    if (_this.snake.length > 0) {
      for (let i = 0; i < _this.snake.length; i++) {
        let snake = document.createElement("div");

        snake.style.width = _this.element + "px";
        snake.style.height = _this.element + "px";
        snake.style.left = _this.snake[i].left + "px";
        snake.style.top = _this.snake[i].top + "px";
        snake.classList.add("element", "snake");

        board.appendChild(snake);
      }
    }

    if (_this.apples.length > 0) {
      for (let i = 0; i < _this.apples.length; i++) {
        let apple = document.createElement("div");

        apple.style.width = _this.element + "px";
        apple.style.height = _this.element + "px";
        apple.style.left = _this.apples[i].left + "px";
        apple.style.top = _this.apples[i].top + "px";
        apple.classList.add("element", "apple");

        board.appendChild(apple);
      }
    }
  }, 200);
};

// Adds a new apple to the game board at a random position that doesn't collide with the snake or other apples on the board
Snake.prototype.addApple = function () {
  this.apples.push(this.getRandomPosition());
};

Snake.prototype.getRandomPosition = function () {
  let left =
    this.randomNumber(0, this.board.width / this.element) * this.element;
  let top =
    this.randomNumber(0, this.board.height / this.element) * this.element;

  while (this.isValidPosition(left, top) === false) {
    left = this.randomNumber(0, this.board.width / this.element) * this.element;
    top = this.randomNumber(0, this.board.height / this.element) * this.element;
  }

  return {
    left: left,
    top: top,
  };
};

// Moves the snake in the current direction
Snake.prototype.move = function () {
  let newHead = { ...this.snake[0] };

  switch (this.direction) {
    case "up":
      newHead.top -= this.element;
      break;
    case "right":
      newHead.left += this.element;
      break;
    case "down":
      newHead.top += this.element;
      break;
    case "left":
      newHead.left -= this.element;
      break;
  }

  let ateApple = false;

  for (let i = 0; i < this.apples.length; i++) {
    if (
      newHead.left === this.apples[i].left &&
      newHead.top === this.apples[i].top
    ) {
      this.apples.splice(i, 1);
      ateApple = true;
      this.addApple();
      break;
    }
  }

  this.snake.unshift(newHead);
  if (!ateApple) {
    this.snake.pop();
  }
};

// Generates a random number between min and max
Snake.prototype.randomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Checks if the apple position collides with existing apples, the snake or if it's inside the gameboard limits
Snake.prototype.isValidPosition = function (left, top) {
  if (this.apples.length > 0) {
    for (let i = 0; i < this.apples.length; i++) {
      if (this.apples[i].left === left && this.apples[i].top === top) {
        return false;
      }
    }
  }

  if (this.snake.length > 0) {
    for (let i = 0; i < this.snake.length; i++) {
      if (this.snake[i].left === left && this.snake[i].top === top) {
        return false;
      }
    }
  }

  return true;
};

// Displays the game over screen and stops the game loop interval when the snake collides with itself or the gameboard limits
Snake.prototype.gameOverScreen = function () {
  clearInterval(this.interval); // Stop game loop interval

  let board = document.getElementById("game-board");
  board.innerHTML = "";

  let overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.flexDirection = "column";

  let gameOver = document.createElement("div");
  gameOver.classList.add("game-over");
  gameOver.innerHTML = "Game Over!";
  gameOver.style.fontSize = "48px";
  gameOver.style.color = "red";
  gameOver.style.fontWeight = "bold";
  gameOver.style.textAlign = "center";

  let restartButton = document.createElement("button");
  restartButton.innerHTML = "Restart";
  restartButton.style.marginTop = "20px";
  restartButton.style.padding = "10px 20px";
  restartButton.style.fontSize = "24px";
  restartButton.addEventListener("click", function () {
    window.location.reload(); // Simple page reload to restart the game (not the best solution)
  });

  overlay.appendChild(gameOver);
  overlay.appendChild(restartButton);
  board.appendChild(overlay);
};

// Checks if the snake collides with itself or the gameboard limits and displays the game over screen if it does
Snake.prototype.checkCollision = function () {
  if (this.snake.length === 0) return;

  let head = this.snake[0];

  for (let i = 0; i < this.snake.length; i++) {
    if (
      i !== 0 &&
      head.left === this.snake[i].left &&
      head.top === this.snake[i].top
    ) {
      this.snake = [];
      this.apples = [];
      this.gameOverScreen();
      return;
    }
  }

  if (
    head.left < 0 ||
    head.left >= this.board.width ||
    head.top < 0 ||
    head.top >= this.board.height
  ) {
    this.snake = [];
    this.apples = [];
    this.gameOverScreen();
    return;
  }
};

const snake = new Snake();
snake.start();
