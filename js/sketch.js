// import {Particle} from 'particle.js';
// import {ParticleSystem} from 'particle.js';

var FREQUENCIES = 11;
var TIMES = 16;
var XDIST = 80;
var YDIST = 60;
var XSHIFT = 120;
var YSHIFT = 60;
var RAD = 15;
var SPEED = 2;
var PARTICLES = 20;
var INSTRUMENTS = 2;
// 0 = glock
// 1 = xylo
// 2 = piano
// 3 = 

var clicked = [];
var lineLocation;
var system;
var paused;
var sounds = [];
var selectedInstrument;
var buttons = [];
//var resetButton, pauseButton, switchButton;

//-----------------------------------------------------------------------------------------------------------


function setup() {
  createCanvas(1440, 720);
  lineLocation = 0;

  // create clickable locations for each instrument
  for (var a = 0; a < INSTRUMENTS; a++) {
  	clicked[a] = [];
  	for (var i = 0; i < FREQUENCIES; i++) {
      clicked[a][i] = [];
   	  for (var j = 0; j < TIMES; j++) {
        clicked[a][i][j] = false;
      }
    }
  }

  // add particles
  system = new ParticleSystem();

  // add sound for each instrument
  for (var a = 0; a < INSTRUMENTS; a++) {
  	sounds[a] = [];
  }
  for (var i = 0; i < FREQUENCIES; i++) {
  	  sounds[0][i] = loadSound('./sound/glock' + i + '.wav');
  	  sounds[1][i] = loadSound('./sound/xylo' + i + '.wav');
  	  // sounds[2][i] = loadSound('./sound/glock' + i + '.wav');
  	  // sounds[3][i] = loadSound('./sound/glock' + i + '.wav');
  }
  selectedInstrument = 0;

  // // add reset button
  // resetButton = createButton('clear');
  // resetButton.position(30, 30);
  // resetButton.mousePressed(clearClicked);

  // // add pause button
  // pauseButton = createButton('pause');
  // pauseButton.position(30, 70);
  // pauseButton.mousePressed(pausePlayback);

  // // add switch instrument button
  // switchButton = createButton('switch');
  // switchButton.position(30, 110);
  // switchButton.mousePressed(switchInstrument);
  buttons[0] = new Button(30, 30, 70, 70, null, () => switchInstrument(0), true);
  buttons[1] = new Button(30, 70, 70, 110, null, () => switchInstrument(1), false);
  buttons[2] = new Button(30, 110, 70, 150, null, clearClicked, false);
  buttons[3] = new Button(30, 150, 70, 190, null, clearClicked, false);
  buttons[4] = new Button(30, 190, 70, 230, null, pausePlayback, false);
  buttons[5] = new Button(30, 230, 70, 270, null, clearClicked, false);
}

//-----------------------------------------------------------------------------------------------------------

function draw() {
  background(255, 0, 0);

  // grid of dots
  for (var i = 0; i < FREQUENCIES; i++) {
    for (var j = 0; j < TIMES; j++) {
      strokeWeight(2);
      stroke(255);
      fill(0, 0, 0, 0);
      if (clicked[selectedInstrument][i][j]) {
        fill(255, 255, 255, 200);
      }
      // change shape if selected????
      ellipse(XSHIFT + XDIST*j, YSHIFT + YDIST*i, RAD, RAD);
    }
  }

  // buttons
  for (var i = 0; i < buttons.length; i++) {
    var mouseOver = buttons[i].isMouseOver(mouseX, mouseY);
    buttons[i].draw(mouseOver);
  }

  // playback line
  strokeWeight(5);
  stroke(255);
  line(lineLocation, 0, lineLocation, height);

  if (Math.abs((lineLocation - XSHIFT + XDIST/2) % XDIST - XDIST/2) < SPEED/2) {
    var j = Math.floor((lineLocation - XSHIFT + XDIST/2) / XDIST);
    for (var i = 0; i < FREQUENCIES; i++) {
      for (var a = 0; a < INSTRUMENTS; a++) {
        if (clicked[a][i][j]) { 
      	  for (var n = 0; n < PARTICLES; n++) {
            system.addParticle(j * XDIST + XSHIFT, i * YDIST + YSHIFT, a);
          }
  		    sounds[a][i].play();
        }
      }
    }
  }

  // update particles and line
  if (!paused) {
    lineLocation = lineLocation + SPEED;
    if (lineLocation >= width) {
      lineLocation = 0;
    }
  }
  system.run();
}

