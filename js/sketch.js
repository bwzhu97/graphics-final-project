// import {Particle} from 'particle.js';
// import {ParticleSystem} from 'particle.js';

// window size and placement of grid
var WINDOW_X = 1440;
var WINDOW_Y = 720;
var XDIST = 80;
var YDIST = 60;
var XSHIFT = 120;
var YSHIFT = 60;

var FREQUENCIES = 11;
var TIMES = 16;
var RAD = 7.5;
var SPEED = 3;
var PARTICLES = 7;
var INSTRUMENTS = 4;

var clicked = [];
var lineLocation;
var system;
var paused;
var sounds = [];
var selectedInstrument;
var buttons = [];
var bg;

//-----------------------------------------------------------------------------------------------------------


function setup() {
  // window size and placement of grid
  WINDOW_X = Math.max(1024, windowWidth);
  WINDOW_Y = Math.max(576, windowHeight);
  XSHIFT = 130;
  YSHIFT = WINDOW_Y / 12;
  XDIST = (WINDOW_X - 260) / 15;
  YDIST = WINDOW_Y / 12;
  // playback speed
  SPEED = XDIST / 20; 


  createCanvas(WINDOW_X, WINDOW_Y);
  lineLocation = 0;
  paused = true;

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
  	  sounds[1][i] = loadSound('./sound/xylophone' + i + '.wav');
  	  sounds[2][i] = loadSound('./sound/piano' + i + '.wav');
  	  sounds[3][i] = loadSound('./sound/pizz' + i + '.wav');
  }
  selectedInstrument = 0;

  // add a bit of reverb to sounds
  reverb = new p5.Reverb();
  for (var i = 0; i < FREQUENCIES; i++) {
    for (var j = 0; j < INSTRUMENTS; j++) {
      reverb.process(sounds[j][i], 4, 8);
    }
  }

  // create all the buttons
  var top_gap = (WINDOW_Y - 276) / 2;
  buttons[0] = new Button(40, top_gap + 104, 80, top_gap + 144, 'diamond', () => switchInstrument(0), true);
  buttons[1] = new Button(40, top_gap + 148, 80, top_gap + 188, 'circle', () => switchInstrument(1), false);
  buttons[2] = new Button(40, top_gap + 192, 80, top_gap + 232, 'triangle', () => switchInstrument(2), false);
  buttons[3] = new Button(40, top_gap + 236, 80, top_gap + 276, 'square', () => switchInstrument(3), false);
  buttons[4] = new Button(40, top_gap, 80, top_gap + 40, 'pause', pausePlayback, true);
  buttons[5] = new Button(40, top_gap + 44, 80, top_gap + 84, 'reset', clearClicked, true);

  // get the background image
  bg = loadImage("image/background.jpg");
  image(bg, 0, 0, WINDOW_X, WINDOW_Y);
}

//-----------------------------------------------------------------------------------------------------------

function draw() {
  // Background
  background(bg);

  // grid of dots
  for (var i = 0; i < FREQUENCIES; i++) {
    for (var j = 0; j < TIMES; j++) {
      strokeWeight(2);
      stroke(255);
      fill(0, 0, 0, 0);
      if (clicked[selectedInstrument][i][j]) {
        fill(255, 255, 255, 200);
      }
      // the grid
      var xcenter = XSHIFT + XDIST*j;
      var ycenter = YSHIFT + YDIST*i;
      if (selectedInstrument === 0) {
        quad(xcenter + RAD, ycenter, xcenter, ycenter - RAD, 
          xcenter - RAD, ycenter, xcenter, ycenter + RAD);
      }
      else if (selectedInstrument === 1) {
        ellipse(xcenter, ycenter, RAD * 2, RAD * 2);
      }
      else if (selectedInstrument === 2) {
        triangle(xcenter, ycenter - RAD, xcenter + RAD * Math.sqrt(3) / 2, ycenter + RAD / 2,
          xcenter - RAD * Math.sqrt(3) / 2, ycenter + RAD / 2);
      }
      else if (selectedInstrument === 3) {
        rectMode(CENTER);
        rect(xcenter, ycenter, RAD * 1.7, RAD * 1.7);
      }
    }
  }

  // buttons
  for (var i = 0; i < buttons.length; i++) {
    var mouseOver = buttons[i].isMouseOver(mouseX, mouseY);
    buttons[i].draw(mouseOver);
  }

  // playback line
  strokeWeight(5);
  stroke(200);
  line(lineLocation, 0, lineLocation, height);

  // add and update particles and line
  if (!paused) {
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
  }
  system.run();
}


