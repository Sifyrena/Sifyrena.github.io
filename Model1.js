// FW BOXES AND SLIDERS

const SphCM = 2.00;
const aCM = 1.90;
const HoleDiamCM = 0.15;

const BoGX = 19;
const BoGY = 13;

const BoSIX = BoGX * aCM


// Placement Helpers

let PlVelo =  5;
let PlAngl = 0;
let PlX = 0;
let PlY = 0;


// Placement Helpers Specific to Task 1

let PlV1 = 3;
let PlA1 = 0;
let PlX1 = 0;
let PlY1 = 0;

let PlV2 = 3;
let PlA2 = 180;
let PlX2 = 0;
let PlY2 = 0;


// Original

const k = 9*(Math.pow(10, 9));
const e = 2.718281828;
const Pi = 3.14159265358;
const RadAng = Pi/180;

let METER_RATIO; // PlaceHolder Value. Will be updated by draw. centimetres per pixel.

const NUM_SECTIONS = 10;
const MENU_RATIO = NUM_SECTIONS;
let particles = [];
let particlesCM = [];
let vectors = [];

let paused = true;
let movingmenu = false;

let menuHeight, menuWidth; //  menu dimensions
let sceneHeight, sceneWidth; //  scene dimensions
let oldSceneWidth, oldSceneHeight; // old scene dimensions
let oldWidth, oldHeight; //  old canvas dimensions

let CBOX, CBOY, CBW, CBH ; // Infobox Size

let VarInput; // 'x','y','v','Th'

let DX = 0;
let DY = 0;

let OriginX;
let OriginY;

let originalbox = true;

let metersInPixels;
let drawingMode = 4;

let CircOX, CircOY;

/*
const PlasticColor = color(255,0,0);
const PosChargeColor = color(229,184,73);
const NegChargeColor = color(15,59,192);
*/

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

const PARTICLE_MODES = [
  POSITIVE_PARTICLE_MODE,
  NEUTRAL_PARTICLE_MODE,
  NEGATIVE_PARTICLE_MODE,
  BIG_NEGATIVE_PARTICLE_MODE,
  BIG_NEUTRAL_PARTICLE_MODE,
  BIG_POSITIVE_PARTICLE_MODE
];

const SMALL_PARTICLES = [
  POSITIVE_PARTICLE_MODE,
  NEGATIVE_PARTICLE_MODE,
  NEGATIVE_PARTICLE_MODE
];

const BIG_PARTICLES = [
  BIG_POSITIVE_PARTICLE_MODE,
  BIG_NEUTRAL_PARTICLE_MODE,
  BIG_NEGATIVE_PARTICLE_MODE
];

const POSITIVE_PARTICLES = [POSITIVE_PARTICLE_MODE, BIG_POSITIVE_PARTICLE_MODE];
const NEUTRAL_PARTICLES = [NEUTRAL_PARTICLE_MODE, BIG_NEUTRAL_PARTICLE_MODE];
const NEGATIVE_PARTICLES = [NEGATIVE_PARTICLE_MODE, BIG_NEGATIVE_PARTICLE_MODE];

