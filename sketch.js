"use strict"

let player, stars, redd;
let pl, el; // Player/enemy lasers'
let enemies = [],
  cols = 11,
  rows = 5,
  total; // Total number of enemies
let state = titleScreen;
let edge; // Left/right side of window
let x = 1;
let sounds = ["sounds/explosion.wav", "sounds/invaderkilled.wav", "sounds/shoot.wav"];


function preload() {
  // Loads all sounds at once
  sounds = sounds.map(function(snd) {
    return loadSound(snd);
  });
}

function setup() {
  createCanvas(800, 600);
  noCursor();
  noStroke();
  textAlign(CENTER);
  rectMode(CENTER);
    
  stars = new Starfield();
  stars.createStars(400);
}

function draw() {
  background(0);
  state();
}

function keyPressed() {
  if (keyCode === ENTER && state !== playScreen) {
    state = playScreen;

    player = new Canon();
    redd = new Alien(-1000, 20, 50, 20, 2.5, "red");

    // Creates an array of enemies
    for (let i = 0; i < cols; i++) {
      enemies[i] = [];
      for (let j = 0; j < rows; j++) {
        enemies[i][j] = new Alien(i * 60 + 40, j * 60 + 40, 35, 30, 1, "white");
      }
    }

    // Both player & enemies can use laser objects
    pl = new Laser(12, player.col);
    el = new Laser(-3, "white");

    total = rows * cols; // Resets total
  }
}

function playScreen() {
  stars.render(1.5);

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

  redd.render();
  redd.move();
  if (redd.dead(pl)) {
    sounds[1].play();
    redd.x = ran(-1000, width + 100);
    player.charge();
  } else if (redd.x > width + 2000) {
    redd.x = ran(-100, width + 100);
    redd.speed = -redd.speed;
  } else if (redd.x < -2000) {
    redd.x = ran(-100, width + 100);
    redd.speed = -redd.speed;
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
    player.charge();
    el.x = 0;
    el.y = 0;
  }

  // If player dies, then display lose screen
  if (player.dead(el)) {
    sounds[0].play();
    state = loseScreen;
  }


  // If total is equal to size of array, then all enemies have died
  // If all enemies are dead, display win screen
  if (total === 0) state = winScreen;
}

function titleScreen() {
  textSize(60);
  fill("lime");
  text("SPACE INVADERS", width / 2, height / 2 - 20);
  textSize(30);
  fill("white");
  text("Press ENTER to start", width / 2, height / 2 + 50);
}

function loseScreen() {
  textSize(60);
  fill("red");
  text("GAME OVER", width / 2, height / 2 - 20);
  textSize(30);
  fill("white");
  text("Press ENTER to restart", width / 2, height / 2 + 50);
}

function winScreen() {
  textSize(60);
  fill("lime");
  text("YOU WIN!", width / 2, height / 2 - 20);
  textSize(30);
  fill("white");
  text("Press ENTER to restart", width / 2, height / 2 + 50);
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