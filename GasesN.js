// NOT USEFUL FOR THIS DEMO

const SphCM = 2.00;
const aCM = 1.90;
const HoleDiamCM = 0.15;

const BoGX = 25;
const BoGY = 20;

const BoSIX = BoGX * aCM

let mouseIsPressed = false;

// TIMESTEP 

let dt = 1;

let Gravity = 0;

let HideA = false;
let HideB = false;

// TWO SPECIES GAS DYNAMICS
const m1 = 1;
const m2 = 16;
const m3 = 100;

const r1 = 10;
const r2 = 40;
const r3 = 40;

const c1 = 'rgba(0, 176, 218, 0.95)';
const c2 = 'rgba(196, 130, 14, 0.95)';
const c3 = 'rgba(10,56,33,0.95)'

const ALLOWED_GASES = ['A','B','C'];

const c1P = 'rgbs(76,199,229,1)';
const c2P = 'rgbs(255,188,15,1)';

const cH = 'rgba(0, 0, 0, 0.)'; // Hidden Particle Color

const CountPerFig = 6;
let Fi = 0;

// Manual Binning of Data

// Overview of plan: 
let vMax = 40;
let NBins = 40;
let BIN_WIDTH = vMax/NBins;

let VeloRange = math.multiply(math.range(0,NBins,false),BIN_WIDTH);

const BIN_UPDATE_TRIGGER = 120;

let Count_Plus = 0;
let Count_Minus = 0;

let VData1 = math.zeros(NBins);
let VData2 = math.zeros(NBins);

let DrawTrail = false;

// Original

const k = 9*(Math.pow(10, 9));
const e = 2.718281828;
const Pi = 3.14159265358;
const RadAng = Pi/180;

let METER_RATIO; // PlaceHolder Value. Will be updated by draw. centimetres per pixel.

const NUM_SECTIONS = 10;
const MENU_RATIO = NUM_SECTIONS;
let particles = [];
let vectors = [];

let paused = true;

let menuHeight, menuWidth; //  menu dimensions
let sceneHeight, sceneWidth; //  scene dimensions
let oldSceneWidth, oldSceneHeight; // old scene dimensions
let oldWidth, oldHeight; //  old canvas dimensions

let CBOX, CBOY, CBW, CBH ; // Infobox Size

let metersInPixels;
let drawingMode = -1;

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

let CanvasScale;
let CanvasScaleD = 0.6;


