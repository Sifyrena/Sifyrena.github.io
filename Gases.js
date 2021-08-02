// NOT USEFUL FOR THIS DEMO

const SphCM = 2.00;
const aCM = 1.90;
const HoleDiamCM = 0.15;

const BoGX = 25;
const BoGY = 20;

const BoSIX = BoGX * aCM

// TIMESTEP 

let dt = 1;

let Gravity = 0;

let HideA = false;
let HideB = false;

// TWO SPECIES GAS DYNAMICS
const m1 = 1;
const m2 = 16;
const r1 = 10;
const r2 = 40;

const c1 = 'rgba(0, 176, 218, 0.95)';
const c2 = 'rgba(196, 130, 14, 0.95)';
const cH = 'rgba(0, 0, 0, 0.)'; // Hidden Particle Color

const CountPerFig = 6;
let Fi = 0;

// Manual Binning of Data

// Overview of plan: 
const vMax = 50;
const NBins = 25;
let BIN_WIDTH = vMax/NBins;

let VData1 = math.zeros(NBins);
let VData2 = math.zeros(NBins);

const VeloRange = math.multiply(math.range(0,NBins,false),BIN_WIDTH);


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
  paper_bgcolor: 'rgba(1,1,1,0)',
  plot_bgcolor: 'rgba(255,255,255,.6)', 
  autosize: false,
  width: 800,
  height: 600,
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
        text: 'Fraction Population',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#000000'
        }
      },
      range: [0,1],
      fixedrange: true,
    }

};




function drawScene(){
  background('rgba(195,120,10,0');
  drawTrailB(); // Brownian Trail

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

    } else {

      if (HideB){
        c = cH;
      } else { c = color(c2);
        drawParticle(particles[i].x, particles[i].y, particles[i].r, c);}
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
          opacity: 0.6,
          marker: {
            color: c1,
          },
        };

        var trace2 = {
          x: VeloRange.toArray(),
          y: VData2.toArray(),
          name: 'Gas 2',
          type: "bar",
          opacity: 0.6,
          marker: {
            color: c2,
          },
        };
      

        Plotly.newPlot('Fig',[trace1,trace2],layout);
      }

    } else {
      Plotly.purge('Fig');
    }

  }

  strokeWeight(Math.max(menuWidth, menuHeight)/150);
  stroke(0);
  fill(0);

  if (!isMouseInMenu() && (drawingMode == 0 || drawingMode == 3)){
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
        c = 'rgba(125, 125, 125, 0.5)';
      } else if (drawingMode === BIG_NEGATIVE_PARTICLE_MODE){
        radius *= 2;
        c = 'rgba(255, 0, 0, 0.5)';
      }

      drawParticle(mouseX, mouseY, radius, color(c));
    }

    else if (drawingMode == VECTOR_MODE && mouseHasBeenPressed){
      stroke(125);
      drawVector(tailX, tailY, mouseX, mouseY);
    } else if (drawingMode == ERASOR_MODE && mouseIsPressed){
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
  (x, y, s) => drawStill(x + s / 2, y + s / 2, s / 8, color(c1)),
  (x, y, s) => drawNormal(x + s / 2, y + s / 2, s / 8, color(c1)),
  (x, y, s) => drawFast(x + s / 2, y + s / 2, s / 8, color(c1)),
  (x, y, s) => draw20(x + s / 2, y + s / 2, s / 8, color(c1)),
  (x, y, s) => drawNormal(x + s / 2, y + s / 2, s / 4, color(c2)),
  (x, y, s) => drawFast(x + s / 2, y + s / 2, s / 4, color(c2)),
  (x, y, s) => drawT(x + s/2, y + s/2 ,1,1),
  (x, y, s) => drawG(x + s/2, y + s/2, s/7),
  (x, y, s) => drawPlayPause(x + s/2, y + s/2, s/2),
  (x, y, s) => drawX(x + s/2, y + s/2, s/2),
];

let CharaScale;

function drawStill(x,y,s,c){

  fill(255,255,255);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels/1.5);

  textAlign(LEFT,BOTTOM);

  if (HideA){
  text('🧐',x-CharaScale/2+5,y+CharaScale/2-5);
  } else {
  text('😑',x-CharaScale/2+5,y+CharaScale/2-5);
  }

  drawParticle(x, y, s, c);

}

function draw20(x,y,s,c){

  fill(255,255,255);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels/1.5);

  textAlign(LEFT,BOTTOM);


  text('x20',x-CharaScale/2+5,y+CharaScale/2-5);

  drawParticle(x, y, s, c);

}

let XLog = [];
let YLog = [];
let ti = 0;


