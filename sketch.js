"use strict"

let player, stars, ufo;
let pl, el; // Player/enemy lasers'
let enemies = [];
let rows, cols, total; // Total number of enemies
let state;
let edge; // Left/right side of window
let x = 1;
let sounds = ["sounds/explosion.wav", "sounds/invaderkilled.wav", "sounds/shoot.wav"];
let titleScreen, winScreen, loseScreen;

function preload() {
  // Loads all sounds at once
  sounds = sounds.map(function (sound) {
    return loadSound(sound);
  });
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER);
  rectMode(CENTER);
  noCursor();
  noStroke();

  titleScreen = gameScreen("lime", "SPACE INVADERS");
  winScreen = gameScreen("lime", "YOU WIN", "re");
  loseScreen = gameScreen("red", "GAME OVER", "re");

  state = titleScreen;
}

function draw() {
  background(0);
  state();
}

function keyPressed() {
  if (keyCode === ENTER && state !== playScreen) {
    reset();
    state = playScreen;
  }
}

function reset() {
  stars = new Starfield();
  stars.generateStars();

  player = new Cannon();
  ufo = new Alien(-1000, 20, 50, 20, 2.5, "red");

  cols = 11;
  rows = 5;

  // Creates an array of enemies
  for (let i = 0; i < cols; i++) {
    enemies[i] = [];
    for (let j = 0; j < rows; j++) {
      enemies[i][j] = new Alien(i * 60 + 40, j * 60 + 40, 35, 30, 1, "white");
    }
  }

  total = rows * cols; // Resets total

  // Both player & enemies can use laser objects
  pl = new Laser(12, player.col);
  el = new Laser(-3, "white");
}

function gameScreen(col, title, str="") {
  return function () {
    textSize(40);
    fill(col);
    text(title, width / 2, height / 2);
    textSize(25);
    fill("white");
    text("Press ENTER to " + str + "start", width / 2, height / 2 + 40);
  }
}

function playScreen() {
  stars.render();

  pl.render();
  pl.move();

  if (el.x > 0) {
    el.render();
    el.move();
  }

  player.render();
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) player.move(-5);
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) player.move(5);
  if ((keyIsDown(32) || mouseIsPressed) && pl.y <= 0) player.shoot();

  ufo.render();
  ufo.move();
  if (ufo.dead(pl)) {
    sounds[1].play();
    ufo.x = ran(-1000, width + 100);
    player.charge();
  } else if (ufo.x > width + 2000) {
    ufo.x = ran(-100, width + 100);
    ufo.speed = -ufo.speed;
  } else if (ufo.x < -2000) {
    ufo.x = ran(-100, width + 100);
    ufo.speed = -ufo.speed;
  }

  edge = false;

  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = enemies[i].length - 1; j >= 0; j--) {
      enemies[i][j].render();
      enemies[i][j].move(1.5);

      // If an enemy reaches left/right of canvas, then edge is true
      if (enemies[i][j].x - enemies[i][j].w / 2 <= 0 || enemies[i][j].x + enemies[i][j].w / 2 >= width)
        edge = true;

      // If enemy reaches bottom of canvas, then display lose screen
      if (enemies[i][j].y + enemies[i][j].h / 2 >= height - 20)
        state = loseScreen;

      // Checks if an enemy is dead
      if (enemies[i][j].dead(pl)) {
        // If an enemy dies, then delete from array
        enemies[i].splice(j, 1);

        // If an enemy dies, delete from total
        total--;

        // Reset lasers
        player.charge();
      }

      // When timer ends, enemies will shoot
      if (timer())
        enemies[i][enemies[i].length - 1].shoot();
    }
  }

  // If edge is true, then call shiftDown function
  if (edge) {
    for (let i = 0; i < enemies.length; i++) {
      for (let j = 0; j < enemies[i].length; j++) {
        enemies[i][j].speed *= 1.05;
        enemies[i][j].shiftDown();
        enemies[i][j].reverseDirection();
      }
    }
  }

  if (pl.dead(el)) {
    el.x = 0;
    el.y = 0;
    player.charge();
  }

  // If player dies, then display lose screen
  if (player.dead(el)) {
    sounds[0].play();
    state = loseScreen;
  }

  // If total is equal to size of array, then all enemies have died
  // If all enemies are dead, display win screen
  if (total === 0) {
    state = winScreen;
  }
}

function timer() {
  // ellipse(x, 1, 5, 5);

  x += random(0.08, 0.11); // Timer speed

  // If ball reaches right edge of canvas, timer is complete
  if (x > width) {
    x = 0; // Resets timer
    return true;
  }
  return false;
}

function ran(m, n) {
  return random(1) > 0.5 ? m : n;
}