function setGradient(c1, c2) {
  // noprotect
  noFill();
  for (var y = 0; y < height; y++) {
    var inter = map(y, 0, height, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function setup() {

  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.parent("Sim");

  oldWidth = width;
  oldHeight = height;

  if (isLandscape()) {
    menuHeight = height;
    menuWidth = height/MENU_RATIO;
    oldSceneWidth = width;
    oldSceneHeight = height;
  } else {
    menuWidth = width;
    menuHeight = width/MENU_RATIO;
    oldSceneWidth = width;
    oldSceneHeight = height;
  }

} 

function draw() {
  if (isLandscape()) {
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
  metersInPixels = BoSIX;

  METER_RATIO = metersInPixels / sceneWidth;

  if (!paused){
    updateG(dt, particles, vectors, sceneWidth, sceneHeight,Gravity);
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

var layout = {
  barmode: 'overlay',
  xaxis: {range: [0, vMax]},
  yaxis: {range: [0, 40]},  
  paper_bgcolor: 'rgba(207,221,199,0.5)',
  plot_bgcolor: 'rgba(220,220,224,.88)', 
  autosize: false,
  width: 0.60*sceneWidth,
  height: 0.80*sceneWidth,
    xaxis: {
      title: {
        text: 'Speed (arbitrary units)',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#000000'
        }
      },
    },
    yaxis: {
      title: {
        text: 'Fraction of Population',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#000000'
        }
      },
      fixedrange: false,
    }

};

// Vertical Strata 
var Fr = 105;
var Fg = 155;
var Fb = 255;
var Fa = 0;


var config = {responsive: true}

const Strata = 6;

function drawScene(){
  background('rgba(195,120,10,0');


  if (!Gravity == 0){
    setGradient(color(0, 0, 0), color(100, 100, 100));

    let VCount = [];

    noStroke();

    if (CountA > 0){

      for (let i = 0; i < Strata; i++){

        VCount.push(0);

        }


      for (let j = 0; j < particles.length; j++){

        if (particles[j].Species === 'A'){

          HeightStrat = Math.round(particles[j].y/sceneHeight*Strata-0.5);

          VCount[HeightStrat] += 1;

        }
        
      }


      for (let i = 0; i < Strata; i++){

        Fa = Math.pow((VCount[i]/CountA),0.5);

        fill('rgba('+ Fr+','+Fg +','+Fb +','+Fa +')');

        rect(0,sceneHeight/Strata*i,sceneWidth,sceneHeight/Strata);
      }
    }
  }

  if (DrawTrail){drawTrailC(); }
  // Brownian Trail

  for (let i = 0; i < vectors.length; i++){
    stroke(0);
  }

  for (let i = 0; i < particles.length; i++){
    let c;
    if (particles[i].Species == 'A'){

      if (HideA){
        c = cH;
      } else { c = color(c1);
        drawParticle(particles[i].x, particles[i].y, particles[i].r, c);}

    } else if (particles[i].Species == 'B'){

        c = color(c2);
        drawParticle(particles[i].x, particles[i].y, particles[i].r, c);
    } else if (particles[i].Species == 'C'){

      c = color(c3);
      drawParticle(particles[i].x, particles[i].y, particles[i].r, c);
  }

  }

  stroke(0);
  strokeWeight(Math.max(menuWidth, menuHeight)/150);
  stroke(0);
  fill(0);
  drawMenu();
  drawPaws();
  //drawVel();


  if (!paused){
    drawTimeScale();
    PrepareV();
  
    // This is how you modify values! 
    // VData1.subset(math.index(2), (VData1.subset(math.index(2))+1 ));

    // VData1.subset(math.index(7), (VData1.subset(math.index(7))+0.1 ));

    // Plotly Stuff Version 2: Manual Histogram

    if (ShowPlot){
      
      Fi += 1;

      if (Fi == CountPerFig){
        
        Fi = 0;

        var trace1 = {
          x: VeloRange.toArray(),
          y: VData1.toArray(),
          name: 'Gas 1',
          type: "bar",
          opacity: 0.87,
          marker: {
            color: c1P,
          },
        };

        var trace2 = {
          x: VeloRange.toArray(),
          y: VData2.toArray(),
          name: 'Gas 2',
          type: "bar",
          opacity: 0.7,
          marker: {
            color: c2P,
          },
        };
      

        Plotly.newPlot('Fig',[trace1,trace2],layout, config);
      }

    } else {
      Plotly.purge('Fig');
    }

  }

  strokeWeight(Math.max(menuWidth, menuHeight)/150);
  stroke(0);
  fill(0);

}

let MenuItemDrawingFunctions = [
  (x, y, s) => drawStill(x + s / 2, y + s / 2, s / 8, color(c1)),
  (x, y, s) => draw20(x + s / 2, y + s / 2, s / 8, color(c1)),
  (x, y, s) => drawTogTrail(x + s / 2, y + s / 2, s / 8, color(c1)),
  (x, y, s) => drawErasor(x + s / 2, y + s / 2, s / 4),
  (x, y, s) => drawNormal(x + s / 2, y + s / 2, s / 4, color(c2)),
  (x, y, s) => drawNormal(x + s / 2, y + s / 2, s / 4, color(c3)),
  (x, y, s) => drawT(x + s/2, y + s/2 ,1,1),
  (x, y, s) => drawG(x + s/2, y + s/2, s/7),
  (x, y, s) => drawPlayPause(x + s/2, y + s/2, s/2),
  (x, y, s) => drawX(x + s/2, y + s/2, s/2),
];

let CharaScale;

function drawTogTrail(x,y,s,c){


  fill(255,255,255);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels/2);
  textAlign(CENTER,CENTER);

  text('TRAIL',x,y);


    fill(255,255,255);
    stroke(0);
    strokeWeight(0);
    textSize(metersInPixels/2);
  
    textAlign(LEFT,BOTTOM);

    if (!DrawTrail){
    text('......',x-CharaScale/2+5,y+CharaScale/2-5);
    } else {
    fill(255,190,150)
    text('..x..',x-CharaScale/2+5,y+CharaScale/2-5);
    }
  
    
  

}



function drawStill(x,y,s,c){

  fill(255,255,255);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels/2);

  textAlign(LEFT,BOTTOM);

  if (HideA){
  text('SHOW',x-CharaScale/2+5,y+CharaScale/2-5);
  } else {
  text('HIDE',x-CharaScale/2+5,y+CharaScale/2-5);
  }

  drawParticle(x, y, s, c);

}

function draw20(x,y,s,c){

  fill(255,255,255);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels/1.5);

  textAlign(LEFT,BOTTOM);


  text('+20',x-CharaScale/2+5,y+CharaScale/2-5);

  drawParticle(x, y, s, c);

}


function drawNormal(x,y,s,c){

  fill(255);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels/1.5);

  textAlign(LEFT,BOTTOM);


  text('+',x-CharaScale/2+5,y+CharaScale/2-5);

  drawParticle(x, y, s, c);

}