//-----------------------------------------------------------------------------------------------------------

function mousePressed() {
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].isMouseOver(mouseX, mouseY)) {
      buttons[i].onClick();
    }
  }
  var d = dist((mouseX - XSHIFT + XDIST/2) % XDIST, (mouseY - YSHIFT + YDIST/2) % YDIST, XDIST/2, YDIST/2);
  if (d < RAD) {
    var x = Math.floor((mouseX - XSHIFT + XDIST/2) / XDIST);
    var y = Math.floor((mouseY - YSHIFT + YDIST/2) / YDIST);
    clicked[selectedInstrument][y][x] = !clicked[selectedInstrument][y][x];
  }
}

function keyPressed() {
  // spacebar
  if (keyCode === 32) {
    pausePlayback();
  } else if (keyCode === BACKSPACE) {
    clearClicked();
  } else if (keyCode === UP_ARROW && selectedInstrument > 0) {
    switchInstrument(selectedInstrument - 1);
  } else if (keyCode === DOWN_ARROW && selectedInstrument < INSTRUMENTS - 1) {
    switchInstrument(selectedInstrument + 1);
  }
}

function windowResized() {
  WINDOW_X = Math.max(1024, windowWidth);
  WINDOW_Y = Math.max(576, windowHeight);
  XSHIFT = 130;
  YSHIFT = WINDOW_Y / 12;
  XDIST = (WINDOW_X - 260) / 15;
  YDIST = WINDOW_Y / 12;
  // playback speed
  SPEED = XDIST / 20;

  var top_gap = (WINDOW_Y - 276) / 2;
  buttons[0].ymin = top_gap + 104;
  buttons[0].ymax = top_gap + 144;
  buttons[1].ymin = top_gap + 148;
  buttons[1].ymax = top_gap + 188;
  buttons[2].ymin = top_gap + 192;
  buttons[2].ymax = top_gap + 232;
  buttons[3].ymin = top_gap + 236;
  buttons[3].ymax = top_gap + 276;
  buttons[4].ymin = top_gap;
  buttons[4].ymax = top_gap + 40;
  buttons[5].ymin = top_gap + 44;
  buttons[5].ymax = top_gap + 84;

  resizeCanvas(WINDOW_X, WINDOW_Y);
}

//-----------------------------------------------------------------------------------------------------------

// button functions

function clearClicked() {
  for (var a = 0; a < INSTRUMENTS; a++) {
  	for (var i = 0; i < FREQUENCIES; i++) {
   	  for (var j = 0; j < TIMES; j++) {
        clicked[a][i][j] = false;
      }
    }
  }
  lineLocation = 0;
  system.reset();

}

function pausePlayback() {
  paused = !paused;
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
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
  this.acceleration = createVector(0, 0.3);
  this.velocity = createVector(random(-3, 3), random(-4,-2));
  this.position = position.copy();
  this.lifespan = 600 * (- this.position.y / (1.5 * WINDOW_Y) + 1);
  var b1 = color(99, 137, 198);
  var b2 = color(20, 59, 122);
  this.color = lerpColor(b1, b2, Math.random());
};

Particle0.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position -- this one bounces on the walls!
Particle0.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  if (this.position.x <= 0 || this.position.x >= WINDOW_X) {
    this.velocity.x = - this.velocity.x;
    this.velocity.mult(0.85);
  }
  if (this.position.y <= 0 || this.position.y >= WINDOW_Y) {
    this.velocity.y = - this.velocity.y;
    this.velocity.mult(0.85);
  }
  this.lifespan -= 2;
};

