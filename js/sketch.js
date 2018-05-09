var FREQUENCIES = 11;
var TIMES = 16;
var XDIST = 80;
var YDIST = 60;
var XSHIFT = 120;
var YSHIFT = 60;
var RAD = 15;
var SPEED = 2;

var clicked = [];
var lineLocation;

function setup() {
  createCanvas(1440, 720);
  lineLocation = 0;
  for (var i = 0; i < FREQUENCIES; i++) {
    clicked[i] = [];
    for (var j = 0; j < TIMES; j++) {
      clicked[i][j] = false;
    }
  }
}

function draw() {
  background(255, 0, 0);
  for (var i = 0; i < FREQUENCIES; i++) {
    for (var j = 0; j < TIMES; j++) {
      strokeWeight(2);
      stroke(255);
      fill(0, 0, 0, 0);
      if (clicked[i][j]) {
        fill(255, 255, 255, 200);
      }
      ellipse(XSHIFT + XDIST*j, YSHIFT + YDIST*i, RAD, RAD);
    }
  }
  strokeWeight(5);
  line(lineLocation, 0, lineLocation, height);

  if (Math.abs((lineLocation - XSHIFT + XDIST/2) % XDIST - XDIST/2) < SPEED/2) {
    var j = Math.floor((lineLocation - XSHIFT + XDIST/2) / XDIST);
    for (var i = 0; i < FREQUENCIES; i++) {
      if (clicked[i][j]) {
        console.log([i, j]);
      }
    }
  }

  lineLocation = lineLocation + SPEED;
  if (lineLocation >= width) {
    lineLocation = 0;
  }
}

function mousePressed() {
  var d = dist((mouseX - XSHIFT + XDIST/2) % XDIST, (mouseY - YSHIFT + YDIST/2) % YDIST, XDIST/2, YDIST/2);
  if (d < RAD/2) {
    var x = Math.floor((mouseX - XSHIFT + XDIST/2) / XDIST);
    var y = Math.floor((mouseY - YSHIFT + YDIST/2) / YDIST);
    //debugger
    clicked[y][x] = !clicked[y][x];
    //debugger
  }
}