function drawTrailB(){

  const TrailMaxRad = 0.085;
  let FirstTraced = false;

    if (!paused){
	    ti+= 1;
      for (let i = 0; i < particles.length; i++) {

          
          if (particles[i].Species === 'B' && !FirstTraced){
            if (ti%2 == 0){
            FirstTraced = true;
            ti = 0;
                  XLog.push(particles[i].x);
                  YLog.push(particles[i].y);
            }
          }
      }

      if (XLog.length >= LogCap){
        XLog = XLog.slice(0);
        YLog = YLog.slice(0);
      }

      for (let i = 0; i < XLog.length; i++){
        noStroke();

        fill('rgba(0,0,0,'+i/XLog.length+')');
      
        let TrRad = TrailMaxRad*(i/XLog.length);
        ellipse(XLog[i],YLog[i],metersInPixels*TrRad*SphCM);
      }
  }

}


function drawNormal(x,y,s,c){

  fill(255,255,0);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels/1.5);

  textAlign(LEFT,BOTTOM);


  text('▶️',x-CharaScale/2+5,y+CharaScale/2-5);

  drawParticle(x, y, s, c);

}

function drawT(x,y,s,c){

  fill(255,255,255);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels);

  textAlign(CENTER,CENTER);


  text('📈',x,y);

}


function drawG(x,y,s,c){

  fill(255,255,255);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels);

  textAlign(CENTER,CENTER);

  if (Gravity === 0){
    text('↡',x,y);
  } else {
    text('◉',x,y);
  }


}

function drawFast(x,y,s,c){

  fill(0,255,0);
  stroke(0);
  strokeWeight(0);
  textSize(metersInPixels/1.5);

  textAlign(LEFT,BOTTOM);


  text('⏩',x-CharaScale/2+5,y+CharaScale/2-5);

  drawParticle(x, y, s, c);

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

const LogCap = 1200;

function PrepareV(){ // Do sorting and binning in one function? Do we need sorting at all?

  //


  LocalVData1 = math.multiply(VData1,0);
  LocalVData2 = math.multiply(VData2,0);

  let CountA = 0;
  let CountB = 0;
  for (let i = 0; i < particles.length; i++) {


    let parV = CToV(particles[i].vx,particles[i].vy);

    let Answer = Math.floor(parV/BIN_WIDTH);

    if (Answer >= NBins){
      Answer = NBins-1;
    }

    
    if (particles[i].Species === 'A'){

      CountA += 1;

      LocalVData1.subset(math.index(Answer), (LocalVData1.subset(math.index(Answer))+1 ));

    } else {

      CountB += 1;
      LocalVData2.subset(math.index(Answer), (LocalVData2.subset(math.index(Answer))+1 ));
    
      }

  }


  if (CountA > 0){
    LocalVData1 = math.multiply(LocalVData1,1/CountA);
  }

  if (CountB > 0){
    LocalVData2 = math.multiply(LocalVData2,1/CountB);
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
    let item = getSelectedItem();
      if (item > -1){
        if (item === PLAY_PAUSE_MODE){
          paused = !paused;
        } else if (item === 0){
          HideA = !HideA;

        } else if (item === 3){
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
            print('Created particle #',i)

          }
  
        } else if (item === VECTOR_MODE){
          ShowPlot = !ShowPlot;
          Fi = CountPerFig - 1;

        } else if (item === ERASOR_MODE){

          if (Gravity === 0){
            Gravity = 0.1;} else {
              Gravity = 0;
            }
        
        } else if (item === DELETE_ALL){
          particles = [];
          vectors = [];
          VData1 = math.multiply(VData1,0);
          VData2 = math.multiply(VData2,0);
          V2Log = [];
          V1Log = [];
          XLog = [];
          YLog = [];
        } else {
          drawingMode = item;
        }
      }
    }

  print('DRAWING', drawingMode);

  if (PARTICLE_MODES.includes(drawingMode)) {
    let r = r1;
    let mass = m1;
    let charge = 0.;
    let vx = 3;
    let vy = -3;
    let Species = 'A';

    print('adding particle, speed,',vx, vy)

    if (BIG_PARTICLES.includes(drawingMode)) {
      mass = m2;
      r = r2;
      Species = 'B';
    }

    if (drawingMode == 5 || drawingMode == 2){
      vx = 6;
      vy = -6;
    }

    if (isMouseInMenu() && drawingMode < 6 && (!drawingMode == 0 || !drawingMode == 3)){

      paused = false;

      if (Species === 'A'){
        particles.push({
          x: 100,
          y: sceneHeight - 100,
          r: r,
          mass: mass,
          charge: charge,
          vx: vx,
          vy: vy,
          Species: Species,
        });
      } else {
          particles.push({
            x: sceneWidth - 100,
            y: sceneHeight - 100,
            r: r,
            mass: mass,
            charge: charge,
            vx: -vx,
            vy: vy,
            Species: Species,
          });

      }

      drawingMode = -1;
    
    } 
    
    if (!isMouseInMenu() && (drawingMode == 0 || drawingMode == 3)){
      particles.push({
        x: mouseX,
        y: mouseY,
        r: r,
        mass: mass,
        charge: charge,
        vx: 0,
        vy: 0,
        Species: Species,
      });
    
    }

  }



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
