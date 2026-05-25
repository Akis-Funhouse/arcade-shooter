import Input, { Keys } from "./input.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const input = new Input(canvas);

const playerImage = new Image();
playerImage.src = "./images/player.png";

const enemyImage = new Image();
enemyImage.src = "./images/enemy.png";

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
let gameOver = false;
let enemySpawnTimer = 0;


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

// enemies
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

// shooting
function shoot() {
  bullets.push({
    x: player.x + player.width - 10,
    y: player.y + player.height / 2 - 10,
    width: 30,
    height: 20,
    speed: 12
  });
}

// shooting particle
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

  if (gameOver) return;

  // player movement
  
if (player.dashCooldown > 0) {
  player.dashCooldown--;
}

if (player.dashTime > 0) {
  player.dashTime--;
}

if (
  input.getKeyDown(Keys.Shift) &&
  player.dashCooldown <= 0
) {
  player.dashTime = player.dashDuration;
  player.dashCooldown = player.dashCooldownMax;
}

// Current movement speed
let currentSpeed = player.speed;

if (player.dashTime > 0) {
  currentSpeed = player.dashSpeed;
}

// player movement
if (input.getKey(Keys.W) || input.getKey(Keys.UpArrow)) {
  player.y -= currentSpeed;
}

if (input.getKey(Keys.S) || input.getKey(Keys.DownArrow)) {
  player.y += currentSpeed;
}

  player.y = Math.max(
    0,
    Math.min(canvas.height - player.height, player.y)
  );

  if (player.cooldown > 0) {
    player.cooldown--;
  }

  if (
    (input.getKey(Keys.Space) || input.getKey(Keys.D)) &&
    player.cooldown <= 0
  ) {
    shoot();
    player.cooldown = 10;
  }

  // bullets
  bullets.forEach((bullet, index) => {
    bullet.x += bullet.speed;

    if (bullet.x > canvas.width) {
      bullets.splice(index, 1);
    }
  });

  //enemy spawning
  enemySpawnTimer--;

  if (enemySpawnTimer <= 0) {
    spawnEnemy();

    enemySpawnTimer = Math.max(20, 80 - score);
  }

  enemies.forEach((enemy, enemyIndex) => {
    enemy.x -= enemy.speed;

    if (enemy.x + enemy.width < 0) {
      gameOver = true;
    }

    if (rectsCollide(player, enemy)) {
      gameOver = true;
    }

    bullets.forEach((bullet, bulletIndex) => {
      if (rectsCollide(bullet, enemy)) {
        createExplosion(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2
        );

        enemies.splice(enemyIndex, 1);
        bullets.splice(bulletIndex, 1);

        score++;
      }
    });
  });

  particles.forEach((p, index) => {
    p.x += p.dx;
    p.y += p.dy;
    p.life--;

    if (p.life <= 0) {
      particles.splice(index, 1);
    }
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
  ctx.drawImage(
    playerImage,
    player.x,
    player.y,
    player.width,
    player.height
  );
}

function drawBullets() {
  bullets.forEach(bullet => {
    ctx.fillStyle = "#ffee00";

    ctx.fillRect(
      bullet.x,
      bullet.y,
      bullet.width,
      bullet.height
    );
  });
}

function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.drawImage(
      enemyImage,
      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height
    );
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

  if (gameOver) {
    ctx.textAlign = "center";

    ctx.font = "64px Arial";
    ctx.fillStyle = "#ff4444";
    ctx.fillText(
      "GAME OVER",
      canvas.width / 2,
      canvas.height / 2
    );

    ctx.font = "28px Arial";
    ctx.fillStyle = "white";

    ctx.fillText(
      `Final Score: ${score}`,
      canvas.width / 2,
      canvas.height / 2 + 50
    );

    ctx.font = "20px Arial";

    ctx.fillText(
      "Refresh page to restart",
      canvas.width / 2,
      canvas.height / 2 + 100
    );

    ctx.textAlign = "left";
  }
}

function gameLoop() {
  update();

  drawBackground();
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawParticles();
  drawUI();

  requestAnimationFrame(gameLoop);
}

let loadedImages = 0;

function imageLoaded() {
  loadedImages++;

  if (loadedImages === 2) {
    gameLoop();
  }
}

playerImage.onload = imageLoaded;
enemyImage.onload = imageLoaded;