function drawT(x,y,s,c){

  fill(255,255,255);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels/2);
  textAlign(CENTER,CENTER);

  text('CHART',x,y);

}


function drawG(x,y,s,c){

  fill(255,255,255);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels);

  textAlign(CENTER,CENTER);

  if (Gravity === 0){
    text('g↡',x,y);
  } else {
    text('◉',x,y);
  }


}

function drawFast(x,y,s,c){

  fill(255);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels/1.5);

  textAlign(LEFT,BOTTOM);


  text('+',x-CharaScale/2+5,y+CharaScale/2-5);

  drawParticle(x, y, s, c);
}


let XLog = [];
let YLog = [];
let ti = 0;



const TrailMaxRad = 0.5;

function drawTrailB(){

  let a = 1;

}

const TrailLength = 500;

function drawTrailC(){

    if (!paused){
	    ti+= 1;
      for (let i = 0; i < particles.length; i++) {

          
          if ((particles[i].Species === 'C')||(particles[i].Species === 'B')){
            if (ti%2 == 0){
            ti = 0;
                  XLog.push(particles[i].x);
                  YLog.push(particles[i].y);
            }
          }

      }


      if (XLog.length >= TrailLength){
        XLog = XLog.slice(1);
        YLog = YLog.slice(1);
      }


        for (let i = 0; i < XLog.length; i++){
          noStroke();
          fill('rgba(0,0,20,'+i/XLog.length+')');

          ellipse(XLog[i],YLog[i],TrailMaxRad*r1);
        }
      
  }

}


function drawMenu(){
  if (isLandscape()) {
    // draw menu on the right getSide()
    //line(sceneWidth, 0, sceneWidth, height);
    fill(100);
    rect(sceneWidth, 0, menuWidth, menuHeight);

    for (let i = 0; i < NUM_SECTIONS+1; i++){
      stroke(0)
      line(sceneWidth, i * getSide(), width, i * getSide());
      if (i == drawingMode){
        fill(240, 240, 240);
        rect(sceneWidth,i * getSide() , menuWidth, getSide());
      }
    }

    for (let i = 0; i < NUM_SECTIONS; i++) {
      MenuItemDrawingFunctions[i](width - menuWidth, getSide() * i, getSide());
    }
    CharaScale = menuWidth;

  } else {
    //  draw the menu on the bottom
    //line(0, sceneHeight, width, sceneHeight);
    fill(100);

    rect(0, sceneHeight, menuWidth, menuHeight);

    line(sceneWidth, 0, sceneWidth, height);
    for (let i = 0; i < NUM_SECTIONS+1; i++){
      line(i * getSide() , sceneHeight, i * getSide(), height);
      if (i == drawingMode){
        fill(0, 255, 0);
        rect(i*getSide(), height - menuHeight, getSide(), menuHeight);
      }
    }

    for (let i = 0; i < NUM_SECTIONS; i++) {
      MenuItemDrawingFunctions[i](getSide() * i, height - menuHeight, getSide());
    }
    CharaScale = menuHeight;
  }
}

function drawTimeScale(){

    fill('rgba(30,30,30,0.92)');


    textSize(min(metersInPixels*2,sceneWidth/12));
    if (!paused){

      if (!abs(dt-1)<0.05){    
      
      textAlign(LEFT, TOP);
      text(dt.toString()+'⨉',metersInPixels,metersInPixels);}

  }
}

let ShowPlot = false;

let V1Log = [];
let V2Log = [];

const LogCap = 80;

let CountA = 0;
let CountB = 0;
let CountC = 0;