function mousePressed() {
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].isMouseOver(mouseX, mouseY)) {
      buttons[i].onClick();
    }
  }
  var d = dist((mouseX - XSHIFT + XDIST/2) % XDIST, (mouseY - YSHIFT + YDIST/2) % YDIST, XDIST/2, YDIST/2);
  if (d < RAD/2) {
    var x = Math.floor((mouseX - XSHIFT + XDIST/2) / XDIST);
    var y = Math.floor((mouseY - YSHIFT + YDIST/2) / YDIST);
    clicked[selectedInstrument][y][x] = !clicked[selectedInstrument][y][x];
  }
}


//-----------------------------------------------------------------------------------------------------------

function clearClicked() {
  for (var a = 0; a < INSTRUMENTS; a++) {
  	for (var i = 0; i < FREQUENCIES; i++) {
   	  for (var j = 0; j < TIMES; j++) {
        clicked[a][i][j] = false;
      }
    }
  }
  lineLocation = 0;
}

function pausePlayback() {
  paused = !paused;
}

function switchInstrument(a) {
  selectedInstrument = a;
  for (var i = 0; i < INSTRUMENTS; i++) {
    buttons[i].isSelected = false;
  }
  buttons[a].isSelected = true;

}

//-----------------------------------------------------------------------------------------------------------

// A simple Particle class for glock
var Particle0 = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255;
};

Particle0.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle0.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle0.prototype.display = function() {
  stroke(0, 255, 0, this.lifespan);
  strokeWeight(2);
  fill(127, this.lifespan);
  ellipse(this.position.x, this.position.y, 12, 12);
};

// Is the particle still useful?
Particle0.prototype.isDead = function(){
  return this.lifespan < 0;
};


//-----------------------------------------------------------------------------------------------------------

// A simple Particle class for xylo 
var Particle1 = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255;
};

Particle1.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle1.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle1.prototype.display = function() {
  stroke(0, 0, 255, this.lifespan);
  strokeWeight(2);
  fill(127, this.lifespan);
  ellipse(this.position.x, this.position.y, 12, 12);
};

// Is the particle still useful?
Particle1.prototype.isDead = function(){
  return this.lifespan < 0;
};


//-----------------------------------------------------------------------------------------------------------

// A simple Particle system
var ParticleSystem = function() {
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function(x, y, a) {
  if (a === 0) {
  	this.particles.push(new Particle0(createVector(x, y)));
  }
  else if (a === 1) {
  	this.particles.push(new Particle1(createVector(x, y)));
  }
  else if (a === 2) {
  	this.particles.push(new Particle2(createVector(x, y)));
  }
  else if (a === 3) {
  	this.particles.push(new Particle3(createVector(x, y)));
  }
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};

//-----------------------------------------------------------------------------------------------------------

var Button = function(xmin, ymin, xmax, ymax, iconFunc, onClick, selected) {
  this.xmin = xmin;
  this.ymin = ymin;
  this.xmax = xmax;
  this.ymax = ymax;
  this.iconFunction = iconFunc;
  this.onClick = onClick;
  this.isSelected = selected;
};

Button.prototype.draw = function(mouseOver) {
  rectMode(CORNERS);
  strokeWeight(2);
  stroke(255, 255, 255, 127);
  if (mouseOver || this.isSelected) {
    stroke(255, 255, 255, 255);
  } 
  rect(this.xmin, this.ymin, this.xmax, this.ymax, 5);
};

Button.prototype.isMouseOver = function(mouseX, mouseY) {
  return (mouseX >= this.xmin && mouseX <= this.xmax && mouseY >= this.ymin && mouseY <= this.ymax);
};
