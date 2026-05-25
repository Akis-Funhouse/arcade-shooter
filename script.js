import Input, { Keys } from "./input.js";
import Button from "./button.js";
import Menu from "./menu.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const input = new Input(canvas);

const playerImage = new Image();
playerImage.src = "./images/player.png";

const enemyImage = new Image();
enemyImage.src = "./images/enemy.png";

let state = "menu";

const menu = new Menu(input, canvas, startGame);

const player = {
  x: 80,
  y: canvas.height / 2,
  width: 70,
  height: 70,
  speed: 6,
  cooldown: 0,
  dashSpeed: 18,
  dashTime: 0,
  dashDuration: 10,
  dashCooldown: 0,
  dashCooldownMax: 60
};

const bullets = [];
const enemies = [];
const particles = [];

let score = 0;
let enemySpawnTimer = 0;

let restartButton = new Button(input, {
  text: "Restart",
  x: canvas.width / 2 - 100,
  y: canvas.height / 2 + 120,
  width: 200,
  height: 60,
});

let backToMenuButton = new Button(input, {
  text: "Main Menu",
  x: canvas.width / 2 - 100,
  y: canvas.height / 2 + 200,
  width: 200,
  height: 60,
});

function startGame() {
  resetGame();
  state = "playing";
}

function goToMenu() {
  resetGame();
  state = "menu";
}

function resetGame() {
  score = 0;

  player.x = 80;
  player.y = canvas.height / 2;
  player.cooldown = 0;
  player.dashTime = 0;
  player.dashCooldown = 0;

  bullets.length = 0;
  enemies.length = 0;
  particles.length = 0;

  enemySpawnTimer = 0;
}

function rectsCollide(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnEnemy() {
  const size = Math.floor(random(40, 80));

  enemies.push({
    x: canvas.width + size,
    y: random(0, canvas.height - size),
    width: size,
    height: size,
    speed: random(2, 5)
  });
}

function shoot() {
  bullets.push({
    x: player.x + player.width - 10,
    y: player.y + player.height / 2 - 10,
    width: 30,
    height: 20,
    speed: 12
  });
}

function createExplosion(x, y) {
  for (let i = 0; i < 15; i++) {
    particles.push({
      x,
      y,
      radius: random(2, 5),
      dx: random(-4, 4),
      dy: random(-4, 4),
      life: 30
    });
  }
}

function update() {
  input.update();

  // menu
  if (state === "menu") {
    menu.update();
    return;
  }

  // game over
  if (state === "gameover") {
    if (restartButton.clicked()) {
      startGame();
    }

    if (backToMenuButton.clicked()) {
      goToMenu();
    }

    return;
  }

  // movement

  if (player.dashCooldown > 0) player.dashCooldown--;
  if (player.dashTime > 0) player.dashTime--;

  if (
    input.getKeyDown(Keys.Shift) &&
    player.dashCooldown <= 0
  ) {
    player.dashTime = player.dashDuration;
    player.dashCooldown = player.dashCooldownMax;
  }

  let currentSpeed = player.speed;
  if (player.dashTime > 0) currentSpeed = player.dashSpeed;

  if (input.getKey(Keys.W) || input.getKey(Keys.UpArrow)) {
    player.y -= currentSpeed;
  }

  if (input.getKey(Keys.S) || input.getKey(Keys.DownArrow)) {
    player.y += currentSpeed;
  }

  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  if (player.cooldown > 0) player.cooldown--;

  if (
    (input.getKey(Keys.Space) || input.getKey(Keys.D)) &&
    player.cooldown <= 0
  ) {
    shoot();
    player.cooldown = 10;
  }

  // bullets
  bullets.forEach((b, i) => {
    b.x += b.speed;
    if (b.x > canvas.width) bullets.splice(i, 1);
  });

  // enemies
  enemySpawnTimer--;

  if (enemySpawnTimer <= 0) {
    spawnEnemy();
    enemySpawnTimer = Math.max(20, 80 - score);
  }

  enemies.forEach((e, ei) => {
    e.x -= e.speed;

    if (e.x + e.width < 0) {
      state = "gameover";
    }

    if (rectsCollide(player, e)) {
      state = "gameover";
    }

    bullets.forEach((b, bi) => {
      if (rectsCollide(b, e)) {
        createExplosion(
          e.x + e.width / 2,
          e.y + e.height / 2
        );

        enemies.splice(ei, 1);
        bullets.splice(bi, 1);

        score++;
      }
    });
  });

  particles.forEach((p, i) => {
    p.x += p.dx;
    p.y += p.dy;
    p.life--;

    if (p.life <= 0) particles.splice(i, 1);
  });
}

function drawBackground() {
  ctx.fillStyle = "#0a0a12";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";

  for (let i = 0; i < 100; i++) {
    const x = (i * 94) % canvas.width;
    const y = (i * 50 + performance.now() * 0.03) % canvas.height;

    ctx.fillRect(x, y, 2, 2);
  }
}

function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawBullets() {
  bullets.forEach(b => {
    ctx.fillStyle = "#ffee00";
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });
}

function drawEnemies() {
  enemies.forEach(e => {
    ctx.drawImage(enemyImage, e.x, e.y, e.width, e.height);
  });
}

function drawParticles() {
  particles.forEach(p => {
    ctx.fillStyle = `rgba(255,180,50,${p.life / 30})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawUI() {
  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.fillText(`Score: ${score}`, 20, 40);

  if (state === "gameover") {
    ctx.textAlign = "center";

    ctx.font = "64px Arial";
    ctx.fillStyle = "#ff4444";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    ctx.font = "28px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 50);

    ctx.font = "20px Arial";
    ctx.fillText("Try again or return to menu", canvas.width / 2, canvas.height / 2 + 100);

    restartButton.draw(ctx);
    backToMenuButton.draw(ctx);

    ctx.textAlign = "left";
  }
}

function gameLoop() {
  update();

  drawBackground();

  if (state === "menu") {
    menu.draw(ctx);
  } else {
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawParticles();
    drawUI();
  }

  requestAnimationFrame(gameLoop);
}

let loaded = 0;

function onLoad() {
  loaded++;
  if (loaded === 2) gameLoop();
}

playerImage.onload = onLoad;
enemyImage.onload = onLoad;