let mouseHasBeenPressed = false;
let tailX, tailY;

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.parent("myDiv");

  oldWidth = width;
  oldHeight = height;
  if (isLandscape()) {
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

function greet() {
  const name = input.value();
  greeting.html('hello ' + name + '!');
  input.value('');

  for (let i = 0; i < 200; i++) {
    push();
    fill(random(255), 255, 255);
    translate(random(width), random(height));
    rotate(random(2 * PI));
    text(name, 0, 0);
    pop();
  }
}

function highlight(){
  dropzone.style('background-color', '#ccc');
}

function unhighlight(){
  dropzone.style('background-color', '#fff');
}

function gotFile(file){
  createP(file.name + " " + file.type + " " + file.size);
  createP(join(file.data, "<br/>"));
}


function draw() {

  if (isLandscape()) {
    // draw menu on the right getSide()
    menuHeight = height;
    menuWidth = height / MENU_RATIO;

    if (!isBoardWide()){
	
	sceneWidth = width - menuWidth;
	sceneHeight = sceneWidth * BoGY/BoGX;

    }else{
	sceneHeight = height;
	sceneWidth = sceneHeight / BoGY*BoGX;
    }

    CBW = menuHeight/2;
    CBH = menuHeight/8;
  } else {
    menuWidth = width;
    menuHeight = width / MENU_RATIO;


    if (!isBoardWide()){
	
	sceneWidth = width
	sceneHeight = sceneWidth * BoGY/BoGX;

    }else{
	sceneHeight = height - menuHeight;
	sceneWidth = sceneHeight / BoGY*BoGX;
    }
    CBW = menuWidth/2;
    CBH = menuWidth/8;


  }

  CBOX = 0 + DX;
  CBOY = sceneHeight - menuHeight/5 + DY;
  metersInPixels = BoSIX;

  METER_RATIO = metersInPixels / sceneWidth;

  OriginX = sceneWidth / 2;
  OriginY = sceneHeight / 2; 

  if (!paused){
    update(1, particles, vectors, sceneWidth, sceneHeight);
  }

  // DRAWING HAPPENS HERE
  drawScene();

}

// ###############
// #             #
// #   Drawing   #
// #             #
// ###############


// The Previous Mass's Variables (Global)


function drawScene(){


  background(195,120,10);


  if (!Listening){
  fill(253);
} else {fill(190);}

  rect(0,0,sceneWidth,sceneHeight);



  noStroke();

  drawGrids();

  noFill();
  stroke(155,96,70);
  strokeWeight(Math.max(menuWidth, menuHeight)/50);

  rect(0,0,sceneWidth,sceneHeight);

  let num = 14;
  for (let i = 1; i < num-1; i++){
    for (let j = 1; j < num-1; j++){
      let x1 = (i)/(num-1) * sceneWidth;
      let y1 = (j)/(num-1)*sceneHeight;
      let netField = netElectricField(particles, vectors, x1, y1, 0);
      let scale = 1/1000;
      stroke(0, 155, 0);
    }
  }

  for (let i = 0; i < vectors.length; i++){
    stroke(0);
  }

  for (let i = 0; i < particles.length; i++){
    let c;
    if (particles[i].charge > 0){
      c = color(10, 10, 122);
    } else if (particles[i].charge < 0) {
      c = color(122, 10, 10);
    } else {
      c = color(255,0,0);
    }
    drawParticle(particles[i].x, particles[i].y, particles[i].r, c);
  }
  drawVel();

  stroke(0);
  strokeWeight(Math.max(menuWidth, menuHeight)/150);
  stroke(0);
  fill(0);
  drawMenu();
  drawPaws();
  drawConditionBar();
  drawDynValues(PlX,PlY,PlVelo,PlAngl);
  drawMenuRemaining();
  drawAngular();
  drawMeterScale();

  //strokeWeight(Math.max(menuWidth, menuHeight)/150);
  //stroke(0);
  fill(0);

  if (!isMouseInMenu()){
    if (PARTICLE_MODES.indexOf(drawingMode) != -1){
      let radius = 10;
      let c;
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
        c = 'rgba(125, 125, 125, 1)';
      } else if (drawingMode === BIG_NEGATIVE_PARTICLE_MODE){
        radius *= 2;
        c = 'rgba(255, 0, 0, 0.5)';
      }
      if (!Listening && !movingmenu){
      
      let PVX = radius*cos(PlAngl*RadAng);
      let PVY = -1*radius*sin(PlAngl*RadAng);
      drawVector(mouseX, mouseY, mouseX+ PVX, mouseY+PVY);
          
      drawParticle(mouseX, mouseY, radius, color('rgba(255, 0, 0, 0.5)'));}
    }

    else if (drawingMode == VECTOR_MODE && mouseHasBeenPressed){
      stroke(125);
      drawVector(tailX, tailY, mouseX, mouseY);
    }
    
    else if (drawingMode == ERASOR_MODE && mouseIsPressed){
      drawErasor(mouseX, mouseY, Math.min(menuWidth/7, menuHeight/7));
      let r = Math.min(menuWidth/7, menuHeight/7);
      if (mousePressed){
        for (let i = particles.length - 1; i >= 0; i--){
          if (Math.pow(particles[i].x - mouseX, 2) + Math.pow(particles[i].y - mouseY, 2)
            < particles[i].r * particles[i].r){
            particles.splice(i, 1); 
          }
        }
        for (let i = vectors.length - 1; i >= 0; i--){
          if (Math.pow(vectors[i].tailX - mouseX, 2) + Math.pow(vectors[i].tailY - mouseY, 2)
            < getSide()/2){
            vectors.splice(i, 1); 
          }
        }
      }
    }
  }
}

