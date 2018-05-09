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
var sounds = [];
var selectedInstrument;

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

  // add reset button
  button = createButton('reset');
  button.position(width/2, 30);
  button.mousePressed(clearClicked);
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

  // playback line
  strokeWeight(5);
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

  lineLocation = lineLocation + SPEED;
  if (lineLocation >= width) {
    lineLocation = 0;
  }
  system.run();
}

function mousePressed() {
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