// Method to display
Particle0.prototype.display = function() {
  var opacity = Math.min(200, this.lifespan);
  strokeWeight(0);
  this.color.setAlpha(opacity);
  fill(this.color);
  var size = 15;
  quad(this.position.x + size, this.position.y, this.position.x, this.position.y - size, 
    this.position.x - size, this.position.y, this.position.x, this.position.y + size);
};

// Is the particle still useful?
Particle0.prototype.isDead = function(){
  return this.lifespan < 0;
};


//-----------------------------------------------------------------------------------------------------------

// A simple Particle class for xylophone
var Particle1 = function(position) {
  this.acceleration = createVector(0, 0);
  var random_angle = Math.random() * 2 * Math.PI;
  var random_radius = Math.random() *0.5 + 1;
  this.velocity = createVector(random_radius * Math.cos(random_angle), random_radius * Math.sin(random_angle));
  this.position = position.copy();
  this.lifespan = 500;
  var b1 = color(235, 244, 244);
  var b2 = color(186, 242, 242);
  this.color = lerpColor(b1, b2, Math.random());
};

Particle1.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position -- this one spirals outwards!
Particle1.prototype.update = function(){
  this.velocity.rotate(this.lifespan / 30000);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle1.prototype.display = function() {
  var opacity = Math.min(80, this.lifespan / 4);
  strokeWeight(0);
  this.color.setAlpha(opacity);
  fill(this.color);
  ellipse(this.position.x, this.position.y, -this.lifespan/5 + 112, -this.lifespan/5 + 112);
};

// Is the particle still useful?
Particle1.prototype.isDead = function(){
  return this.lifespan < 0;
};


//-----------------------------------------------------------------------------------------------------------

// A simple Particle class for piano 
var Particle2 = function(position) {
  this.acceleration = createVector(0, 0);
  var random_angle = Math.random() * 2 * Math.PI;
  this.velocity = createVector(4 * Math.cos(random_angle), 4 * Math.sin(random_angle));
  this.position = position.copy();
  this.timer = 0;

  // triangle coordinates
  this.x1 = 12 * Math.cos(random_angle);
  this.y1 = 12 * Math.sin(random_angle);
  this.x2 = 12 * Math.cos(random_angle + 2*Math.PI/3);
  this.y2 = 12 * Math.sin(random_angle + 2*Math.PI/3);
  this.x3 = 12 * Math.cos(random_angle + 4*Math.PI/3);
  this.y3 = 12 * Math.sin(random_angle + 4*Math.PI/3);

  // triangle trail
  this.trail = [];
  this.offscreen = false;
};

Particle2.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle2.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.timer += 2;
  if (this.timer % 30 === 0 && !this.offscreen) {
    this.trail.push([this.position.copy(), this.timer]);
  }
  if (this.position.x <= 0 || this.position.x >= WINDOW_X || this.position.y <= 0 || this.position.y >= WINDOW_Y) {
    this.offscreen = true;
  }
};

// Method to display -- shooting triangles and trails
Particle2.prototype.display = function() {
  // display the triangle
  strokeWeight(0);
  fill(27, 109, 8, 150);
  triangle(this.position.x + this.x1, this.position.y + this.y1, this.position.x + this.x2, this.position.y + this.y2,
    this.position.x + this.x3, this.position.y + this.y3);
  // display the trail
  for (var i = 0; i < this.trail.length; i++) {
    var current_triangle = this.trail[i][0];
    var timestamp = this.trail[i][1];
    var opacity = timestamp - this.timer + 100;
    if (opacity < 0) {
      this.trail.splice(i, 1);
    }
    else {
      strokeWeight(0);
      fill(91, 54, 0, opacity);
      triangle(current_triangle.x + this.x1, current_triangle.y + this.y1, current_triangle.x + this.x2, current_triangle.y + this.y2,
      current_triangle.x + this.x3, current_triangle.y + this.y3);
    }
  }
};