let MenuItemDrawingFunctions = [
  (x, y, s) => drawParticle(x + s / 2, y + s / 2, s / 8, color(0, 0, 100,0)),
  (x, y, s) => drawParticle(x + s / 2, y + s / 2, s / 8, color(100,0,0,0)),
  (x, y, s) => drawParticle(x + s / 2, y + s / 2, s / 8, color(160, 128, 51,0)),
  (x, y, s) => drawParticle(x + s / 2, y + s / 2, s / 4, color(0, 0, 100,0)),
  (x, y, s) => drawParticle(x + s / 2, y + s / 2, s / 4, color(255,0,0)),
  (x, y, s) => drawParticle(x + s / 2, y + s / 2, s / 4, color(160, 128, 51,0)),
  (x, y, s) => drawParticle(x + s / 2, y + s / 2, s / 4, color(160, 128, 51,0)),
  (x, y, s) => drawErasor(x + s/2, y + s/2, s/7),
  (x, y, s) => drawPlayPause(x + s/2, y + s/2, s/2),
  (x, y, s) => drawX(x + s/2, y + s/2, s/2),
];

function drawMeterScale(){
  var x5, y5, x6, y6;
  
  x5 = sceneWidth - (2 * metersInPixels);
  y5 = sceneHeight - (metersInPixels);
  x6 = sceneWidth - metersInPixels;
  y6 = y5;
  
  stroke(0);
  line(x5, y5, x6, y6);
  //line(x1, y1, x2, y2);
  //line(x3, y3, x4, y4);
  textSize(metersInPixels/2);
  noStroke();
  fill(0);

  textAlign(RIGHT,TOP);
  text("1 cm", x5 + metersInPixels, (y5+metersInPixels/6));
 
}


function drawMenu(){
  fill(135, 135, 135);
  if (isLandscape()) {
    // draw menu on the right getSide()
    //line(sceneWidth, 0, sceneWidth, height);
    rect(width - menuWidth, 0, menuWidth, menuHeight);

    for (let i = 0; i < NUM_SECTIONS+1; i++){
      stroke(0)
      line(width - menuWidth, i * getSide(), width, i * getSide());
      if (i == drawingMode){
        fill(0, 0, 0);
        rect(width - menuWidth,i * getSide() , menuWidth, getSide());
      }
    }

    for (let i = 0; i < NUM_SECTIONS; i++) {
      MenuItemDrawingFunctions[i](width - menuWidth, getSide() * i, getSide());
    }
  } else {
    //  draw the menu on the bottom
    //line(0, sceneHeight, width, sceneHeight);
    rect(0, height-menuHeight, menuWidth, menuHeight);

    line(sceneWidth, 0, sceneWidth, height);
    for (let i = 0; i < NUM_SECTIONS+1; i++){
      line(i * getSide() , height-menuHeight, i * getSide(), height);
      if (i == drawingMode){
        fill(0, 0, 0);
        rect(i*getSide(), height - menuHeight, getSide(), menuHeight);
      }
    }

    for (let i = 0; i < NUM_SECTIONS; i++) {
      MenuItemDrawingFunctions[i](getSide() * i, height - menuHeight, getSide());
    }
  }
}

