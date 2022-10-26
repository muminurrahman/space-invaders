class Alien {
  constructor(x, y, w, h, velocity, col) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.r = 15;
    this.velocity = velocity;
    this.col = col;

    this.render = function () {
      fill(this.col);
      rect(this.x, this.y, this.w, this.h, this.r);
    }

    this.move = function () {
      this.x += this.velocity;
    }

    this.shiftDown = function () {
      this.y += this.h;
    }

    this.reverseDirection = function () {
      this.velocity = -this.velocity;
    }

    this.shoot = function () {
      el.x = this.x;
      el.y = this.y;
    }

    // If alien is hit by laser, alien dies
    this.dead = function (obj) {
      return obj.x + obj.w / 2 >= this.x - this.w / 2 &&
        obj.x - obj.w / 2 <= this.x + this.w / 2 &&
        obj.y + obj.h / 2 >= this.y &&
        obj.y - obj.h / 2 <= this.y;
    }
  }
}
