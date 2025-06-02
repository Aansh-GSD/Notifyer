const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

class Character {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.color = color;
    this.speed = 5;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  move(dx, dy) {
    this.x += dx * this.speed;
    this.y += dy * this.speed;
    this.x = Math.max(0, Math.min(canvas.width - this.size, this.x));
    this.y = Math.max(0, Math.min(canvas.height - this.size, this.y));
  }
}

const player1 = new Character(100, 500, "red");
const player2 = new Character(650, 500, "blue");

const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player 1 controls: W, A, S, D
  if (keys["a"]) player1.move(-1, 0);
  if (keys["d"]) player1.move(1, 0);
  if (keys["w"]) player1.move(0, -1);
  if (keys["s"]) player1.move(0, 1);

  // Player 2 controls: Arrow keys
  if (keys["ArrowLeft"]) player2.move(-1, 0);
  if (keys["ArrowRight"]) player2.move(1, 0);
  if (keys["ArrowUp"]) player2.move(0, -1);
  if (keys["ArrowDown"]) player2.move(0, 1);

  player1.draw();
  player2.draw();

  requestAnimationFrame(gameLoop);
}

gameLoop();