function drawGrids(){

  fill('rgba(2,2,2,0.5)');

  let Grading = aCM / METER_RATIO;
  let HoleDiam = HoleDiamCM / METER_RATIO

  for (let j = 0; j < BoGY+1; j++) {
    for (let i = 0; i < BoGX+1; i++) {
      ellipse(Grading*i,Grading*j,HoleDiam,HoleDiam);
    }
  }
}

function drawConditionBar(){
    //  draw the menu on the Bottom Left

    if (movingmenu){
      fill('rgba(100,150,196, 0.55)')
      rect(mouseX-17.5,mouseY-17.5,35,35);
    } else {


    fill('rgba(222,222,222, 0.75)');
    rect(CBOX,CBOY,CBW,CBH);
    fill('rgba(100,150,196, 0.95)')
    rect(CBOX+CBW-35,CBOY,35,35);


    textSize(metersInPixels/1);
    textAlign(CENTER, CENTER);
    fill('rgba(0,0,0, 0.75)');
    text("✢",CBOX+CBW-17.5,CBOY+17.5);
    
    fill(255);
    rect(CBOX+CBW/50,CBOY+CBH/5, CBW/5, CBH/4);
    rect(CBOX+CBW/4,CBOY+CBH/5, CBW/5,CBH/4);
    rect(CBOX+CBW/50,CBOY+0.7*CBH, CBW/5, CBH/4);
    rect(CBOX+CBW/4,CBOY+0.7*CBH, CBW/5, CBH/4);

    fill(0);

    textAlign(CENTER, CENTER);
    textSize(metersInPixels/2);


    text('x',CBOX+CBW/10,CBOY+CBH*0.07);

    text('y',CBOX+CBW*0.32,CBOY+CBH*0.07);

    text('v',CBOX+CBW/10,CBOY+0.55*CBH);

    text('θ',CBOX+CBW*0.32,CBOY+0.55*CBH);

    rect(CBOX + 0.5*CBW, CBOY+ CBH/4, CBW/6, CBW/6);
    rect(CBOX + 0.76*CBW, CBOY+ CBH/4, CBW/6, CBW/6);


    
    textAlign(CENTER, CENTER);

    textSize(metersInPixels*2);

    if (particles.length >= 2){
      fill(50);
    } else {
      fill(250);
    }

    text('+',CBOX + 0.5*CBW +  CBW/12 , CBOY+ CBH/4 +  CBW/12);

    if (!paused){
      fill(50);
    } else {
      fill(250);
    }

    text('⇩',CBOX + 0.76*CBW +  CBW/12 , CBOY+ CBH/4 +  CBW/12);

    }
}

function drawMenuRemaining(){

  fill(255);
  textSize(metersInPixels/1.5);

  textAlign(LEFT, TOP);

  const Cap = 2;
  

  if (isLandscape()) {
    // draw menu on the right getSide()
    //line(sceneWidth, 0, sceneWidth, height);
    text((Cap-particles.length),width-menuWidth,4*menuWidth);
  } else {
    text((Cap-particles.length),4*menuHeight,height-menuHeight);
    }

}


let DispX, DispY;

function drawAngular(){

  let CircR = min(sceneHeight,sceneWidth)/4;

  CircOX = CBOX+CBW + CircR/2;
  CircOY = CBOY + CBH/2;

  

  if (VarInput == 'Th' && Listening){
    fill('rgba(150,150,150,0.5)');
    ellipse(CircOX,CircOY,CircR);


    fill('rgba(0,255,0,0.6)');

    arc(CircOX,CircOY,CircR,CircR,-1*PlAngl*PI/180,0);

    DispX = mouseX - CircOX;
    DispY = - mouseY + CircOY;

    PlAngl = round(CToDeg(DispX,DispY),1);

    fill('rgba(255,255,0,0.6)');


    

  }

}


