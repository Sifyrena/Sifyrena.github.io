/* global createCanvas*/
/* global width*/
/* global height*/
/* global background*/
/* global line*/
/* global resizeCanvas*/
/* global ellipse*/
/* global mouseX*/
/* global mouseY*/
/* global strokeWeight*/
/* global rect*/


const k = 9*(Math.pow(10, 9));
const e = 2.718281828;

function update(dt, particles, vectors, width, height) {
  for (var i = 0; i < particles.length; i++) {
    var netField = netElectricField(particles, vectors, particles[i].x,
                                    particles[i].y, particles[i].r);
    //acceleration initial X and Y
    var aiX = particles[i].charge*netField.x/particles[i].mass;
    var aiY = particles[i].charge*netField.y/particles[i].mass;
    
    particles[i].vx += aiX * dt;
    particles[i].vy += aiY * dt;
  }
  
  //collision
  for (var i = 0; i < particles.length; i++) {
    if(particles.length > 1) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[j].x - particles[i].x;
        var dy = particles[j].y - particles[i].y;
        var d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

        var dvx = particles[j].vx - particles[i].vx;
        var dvy = particles[j].vy - particles[i].vy;
        
        var velDotDis = dvx * dx + dvy * dy;
        
        //collision and modification velocity (see Diego's website for the full formula)
        if(d <= (particles[i].r + particles[j].r) && velDotDis < 0){ //checks if distance between particles = 0 and 
            //Start of computing lamda (as in the formula in the website)
            var disSquared = dx*dx + dy*dy;
            
            var l = -2*particles[i].mass*particles[j].mass/(particles[i].mass + particles[j].mass)*velDotDis/disSquared;
            //end of computation of lamda
            
            //after collision, modification of the velocities of each particle (following the formula on Diego's website)
            particles[i].vx -= l/(particles[i].mass)*dx;
            particles[i].vy -= l/(particles[i].mass)*dy;
            particles[j].vx += l/(particles[j].mass)*dx;
            particles[j].vy += l/(particles[j].mass)*dy;
        }
      }
    }
    
    //to set the bounderies of the screen and make the particles bounce on the edges of the screen
    if (particles[i].x + particles[i].r >= width){
        particles[i].vx *= -1;
        particles[i].x = width - particles[i].r;
    } else if (particles[i].x - particles[i].r <= 0){
        particles[i].vx *= -1;
        particles[i].x = particles[i].r;
    }
    if (particles[i].y + particles[i].r >= height){
        particles[i].vy *= -1;
        particles[i].y = height - particles[i].r;

    } else if (particles[i].y - particles[i].r <= 0){
        particles[i].vy *= -1;
        particles[i].y = particles[i].r;
    }
    particles[i].x += particles[i].vx * dt;
    particles[i].y += particles[i].vy * dt;
  }
}

//vectors here is only an array storing the vectorsElectricFields
function netElectricField(particles, vectors, x, y, r){
  var eNetX = 0;
  var eNetY = 0;
  
  var dx, dy, d;
  
  //goes throught the electric fields vectors 
  for (var j = 0; j < vectors.length; j++){
    //distances between the position of the particles and the positions of tails of the electric fields vectors
    dx = vectors[j].tailX - x;
    dy = vectors[j].tailY - y;
    
    d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
    
    //calculate the net electric field (in components)
    eNetX += Math.pow(e, -d/100) * vectors[j].x * 200;
    eNetY += Math.pow(e, -d/100) * vectors[j].y * 200;
  }
  
  for(var j = 0; j< particles.length; j++){
    //position of the particle - position of each particle
    dx = x - particles[j].x;
    dy = y - particles[j].y;
    d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
    // electric field due to j
    if (d > particles[j].r + r) {
      var E = k*particles[j].charge/(Math.pow(d, 2)); 
      eNetX += E * (dx/d);
      eNetY += E * (dy/d);
    }
  }

  return {x:eNetX, y:eNetY};
}

//update(1, particles, sceneWidth, sceneHeight);



const METER_RATIO = 1/7;
const NUM_SECTIONS = 10;
const MENU_RATIO = NUM_SECTIONS;
var particles = [];
var vectors = [];

var paused = false;


