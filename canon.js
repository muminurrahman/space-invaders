class Canon {
  constructor() {
    this.w = 50;
    this.h = 20;
    this.r = 4;
    this.x = width / 2;
    this.y = height - this.h;
    this.col = color("lime");

    this.render = function () {
      fill(this.col);
      triangle(this.x + 10, this.y, this.x, this.y - 20, this.x - 10, this.y);
      rect(this.x, this.y, this.w, this.h, this.r);
    }

    /* Allows ship to move & sets boundaries */
    this.move = function (dir) {
      this.x += dir;

      // Prevents ship moving outside of canvas 
      if (this.x - this.w / 2 <= 0)
        this.x = this.w / 2;
      else if (this.x + this.w / 2 >= width)
        this.x = width - this.w / 2;
    }

    this.charge = function () {
      pl.x = -10;
      pl.y = -10;
    }

    this.shoot = function () {
      pl.x = this.x;
      pl.y = this.y;
      sounds[2].play();
    }

    this.dead = function (obj) {
      return obj.x + obj.w / 2 >= this.x - this.w / 2 &&
        obj.x - obj.w / 2 <= this.x + this.w / 2 &&
        obj.y + obj.h / 2 >= this.y &&
        obj.y - obj.h / 2 <= this.y;
    }
  }
}