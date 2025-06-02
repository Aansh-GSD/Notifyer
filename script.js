const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hitSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
const winSound = new Audio("https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg");

class Character {
  constructor(x, y, color, attackKey) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = 50;
    this.speed = 5;
    this.health = 100;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.attackKey = attackKey;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  move(dx, dy) {
    this.x = Math.max(0, Math.min(canvas.width - this.size, this.x + dx * this.speed));
    this.y = Math.max(0, Math.min(canvas.height - this.size, this.y + dy * this.speed));
  }

  attack(opponent) {
    if (this.attackCooldown === 0) {
      this.isAttacking = true;
      if (
        this.x < opponent.x + opponent.size &&
        this.x + this.size > opponent.x &&
        this.y < opponent.y + opponent.size &&
        this.y + this.size > opponent.y
      ) {
        opponent.health -= 10;
        hitSound.play();
        if (opponent.health <= 0) {
          winner = this.color;
          winSound.play();
        }
      }
      this.attackCooldown = 60;
    }
  }

  updateCooldown() {
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.attackCooldown === 0) this.isAttacking = false;
  }

  drawHealthBar(x, y) {
    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, 100, 10);
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.health, 10);
  }
}

const player1 = new Character(100, 500, "red", " ");
const player2 = new Character(650, 500, "blue", "Enter");

let winner = null;
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function drawText(text) {
  ctx.fillStyle = "white";
  ctx.font = "30px sans-serif";
  ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, 50);
}

function restartGame() {
  player1.x = 100; player1.y = 500; player1.health = 100;
  player2.x = 650; player2.y = 500; player2.health = 100;
  winner = null;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!winner) {
    // Player 1 controls
    if (keys["a"]) player1.move(-1, 0);
    if (keys["d"]) player1.move(1, 0);
    if (keys["w"]) player1.move(0, -1);
    if (keys["s"]) player1.move(0, 1);
    if (keys[" "]) player1.attack(player2);

    // Player 2 controls
    if (keys["ArrowLeft"]) player2.move(-1, 0);
    if (keys["ArrowRight"]) player2.move(1, 0);
    if (keys["ArrowUp"]) player2.move(0, -1);
    if (keys["ArrowDown"]) player2.move(0, 1);
    if (keys["Enter"]) player2.attack(player1);

    player1.updateCooldown();
    player2.updateCooldown();
  } else {
    drawText(`${winner.toUpperCase()} Wins!`);
  }

  player1.draw();
  player2.draw();
  player1.drawHealthBar(20, 20);
  player2.drawHealthBar(canvas.width - 120, 20);

  requestAnimationFrame(gameLoop);
}

gameLoop();
