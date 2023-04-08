class Starfield {
  constructor() {
    this.arr = new Array(600);
    this.r = 0.8;

    this.generateStars = function () {
      for (let i = 0; i < this.arr.length; i++) {
        this.arr[i] = int(random(width));
      }
    }

    this.render = function () {
      for (let j = 0; j < this.arr.length; j++) {
        //fill("white");
        if(j % 2 === 0) this.r = .9; else this.r = 1.6;
        ellipse(this.arr[j], this.arr[this.arr.length - j], this.r, this.r);
      }
    }
  }
}