function drawVel(){

  for (let i = 0; i < particles.length; i++) {

    let PVX = particles[i].vx * metersInPixels/4 + particles[i].x;
    let PVY = particles[i].vy * metersInPixels/4 + particles[i].y;

    let LX = particles[i].x;
    let LY = particles[i].y;
    drawVector(LX, LY, PVX, PVY);
  }
  


}

function drawDynValues(ParX,ParY,ParV,ParTh){

  if (!movingmenu){
    textSize(metersInPixels/1.2);
    fill(0);
    textAlign(LEFT, TOP);

    if (VarInput == 'x'){
      fill(77,164,34);
      if (Listening){
        fill(200,0,0);}
      } else {
        fill(0);
      }
    



    text(ParX.toString(),CBOX+CBW/50,CBOY+CBH/5);

    if (VarInput == 'y'){
      fill(77,164,34);
      if (Listening){
        fill(200,0,0);
      }
    } else {
        fill(0);
      }
    

    text(ParY.toString(),CBOX+CBW/4,CBOY+CBH/5);

    if (VarInput == 'v'){
      fill(77,164,34);
      if (Listening){
        fill(200,0,0);
      }} else {
        fill(0);
      }
    

    text(ParV.toString(),CBOX+CBW/50,CBOY+0.7*CBH);

    if (VarInput == 'Th'){
      fill(77,164,34);
      if (Listening){
        fill(200,0,0);
      }} else {
        fill(0);
      }
    

    text(ParTh.toString(),CBOX+CBW/4,CBOY+0.7*CBH);

  }
}


function CToDeg(vX,vY){ // 0 to 360 Degrees!

    vMod = sqrt(vX*vX + vY*vY);

    if (vMod == 0){
    return 0;
    }else{

    if (vX <= 0 && vY <= 0){
      Angle = Pi + atan(vY/vX);
    }

    if (vX >= 0 && vY >= 0){
      Angle = atan(vY/vX);
    }

    if (vX <= 0 && vY >= 0){
      Angle = acos(vX/vMod);
    }

    if (vX >= 0 && vY <= 0){
      Angle = asin(vY/vMod);
    }



    return Angle / RadAng;
    

  }
}


function CToV(vX,vY){

  vMod = sqrt(vX*vX + vY*vY);

  return vMod;

}

function DegToX(v,Th){

    Ang = Th / 180 * Pi;

    return v*cos(Ang);
}

function DegToY(v,Th){

  Ang = Th / 180 * Pi;

  return -1*v*sin(Ang);
}


function drawPaws(){

    if (paused){

	    fill('rgba(0,0,0,0.2)');

	    if (isLandscape()){
	    textAlign(LEFT, TOP);

      textSize(metersInPixels*8);
	    text('Paused',0,0);

	    }else{ 
	    textAlign(LEFT, BOTTOM);

	    text('Paused',0,sceneHeight);
	    }

    }
}


function drawVector(x1, y1, x2, y2){
  push();
  stroke(0);
  let theta = PI/6;
  translate(x1, y1);
  let angle = atan2(y2 - y1, x2 - x1);
  rotate(angle);
  let L = Math.sqrt((x1-x2)*(x1-x2) + (y1 - y2) * (y1-y2));
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
  let angle = PI/4;
  push();
  translate(x, y);
  rotate(angle);
  fill(255);
  stroke(255);
  strokeWeight(l/10);
  rect(-l/2, -l/2, l * 3/2, l);
  noFill();
  rect(-l, -l/2, l/2, l);
  pop();
}

function drawPlayPause(x, y, l){
  push();
  translate(x, y);
  fill(255);
  stroke(255);
  if (paused){
    triangle(-l/2, -l/2, -l/2, l/2, l/2, 0);
  } else {
    rect(-l/2, -l/2, l, l);
  }
  pop();
}

function drawX(x, y, l){
  push();
  stroke(255);
  strokeWeight(10);
  translate(x, y);
  line(-l/2, -l/2, l/2, l/2);
  line(l/2, -l/2, -l/2, l/2);
  pop();
}

