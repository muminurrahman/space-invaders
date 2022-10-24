class Laser {
  constructor(velocity, col) {
    this.x = 0;
    this.y = 0;
    this.w = 5;
    this.h = 20;
    this.velocity = velocity;
    this.col = col;

    this.render = function () {
      fill(this.col);
      rect(this.x, this.y, this.w, this.h);
    }

    this.move = function () {
      this.y -= this.velocity;
    }

    this.dead = function (obj) {
      return obj.x + obj.w / 2 >= this.x - this.w / 2 &&
        obj.x - obj.w / 2 <= this.x + this.w / 2 &&
        obj.y + obj.h / 2 >= this.y - this.h / 2 &&
        obj.y - obj.h / 2 <= this.y + this.h / 2;
    }
  }
}