function PrepareV(){ // Do sorting and binning in one function? Do we need sorting at all?

  //

  LocalVData1 = math.multiply(VData1,0);
  LocalVData2 = math.multiply(VData2,0);

  CountA = 0;
  CountB = 0;
  CountC = 0;
  Count_Plus = 0;
	
  for (let i = 0; i < particles.length; i++) {


    let parV = CToV(particles[i].vx,particles[i].vy);

    let Answer = Math.floor(parV/BIN_WIDTH);
    
    if (particles[i].Species === 'A'){

      CountA += 1;

      if (Answer<NBins){
        LocalVData1.subset(math.index(Answer), (LocalVData1.subset(math.index(Answer))+1 ));
      } else {
        Count_Plus+=1;
      }

    } else if (particles[i].Species === 'B'){

      CountB += 1;

      if (Answer<NBins){
       LocalVData2.subset(math.index(Answer), (LocalVData2.subset(math.index(Answer))+1 ));
      }
    
      } else if (particles[i].Species === 'C'){

      CountC += 1;
      
      }

  }


  if (CountA > 0){
    LocalVData1 = math.multiply(LocalVData1,1/CountA);
  }

  if (CountB > 0){
    LocalVData2 = math.multiply(LocalVData2,1/CountB);
  }


  // ONLY CHECK SPECIES 1

  if (Count_Plus == BIN_UPDATE_TRIGGER){

    print('Triggered Bin Lengthening');
    Count_Plus = 0;
    Count_Minus = 0;

  } 

  if (Count_Minus >= BIN_UPDATE_TRIGGER){


    print('Triggered Bin Shortening');
    Count_Minus = 0;
    Count_Plus = 0;

  } 

  V1Log.push(LocalVData1);
  V2Log.push(LocalVData2);


  if (V1Log.length > LogCap){
      V1Log = V1Log.slice(0);
      V2Log = V2Log.slice(0);
  }

  VData1 = math.multiply(VData1,0);
  VData2 = math.multiply(VData2,0);

  for (let i = 0; i < V1Log.length; i++) {
    VData1 = math.add(VData1,V1Log[i]);
    VData2 = math.add(VData2,V2Log[i]);
  }

  VData1 = math.multiply(VData1,1/V1Log.length);
  VData2 = math.multiply(VData2,1/V1Log.length);


	/*
  if (VData1.subset(math.index(NBins-1)) < 0.001/CountA && VData1.subset(math.index(NBins-1)) > 0){
    Count_Minus += 1;
  }

  if (VData1.subset(math.index(NBins-1)) === 0){
    Count_Minus += 10;}
    */
  

}



function drawVel(){

  for (let i = 0; i < particles.length; i++) {

    let PVX = particles[i].vx * metersInPixels/20 + particles[i].x;
    let PVY = particles[i].vy * metersInPixels/20 + particles[i].y;

    let LX = particles[i].x;
    let LY = particles[i].y;
    drawVector(LX, LY, PVX, PVY);
  }
}

function drawConditionBar(){
    //  draw the menu on the Bottom Left

    fill('rgba(122,122,122, 0.35)');
    rect(CBOX,CBOY,CBW,CBH);

    fill(255);
    rect(CBOX+CBW/50,CBOY+CBH/5, CBW/5, CBH/4);

    rect(CBOX+CBW/4,CBOY+CBH/5, CBW/5,CBH/4);

    rect(CBOX+CBW/50,CBOY+0.7*CBH, CBW/5, CBH/4);

    rect(CBOX+CBW/4,CBOY+0.7*CBH, CBW/5, CBH/4);


    fill(0);

    textAlign(CENTER, CENTER);
    textSize(30);


    text('x',CBOX+CBW/10,CBOY+CBH*0.07);

    text('y',CBOX+CBW*0.32,CBOY+CBH*0.07);

    text('v',CBOX+CBW/10,CBOY+0.55*CBH);

    text('θ',CBOX+CBW*0.32,CBOY+0.55*CBH);

    rect(CBOX + 0.5*CBW, CBOY+ CBH/4, CBW/5, CBW/5);
    rect(CBOX + 0.76*CBW, CBOY+ CBH/4, CBW/5, CBW/5);


    fill(250);

    textAlign(LEFT, BOTTOM);

    textSize(18);
    text('CREATE',CBOX + 0.5*CBW , CBOY+ CBH/4+ CBW/5);
    text('SAVE',CBOX + 0.76*CBW, CBOY+ CBH/4 +CBW/5);

}

function drawDynValues(ParX,ParY,ParV,ParTh){

    textSize(42);
    fill(0);

    textAlign(LEFT, TOP);

    text(ParX.toString(),CBOX+CBW/50,CBOY+CBH/5);

    text(ParY.toString(),CBOX+CBW/4,CBOY+CBH/5);

    text(ParV.toString(),CBOX+CBW/50,CBOY+0.7*CBH);

    text(ParTh.toString(),CBOX+CBW/4,CBOY+0.7*CBH);

   // print('Dynamic Information Drawer is called,',ParX,ParY,ParV,ParTh);
}