// ########################
// #                      #
// #   Helper Functions   #
// #                      #
// ########################


function isBoardWide(){

  if (isLandscape()){
    return BoGY*(width-menuWidth) >=  BoGX*height; 
  } else {
    return BoGY*(width) >=  BoGX*(height-menuHeight);
  }  
}

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
  let item = -1;
  if (isMouseInMenu()){
    if (isLandscape()){
      item = Math.floor(mouseY/getSide());
    } else {
      item = Math.floor(mouseX/getSide());
    }
  }

  if (item < 7){
    item = 4;
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

function isMouseInCreate(){
  return ((mouseX > CBOX + 0.5*CBW) && (mouseX < CBOX + 0.5*CBW + CBW/5) && (mouseY > CBOY+ CBH/4) && (mouseY < CBOY+ CBH/4 + CBW/5))
}

function isMouseInSave(){
  return ((mouseX > CBOX + 0.76*CBW) && (mouseX < CBOX + 0.76*CBW + CBW/5) && (mouseY > CBOY+ CBH/4) && (mouseY < CBOY+ CBH/4 + CBW/5))
}


/*
function MouseInDyn(){


    if(){

	return 'x';
    } else if() {

	return 'y';

    } else if() {

	return 'v';

    } else if() {

	return 'th';

    }else{
	return '';

} */

function isMouseBusy(){
  return (isMouseInCreate() || isMouseInSave() || isMouseInMenu() || isMouseInGrabber());
}

function isMouseInGrabber(){
  return   ((mouseX > CBOX+CBW-35) && (mouseX < CBOX+CBW) && (mouseY > CBOY) && (mouseY < CBOY + 35));
}


// ##############
// #            #
// #   EVENTS   #
// #            #
// ##############

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  for (let i = 0; i < particles.length; i++) {
    particles[i].x *= sceneWidth / oldSceneWidth;
    particles[i].y *= sceneHeight / oldSceneHeight;
    particles[i].vx *= sceneWidth / oldSceneWidth;
    particles[i].vy *= sceneHeight / oldSceneHeight;
    particles[i].r *= sceneWidth / oldSceneWidth;
    // Math.sqrt(sceneWidth*sceneHeight / (oldSceneWidth * oldSceneHeight));
  }
  oldWidth = width;
  oldHeight = height;
  oldSceneWidth = sceneWidth;
  oldSceneHeight = sceneHeight;
}

function CreateObject(){

  vX = DegToX(PlVelo,PlAngl);
  vY = DegToY(PlVelo,PlAngl);

  let PixX = PlX / METER_RATIO;
  let PixY = PlY / METER_RATIO;

  particles.push({
    x: PixX+OriginX,
    y: PixY+OriginY,
    r: SphCM / METER_RATIO,
    mass: 1,
    charge: 0,
    vx: vX,
    vy: vY
  });

  print(OriginX);
}

function SaveParts() {

  for (let i = 0; i < particles.length; i++) {
    particles[i].x = particles[i].x * METER_RATIO;
    particles[i].y = particles[i].y * METER_RATIO;
    particles[i].vx = particles[i].vx * METER_RATIO;
    particles[i].vy = particles[i].vy * METER_RATIO ;
    particles[i].r = particles[i].r * METER_RATIO;
    particles[i].v = CToV(particles[i].vx,particles[i].vy);
    particles[i].Th = CToDeg(particles[i].vx,particles[i].vy);
  }
  saveJSON(particles, ('ParticleStates@'+day()+'-'+hour()+'_'+minute()+'_'+second()+'.json'));

  for (let i = 0; i < particles.length; i++) {
    particles[i].x = particles[i].x / METER_RATIO;
    particles[i].y = particles[i].y / METER_RATIO;
    particles[i].vx = particles[i].vx / METER_RATIO;
    particles[i].vy = particles[i].vy / METER_RATIO;
    particles[i].r = particles[i].r / METER_RATIO;

  }

}