// Is the particle still useful?
Particle2.prototype.isDead = function(){
  return this.offscreen && (this.trail.length === 0);
};



//-----------------------------------------------------------------------------------------------------------

// A simple Particle class for pizz 
var Particle3 = function(position) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-3, 3), random(-1, 0));
  this.position = position.copy();
  this.attractor = createVector(this.position.x, 30);
  this.g_val = Math.random() * 100 + 70;
  this.size = 40;
};

Particle3.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position -- this one is attracted upwards!
Particle3.prototype.update = function(){
  this.acceleration = p5.Vector.sub(this.attractor, this.position);
  var distance = this.acceleration.mag();
  this.acceleration.normalize().mult(40/distance);
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.size *= 0.98;
};

// Method to display
Particle3.prototype.display = function() {
  strokeWeight(0);
  fill(232, this.g_val, 27, 200);
  rectMode(CENTER);
  rect(this.position.x, this.position.y, this.size, this.size, 3);
};

// Is the particle still useful?
Particle3.prototype.isDead = function(){
  return this.position.x <= 0 || this.position.x >= WINDOW_X || this.position.y <= 0 || this.position.y >= WINDOW_Y;
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

ParticleSystem.prototype.reset = function() {
  this.particles = [];
}

//-----------------------------------------------------------------------------------------------------------

// A simple button
var Button = function(xmin, ymin, xmax, ymax, icon, onClick, selected) {
  this.xmin = xmin;
  this.ymin = ymin;
  this.xmax = xmax;
  this.ymax = ymax;
  this.icon = icon;
  this.onClick = onClick;
  this.isSelected = selected;
};

Button.prototype.draw = function(mouseOver) {
  // draw the button
  rectMode(CORNERS);
  strokeWeight(2);
  stroke(255, 255, 255, 127);
  fill(0, 0, 0, 0);
  if (this.isSelected) {
    stroke(255, 255, 255, 220);
  } 
  if (mouseOver) {
    stroke(255, 255, 255, 255);
  }
  rect(this.xmin, this.ymin, this.xmax, this.ymax, 5);

  // draw the icon
  var xcenter = (this.xmin + this.xmax) / 2;
  var ycenter = (this.ymin + this.ymax) / 2;
  if (this.icon === 'diamond') {
        quad(xcenter + RAD+1, ycenter, xcenter, ycenter - RAD-1, 
          xcenter - RAD-1, ycenter, xcenter, ycenter + RAD+1);
      }
      else if (this.icon === 'circle') {
        ellipse(xcenter, ycenter, RAD * 2.15, RAD * 2.15);
      }
      else if (this.icon === 'triangle') {
        triangle(xcenter, ycenter - RAD, xcenter + RAD * 2 / Math.sqrt(3), ycenter + RAD,
          xcenter - RAD * 2 / Math.sqrt(3), ycenter + RAD);
      }
      else if (this.icon === 'square') {
        rectMode(CENTER);
        rect(xcenter, ycenter, RAD * 2, RAD * 2);
      }
      else if (this.icon === 'pause' && !paused) {
        rectMode(CENTER);
        rect(xcenter - 5, ycenter, 5, RAD * 2);
        rect(xcenter + 5, ycenter, 5, RAD * 2);
      }
      else if (this.icon === 'pause' && paused) {
        triangle(xcenter + RAD, ycenter, xcenter - RAD, ycenter + RAD * 2 / Math.sqrt(3),
          xcenter - RAD, ycenter - RAD * 2 / Math.sqrt(3));
      }
      else if (this.icon === 'reset') {
        strokeWeight(4);
        line(xcenter - RAD, ycenter - RAD, xcenter + RAD, ycenter + RAD);
        line(xcenter - RAD, ycenter + RAD, xcenter + RAD, ycenter - RAD);
      }

};

Button.prototype.isMouseOver = function(mouseX, mouseY) {
  return (mouseX >= this.xmin && mouseX <= this.xmax && mouseY >= this.ymin && mouseY <= this.ymax);
};