var menuHeight, menuWidth; // menu dimensions
var sceneHeight, sceneWidth; // scene dimensions
var oldSceneWidth, oldSceneHeight; //old scene dimensions
var oldWidth, oldHeight; // old canvas dimensions

var metersInPixels;

var drawingMode = 0;


const POSITIVE_PARTICLE_MODE = 0;
const NEUTRAL_PARTICLE_MODE = 1;
const NEGATIVE_PARTICLE_MODE = 2;
const BIG_POSITIVE_PARTICLE_MODE = 3;
const BIG_NEUTRAL_PARTICLE_MODE = 4;
const BIG_NEGATIVE_PARTICLE_MODE = 5;
const VECTOR_MODE = 6;
const ERASOR_MODE = 7;
const PLAY_PAUSE_MODE = 8;
const DELETE_ALL = 9;


const PARTICLE_MODES = [POSITIVE_PARTICLE_MODE,
  NEUTRAL_PARTICLE_MODE,
  NEGATIVE_PARTICLE_MODE,
  BIG_NEGATIVE_PARTICLE_MODE,
  BIG_NEUTRAL_PARTICLE_MODE,
  BIG_POSITIVE_PARTICLE_MODE];
  
const SMALL_PARTICLES = [POSITIVE_PARTICLE_MODE,
  NEGATIVE_PARTICLE_MODE,
  NEGATIVE_PARTICLE_MODE];
  
const BIG_PARTICLES = [BIG_POSITIVE_PARTICLE_MODE,
  BIG_NEUTRAL_PARTICLE_MODE,
  BIG_NEGATIVE_PARTICLE_MODE];
  
const POSITIVE_PARTICLES = [POSITIVE_PARTICLE_MODE, BIG_POSITIVE_PARTICLE_MODE];
const NEUTRAL_PARTICLES = [NEUTRAL_PARTICLE_MODE, BIG_NEUTRAL_PARTICLE_MODE];
const NEGATIVE_PARTICLES = [NEGATIVE_PARTICLE_MODE, BIG_NEGATIVE_PARTICLE_MODE];

var mouseHasBeenPressed = false;

var tailX, tailY;

//The drawing modes are: 0: particle, 1: vector, 2: erasor

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  oldWidth = width;
  oldHeight = height;
  if (width >= height) {
    menuHeight = height;
    menuWidth = height/MENU_RATIO;
    oldSceneWidth = width - menuWidth;
    oldSceneHeight = height;
  } else {
    menuWidth = width;
    menuHeight = width/MENU_RATIO;
    oldSceneWidth = width;
    oldSceneHeight = height - menuHeight;
  }
} 

function draw() {
  
  if (width >= height) {
    // draw menu on the left getSide()
    menuHeight = height;
    menuWidth = height/MENU_RATIO;
    sceneWidth = width - menuWidth;
    sceneHeight = height;
  } else {
    menuWidth = width;
    menuHeight = width/MENU_RATIO;
    sceneWidth = width;
    sceneHeight = height - menuHeight;
  }
  metersInPixels = METER_RATIO * sceneWidth;
  
  if (!paused){
    update(1, particles, vectors, sceneWidth, sceneHeight);
  }
  
  if (oldWidth != width || oldHeight != height){
    // scale the particles
    for (var i = 0; i < particles.length; i++){
      particles[i].x *= sceneWidth / oldSceneWidth;
      particles[i].y *= sceneHeight / oldSceneHeight;
      particles[i].vx *= sceneWidth / oldSceneWidth;
      particles[i].vy *= sceneHeight / oldSceneHeight;
      particles[i].r *= sceneWidth / oldSceneWidth;//Math.sqrt(sceneWidth*sceneHeight / (oldSceneWidth * oldSceneHeight));
      // if (sceneWidth / oldSceneWidth < sceneHeight / oldSceneHeight){
      //   // scale the radius with x component
      //   if (sceneWidth / oldSceneWidth < 1){
      //     particles[i].r *= sceneWidth / oldSceneWidth;
      //   } else {
      //     particles[i].r *= oldSceneWidth / sceneWidth;
      //   }
      // } else {
      //   // scale the radius with y component
      //   if (sceneHeight / oldSceneHeight < 1) {
      //   particles[i].r *= sceneHeight / oldSceneHeight;
      //   } else {
      //   particles[i].r *= oldSceneHeight / sceneHeight;
      //   }
      // }
    }
    oldWidth = width;
    oldHeight = height;
    oldSceneWidth = sceneWidth;
    oldSceneHeight = sceneHeight;
  }
  
  // DRAWING HAPPENS HERE
  drawScene();
}