function mousePressed() {
  if (VarInput == 'Th' && Listening){
    Listening = false;
  } else if (!Listening){
    if (isMouseInCreate()){
      if (particles.length < 2){
          CreateObject();
      }else{
        print('No more!');
      }
    } else if (isMouseInSave() && paused){
      
      SaveParts();
      
      
    } else if (isMouseInGrabber() && !movingmenu) {

        if (originalbox){
          OrigX = mouseX;
          OrigY = mouseY;
          originalbox = false;
        }
        movingmenu = true;
        print('Attempting to Move Infobox!', CBOX, CBOY)
    } else if (movingmenu){
      
      DX = mouseX - OrigX;
      DY = mouseY - OrigY;

      movingmenu = false;
      print('Moved Menu!', DX, DY);


    } else if (PARTICLE_MODES.includes(drawingMode) && (particles.length < 2)) {
      let r = SphCM / METER_RATIO;
      let mass = 1;
      let charge = 0.1;
      let vx;
      let vy;

      vx = DegToX(PlVelo,PlAngl);
      vy = DegToY(PlVelo,PlAngl);
      
      print('Drawing Particle with speeds,',vx, vy)

      if (BIG_PARTICLES.includes(drawingMode)) {
        mass *= 1;
      }


      if (NEGATIVE_PARTICLES.includes(drawingMode)) {
        charge *= -1;
      }

      if (drawingMode == BIG_NEUTRAL_PARTICLE_MODE ) {
        charge = 0;

      }

      if (drawingMode == NEUTRAL_PARTICLE_MODE) {
        charge = 0;

      }
      

      if (!isMouseBusy() && !movingmenu){
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


    if (isMouseInMenu()){
    let item = getSelectedItem();
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
}
}


let Listening = false;
let ListenedValue = '';

function keyPressed(){

  if (key === 'X'){
   VarInput = 'x';
   Listening = true;
   paused = true;
  } 
  
  if (key === 'Y'){
   VarInput = 'y';
   Listening = true;
   paused = true;
  } 
  
  if (key === 'V'){
   VarInput = 'v';
   Listening = true;
   paused = true;
  }
  
  if (key === 'T'){
  VarInput = 'Th';
  Listening = true;
  paused = true;
  }

  if (key === 'S'){
    SaveParts();
    VarInput = '';
  }

  if (key === ' '){
    if (paused){
      paused = false;
    } else {
      paused = true;
    }
  }

  if (keyCode === 13 && !Listening){
    if (particles.length < 2){
        CreateObject();
    }else{
      print('No more!');
    }
  }

  if (keyCode === 27){
    DX = 0;
    DY = 0;
  }


  if (keyCode === 8 && !Listening){
    particles.splice(-1);
  }


  if (!VarInput == ''&&(key >= '0' && key <= '9') || (keyCode === 189) || (keyCode === 190) || (keyCode === 109) || (keyCode === 110)) {
    print('Typing number!', key);
    Listening = true;
    paused = true;

    if (keyCode === 190 || keyCode === 110){
      ListenedValue += '.';}

    else if (keyCode === 189 || keyCode === 109){
        ListenedValue += '-';}

    else {
    ListenedValue += key;
    }
  }

  if (Listening){

    if (keyCode === 8){
      ListenedValue = ListenedValue.substring(0, ListenedValue.length - 1);
    }

    if (keyCode === 27){
       ListenedValue = '0';
       Listening = false;
        }

  let InputValue = 0;

  if (!ListenedValue == ''){
     InputValue = parseFloat(ListenedValue);
  }

  if (VarInput == 'x'){
      PlX = InputValue;
    }

    else if (VarInput == 'y'){
      PlY = InputValue;
    }

    else if (VarInput == 'v'){
      PlVelo = InputValue;
    }

    else if (VarInput == 'Th'){
      PlAngl = InputValue;
    }
  

  if (keyCode === 13){
  Listening = false;
  ListenedValue = '';
  }
 }

}