function CToDeg(vX,vY){

    vMod = sqrt(vX*vX + vY*vY);

    if (vMod == 0){
    return 0;
    }else{

    Angle = acos(vX/vMod) / RadAng;
    return Angle;
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

  return v*sin(Ang);
}


function drawPaws(){

    if (paused){

	    fill('rgba(0,0,0,0.2)');

	    if (isLandscape()){
	    textAlign(LEFT, TOP);

	    textSize(150);
	    text('Paused',0,0);

	    }else{ 
	    textSize(100);
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
  fill(195);
  stroke(195);
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
  stroke(255,0,0);
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
  return item;
}

function isMouseInMenu(){
  if (isLandscape()){
    return (mouseX > width - menuWidth);
  } else {
    return (mouseY > height - menuHeight);
  }
}



// ##############
// #            #
// #   EVENTS   #
// #            #
// ##############

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);

  /*
  for (let i = 0; i < particles.length; i++) {
    particles[i].x *= sceneWidth / oldSceneWidth;
    particles[i].y *= sceneHeight / oldSceneHeight;
    particles[i].vx *= sceneWidth / oldSceneWidth;
    particles[i].vy *= sceneHeight / oldSceneHeight;
    particles[i].r *= sceneWidth / oldSceneWidth;
    // Math.sqrt(sceneWidth*sceneHeight / (oldSceneWidth * oldSceneHeight));
  }
  */
  oldWidth = width;
  oldHeight = height;
  oldSceneWidth = sceneWidth;
  oldSceneHeight = sceneHeight;
}

function mousePressed() {


  if (isMouseInMenu()){

    drawingMode = -1;

    let r = r1;
    let mass = m1;
    let charge = 0.;
    let vx = 3;
    let vy = -3;
    let Species = 'A';

    let item = getSelectedItem();


      if (item === 8){
        paused = !paused;
      } else if (item === 0){
        HideA = !HideA;

      } else if (item === 2){

        DrawTrail = !DrawTrail;
        if (!DrawTrail){
          XLog = [];
          YLog = [];
        }
      
      } else if (item ===3){
        
        mouseIsPressed = !mouseIsPressed;

        if (mouseIsPressed){
          print('Ready the eraser!');
          drawingMode = 3;
          print(drawingMode);
        }

      } else if (item === 4){

        r = r2;
        mass = m2;
        Species = 'B'

      } else if (item === 5){

        r = r3;
        mass = m3;
        Species = 'C';

        if (CountC === 0){
          DrawTrail = true;
        }

      } else if (item === 1){
          for (let i = 0; i < 20; i++){

            particles.push({
              x: sceneWidth*(random()),
              y: sceneHeight*(random()),
              r: r1,
              mass: m1,
              charge: 0,
              vx: 12*(0.5-random()),
              vy: 12*(0.5-random()),
              Species: 'A',
            });

          }

      } else if (item === 6){
        ShowPlot = !ShowPlot;
        Fi = CountPerFig - 1;

      } else if (item === 7){

        if (Gravity === 0){
          Gravity = 0.1;} else {
            Gravity = 0;
          }
      
      } else if (item === 9){
        particles = [];
        vectors = [];
        VData1 = math.multiply(VData1,0);
        VData2 = math.multiply(VData2,0);
        V2Log = [];
        V1Log = [];
        XLog = [];
        YLog = [];
      } 
  
      if (item === 1 || item === 4 || item ===5){
        paused = false;
        particles.push({
          x: sceneWidth/2,
          y: sceneHeight/2,
          r: r,
          mass: mass,
          charge: 0,
          vx: vx,
          vy: vy,
          Species: Species,
        });
      }
  }

  else {

    if (drawingMode === 3){

      for (let i = particles.length - 1; i >= 0; i--){
        if (Math.pow(particles[i].x - mouseX, 2) + Math.pow(particles[i].y - mouseY, 2)
          < 1.1*particles[i].r * particles[i].r){
          particles.splice(i, 1); 
          XLog = [];
          YLog = [];
        }
        print(mouseX,mouseY);

      }
    }
  }


  print('DM:',drawingMode)

}

function keyPressed(){

  if (key === ' '){
    paused = !paused;
  }

  if (key === 'a'){


    dt *= 2;


    if (abs(dt-1)<0.0005){
      dt = 1;
    }
}

  if (key === 'z'){

  
      dt /= 2;

      if (abs(dt-1)<0.0005){
        dt = 1;
      }
  
  }

  if (key === 'g'){

    if (Gravity === 0){
    Gravity = 0.1;} else {
      Gravity = 0;
    }


    
  }

  if (key === 't'){
    ShowPlot = !ShowPlot;
    Fi = CountPerFig - 1;
  }

print(key, dt);


}