//Drawing Functions
function drawScene(){
  background(220);
  
  var num = 15;
  for (var i = 0; i < num; i++){
    for (var j = 0; j < num; j++){
      var x1 = (i)/(num-1) * sceneWidth;
      var y1 = (j)/(num-1)*sceneHeight;
      var netField = netElectricField(particles, vectors, x1, y1, 0);
      var scale = 1/1000;
      stroke(0, 155, 0);
      drawVector(x1, y1, x1+netField.x* scale, y1+netField.y*scale);
    }
  }
  
  for (var i = 0; i < vectors.length; i++){
    stroke(0);
    drawVector(vectors[i].tailX, vectors[i].tailY, vectors[i].headX, vectors[i].headY);
  }
  for (var i = 0; i < particles.length; i++){
    var c;
    if (particles[i].charge > 0){
      c = color(0, 0, 255);
    } else if (particles[i].charge < 0) {
      c = color(255, 0, 0);
    } else {
      c = color(0);
    }
    drawParticle(particles[i].x, particles[i].y, particles[i].r, c);
  }
  
  
  //console.log("hello")
  stroke(0);
 
  strokeWeight(Math.max(menuWidth, menuHeight)/150);
  stroke(0);
  fill(0);
  drawMenu();
  strokeWeight(Math.max(menuWidth, menuHeight)/150);
  stroke(0);
  fill(0);
  drawMeterScale();
  
  if (!isMouseInMenu()){
    
    if (PARTICLE_MODES.indexOf(drawingMode) != -1){
      var radius = 20;
      var c;
      if (drawingMode === POSITIVE_PARTICLE_MODE){
        c = 'rgba(0, 0, 255, 0.5)';
      } else if (drawingMode === NEUTRAL_PARTICLE_MODE){
        c = 'rgba(125, 125, 125, 0.5)';
      } else if (drawingMode === NEGATIVE_PARTICLE_MODE){
        c = 'rgba(255, 0, 0, 0.5)';
      } else if (drawingMode === BIG_POSITIVE_PARTICLE_MODE){
        radius *= 2;
        c = 'rgba(0, 0, 255, 0.5)';
      } else if (drawingMode === BIG_NEUTRAL_PARTICLE_MODE){
        radius *= 2;
        c = 'rgba(125, 125, 125, 0.5)';
      } else if (drawingMode === BIG_NEGATIVE_PARTICLE_MODE){
        radius *= 2;
        c = 'rgba(255, 0, 0, 0.5)';
      }
      
      
      drawParticle(mouseX, mouseY, radius, color(c));
    }
    
    // if (drawingMode == POSITIVE_PARTICLE_MODE){
    //   drawParticle(mouseX, mouseY, 20, color('rgba(0, 0, 255, 0.5)'));
    // } else if (drawingMode == NEUTRAL_PARTICLE_MODE){
    //   drawParticle(mouseX, mouseY, 20, color('rgba(125, 125, 125, 0.5)'));
    // } else if (drawingMode == NEGATIVE_PARTICLE_MODE){
    //   drawParticle(mouseX, mouseY, 20, color('rgba(255, 0, 0, 0.5)'));
    // }
    else if (drawingMode == VECTOR_MODE && mouseHasBeenPressed){
      stroke(125);
      drawVector(tailX, tailY, mouseX, mouseY);
    } else if (drawingMode == ERASOR_MODE && mouseIsPressed){
      drawErasor(mouseX, mouseY, Math.min(menuWidth/7, menuHeight/7));
      var r = Math.min(menuWidth/7, menuHeight/7);
      if (mousePressed){
        for (var i = particles.length - 1; i >= 0; i--){
          if (Math.pow(particles[i].x - mouseX, 2) + Math.pow(particles[i].y - mouseY, 2) < particles[i].r * particles[i].r){
           particles.splice(i, 1); 
          }
        }
        for (var i = vectors.length - 1; i >= 0; i--){
          if (Math.pow(vectors[i].tailX - mouseX, 2) + Math.pow(vectors[i].tailY - mouseY, 2) < getSide()/2){
           vectors.splice(i, 1); 
          }
        }
      }
    }
  }
}

