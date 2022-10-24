class Starfield {
  constructor() {
    this.arr = [];

    this.createStars = function (length) {
      for (let i = 0; i < length; i++) {
        this.arr[i] = int(random(width));
      }
    }

    this.render = function (r) {
      for (let j = 0; j < this.arr.length; j++) {
        fill("white");
        ellipse(this.arr[j], this.arr[this.arr.length - j], r, r);
      }
    }
  }
}