function drawMeterScale(){
  var x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
  
  x5 = sceneWidth - (metersInPixels/6 + metersInPixels);
  y5 = sceneHeight - (2 * metersInPixels/6);
  x6 = sceneWidth - metersInPixels/6;
  y6 = y5;
  x1 = x5;
  y1 = y5 - metersInPixels/6;
  x2 = x5;
  y2 = y5 + metersInPixels/6;
  x3 = x6;
  y3 = y1;
  x4 = x6;
  y4 = y2;
  line(x5, y5, x6, y6);
  line(x1, y1, x2, y2);
  line(x3, y3, x4, y4);
  textSize(metersInPixels*(1/4));
  noStroke()
  text("1 meter", x5 + 1/14 * metersInPixels, (y5 + y3)/2);
 
}

function drawMenu(){
  if (width >= height) {
    // draw menu on the right getSide()
    line(sceneWidth, 0, sceneWidth, height);
    fill(0, 155, 155);
    rect(sceneWidth, 0, menuWidth, menuHeight);
    
    for (var i = 0; i < NUM_SECTIONS+1; i++){
      stroke(0)
      line(sceneWidth, i * getSide(), width, i * getSide());
      if (i == drawingMode){
        fill(0, 255, 0);
        rect(sceneWidth,i * getSide() , menuWidth, getSide());
      }
    }
    
    // here
    for (var i = 0; i < PARTICLE_MODES.length; i++){
      var modeToDraw = PARTICLE_MODES[i];
      var r = 1/8 * getSide();
      var c;
      if (BIG_PARTICLES.indexOf(modeToDraw) !== -1){
        r *= 2;
      }
      if (POSITIVE_PARTICLES.indexOf(modeToDraw) !== -1){
        c = color(0, 0, 255);
      } else if (NEUTRAL_PARTICLES.indexOf(modeToDraw) !== -1){
        c = color(0);
      }else if (NEGATIVE_PARTICLES.indexOf(modeToDraw) !== -1){
        c = color(255, 0, 0);
      }
      drawParticle(width-menuWidth/2, getSide()*(modeToDraw+0.5), r, c);
    }
    stroke(0);
    drawVector(width - (6/7)*menuWidth, (VECTOR_MODE+6/7) * getSide(), width - menuWidth/7, (VECTOR_MODE + 1/7) * getSide());
    drawErasor(width - 1/2 * menuWidth, getSide() * ERASOR_MODE+  1/2 * getSide(), menuWidth/7);
    drawX(width - 1/2*menuWidth, getSide()*DELETE_ALL + 1/2*getSide(), getSide()/2);
    drawPlayPause(width - 1/2*menuWidth, getSide() * (PLAY_PAUSE_MODE + 0.5), getSide()/2);
  } else {
    // draw the menu on the bottom
    line(0, sceneHeight, width, sceneHeight);
    fill(0, 125, 155);
    rect(0, sceneHeight, menuWidth, menuHeight);
    
    line(sceneWidth, 0, sceneWidth, height);
    for (var i = 0; i < NUM_SECTIONS+1; i++){
      line(i * getSide() , sceneHeight, i * getSide(), height);
      if (i == drawingMode){
        fill(0, 255, 0);
        rect(i*getSide(), height - menuHeight, getSide(), menuHeight);
      }
    }
    drawParticle(1/2 * getSide(), height - 1/2 * menuHeight, 1/8 * getSide(), color(0, 0, 255));
    drawParticle(getSide() + 1/2 * getSide(), height - 1/2 * menuHeight, 1/8 * width/NUM_SECTIONS, color(255, 0, 0));
    stroke(0);
    drawVector(getSide() + (8/7)*getSide(), height - (1/7)*menuHeight, 3*getSide() - (1/7) * getSide(), height - 6*menuHeight/7);
    drawErasor(getSide() + 5/2 * getSide(), height - 1/2 * menuHeight, menuHeight/7);
  }
}

function drawVector(x1, y1, x2, y2){
  push();
  var theta = PI/6;
  translate(x1, y1);
  var angle = atan2(y2 - y1, x2 - x1);
  rotate(angle);
  var L = Math.sqrt((x1-x2)*(x1-x2) + (y1 - y2) * (y1-y2));
  strokeWeight(1 + Math.log(L+1)/5);
  line(0, 0, L, 0);
  line(L, 0, L - L/3 * cos(theta), L/3 * sin(theta));
  line(L, 0, L - L/3 * cos(theta), -L/3 * sin(theta))
  pop();
}

function drawParticle(x, y, r, c) {
  noStroke();
  fill(c);
  
  ellipse(x, y, 2 * r, 2 * r);
}


function drawErasor(x, y, l){
  var angle = PI/4;
  push();
  translate(x, y);
  rotate(angle);
  fill(0);
  stroke(0);
  strokeWeight(l/10);
  rect(-l/2, -l/2, l * 3/2, l);
  noFill();
  rect(-l, -l/2, l/2, l);
  pop();
}

function drawPlayPause(x, y, l){
  push();
  translate(x, y);
  fill(0);
  stroke(0);
  if (!paused){
    triangle(-l/2, -l/2, -l/2, l/2, l/2, 0);
  } else {
    rect(-l/2, -l/2, l, l);
  }
  pop();
}

function drawX(x, y, l){
  push();
  stroke(0);
  strokeWeight(10);
  translate(x, y);
  line(-l/2, -l/2, l/2, l/2);
  line(l/2, -l/2, -l/2, l/2);
  pop();
}

//Helper Functions
function isLandscape(){
  return width >= height;
}

function getSide(){
  if (isLandscape()){
    return menuHeight/NUM_SECTIONS;
  } else {
    return width/NUM_SECTIONS;
  }
}

function getSelectedItem(){
  var item = -1;
  if (isMouseInMenu()){
    if (isLandscape()){
      item = Math.floor(mouseY/getSide());
    } else {
      item = Math.floor(mouseX/getSide());
    }
  }
  return item;
}

function isMouseInMenu(){
  if (isLandscape()){
    return (mouseX > width - menuWidth);
  } else {
    return (mouseY > height - menuHeight);
  }
}

// EVENTS
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

//fix radius and charge to SI
function mousePressed() {
  
  if (PARTICLE_MODES.indexOf(drawingMode) !== -1){
    var r = 20;
    var mass = Math.PI*Math.pow(r, 2);
    var charge = 0.01
    var vx = 0;
    var vy = 0;
    
    if (BIG_PARTICLES.indexOf(drawingMode) !== -1){
      r *= 2;
      charge *= 2;
      mass *= 4;
    }
    
    if (NEGATIVE_PARTICLES.indexOf(drawingMode) !== -1){
      charge *= -1;
    }
    
    if (NEUTRAL_PARTICLES.indexOf(drawingMode) !== -1){
      charge = 0;
      vx = 10*(0.5-random());
      vy = 10*(0.5-random());
    }
    
    if (width >= height){
      if (mouseX + r < width - menuWidth){
        particles.push({
          x: mouseX,
          y: mouseY,
          r: r,
          mass: mass,
          charge: charge,
          vx: vx,
          vy: vy
        });
      }
    } else {
      if (mouseY + r < height - menuHeight){
        particles.push({
          x: mouseX,
          y: mouseY,
          r: r,
          mass: mass,
          charge: charge,
          vx: vx,
          vy: vy
        });
      }
    }
  } else if (drawingMode == VECTOR_MODE){
    if (!mouseHasBeenPressed && !isMouseInMenu()){
      tailX = mouseX;
      tailY = mouseY;
      mouseHasBeenPressed = true;
    } else if (!isMouseInMenu()) {
      vectors.push(
        {
          tailX: tailX,
          tailY: tailY,
          headX: mouseX,
          headY: mouseY,
          x: mouseX - tailX,
          y: mouseY - tailY
        });
      mouseHasBeenPressed = false;
    }
  } else if (drawingMode == PLAY_PAUSE_MODE && !isMouseInMenu()){
    paused = !paused
  }
  
  var item = getSelectedItem();
  if (item > -1){
    if (item === PLAY_PAUSE_MODE){
      paused = !paused;
    } else if (item === DELETE_ALL){
      particles = [];
      vectors = [];
    } else {
      drawingMode = item;
    }
  }
}
