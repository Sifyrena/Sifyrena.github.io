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

let AllowClickingCreate = false;

// Placement Helpers Specific to Task 1

let PlV1 = 3;
let PlA1 = 0;
let PlX1 = -5;
let PlY1 = 0;

let PlV2 = 3;
let PlA2 = 180;
let PlX2 = 5;
let PlY2 = 0;

let dt = 1;


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

let ReturnPoint = [[],[],[],[]];
let Dumped = false;

/*
const PlasticColor = color(255,0,0);
const PosChargeColor = color(229,184,73);
const NegChargeColor = color(15,59,192);
*/

// COULD HAVE DONE A LIST BUT I AM LAZY
const AngTol = 3;
const AngStep = 15;

// NUMBER OF PARTICLES ADMITTED ON BOARD
const Cap = 2;

const POSITIVE_PARTICLE_MODE = 0;
const NEUTRAL_PARTICLE_MODE = 1;
const NEGATIVE_PARTICLE_MODE = 2;
const BIG_POSITIVE_PARTICLE_MODE = 3;
const BIG_NEUTRAL_PARTICLE_MODE = 4;

// NO LONGER USED

const BIG_NEGATIVE_PARTICLE_MODE = 5;
const VECTOR_MODE = 6;


const RESET = 5;
const REVERSE = 6;
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

function updatex1() {
  var x = document.getElementById("x1").value;
  PlX1 = x;
}

function PlayPause() {
  paused = !paused;
}

function InitAll() {
  PlX1 = document.getElementById("x1").value;
  PlY1 = document.getElementById("y1").value;
  PlA1 = document.getElementById("a1").value;
  PlV1 = document.getElementById("v1").value;

  PlX2 = document.getElementById("x2").value;
  PlY2 = document.getElementById("y2").value;
  PlA2 = document.getElementById("a2").value;
  PlV2 = document.getElementById("v2").value;

  CreateBi();
}



function setup() {
  var cnv = createCanvas(window.innerWidth*0.8, window.innerWidth*0.8/19*13);
  cnv.parent("Simulator");

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

function CreateBi(){

  particles = [];
  particles.push({
    x: PlX1 / METER_RATIO+OriginX,
    y: -1*PlY1 / METER_RATIO+OriginY,
    r: SphCM / METER_RATIO,
    mass: 1,
    charge: 0,
    vx: PlV1*cos(PlA1*RadAng),
    vy: -1*PlV1*sin(PlA1*RadAng)
  });


  particles.push({
    x: PlX2 / METER_RATIO+OriginX,
    y: -1*PlY2 / METER_RATIO+OriginY,
    r: SphCM / METER_RATIO,
    mass: 1,
    charge: 0,
    vx: PlV2*cos(PlA2*RadAng),
    vy: -1*PlV2*sin(PlA2*RadAng)
 });


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

let Initialized = false;

function draw() {


  if (isLandscape()) {
    // draw menu on the right getSide()
    menuHeight = height;
    menuWidth = height / MENU_RATIO;

    if (!isBoardWide()){
	
	sceneWidth = width;
	sceneHeight = sceneWidth * BoGY/BoGX;

    }else{
	sceneHeight = height;
	sceneWidth = sceneHeight / BoGY*BoGX;
    }

    CBW = menuHeight/1.5;
    CBH = menuHeight/8;
  } else {
    menuWidth = width;
    menuHeight = width / MENU_RATIO;


    if (!isBoardWide()){
	
	sceneWidth = width
	sceneHeight = sceneWidth * BoGY/BoGX;

    }else{
	sceneHeight = height ;
	sceneWidth = sceneHeight / BoGY*BoGX;
    }
    CBW = menuWidth/1.5;
    CBH = menuWidth/8;


  }

  CBOX = 0 + DX;
  CBOY = sceneHeight - menuHeight/5 + DY;
  metersInPixels = BoSIX;

  METER_RATIO = metersInPixels / sceneWidth;

  OriginX = sceneWidth / 2;
  OriginY = sceneHeight / 2; 

  if (!Initialized){

  CreateBi();

  Initialized = true;

  }


  if (!paused){
    update(dt, particles, vectors, sceneWidth, sceneHeight);
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


  if (particles.length == Cap && !Dumped){

    print("Can save now!")
    Dumped = true;

    ReturnPoint = [[],[],[],[]];

    for (let i = 0; i < Cap; i++) {
      ReturnPoint[0].push(particles[i].x);
      ReturnPoint[1].push(particles[i].y);
      ReturnPoint[2].push(particles[i].vx);
      ReturnPoint[3].push(particles[i].vy);
    }
  }


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
  drawTrail();

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
  noStroke();
  //drawMenu();
  drawPaws();
  
  /* RELEGATED TO HTML
  drawConditionBar();


  //drawDynValues(PlX,PlY,PlVelo,PlAngl);
  drawDynValuesBi();

  drawAngular();


  drawVelSelect();
  */
  drawMeterScale();

  //strokeWeight(Math.max(menuWidth, menuHeight)/150);
  //stroke(0);
  fill(0);

  if (!isMouseInMenu()){
    if (PARTICLE_MODES.indexOf(drawingMode) != -1){
      let radius = 1/METER_RATIO;
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
      if (!Listening && !isMouseBusy() && !movingmenu && AllowClickingCreate){
      
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
      XLog = [];
      YLog = [];
      Dumped = false;
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
  (x, y, s) => drawToy(x + s/2, y + s/2, s/2),
  (x, y, s) => drawReset(x + s/2, y + s/2, s/2),
  (x, y, s) => drawReverse(x + s/2, y + s/2, s/2),
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
  strokeWeight(metersInPixels/15);

  stroke(0);
  line(x5, y5, x6, y6);

  stroke(120,114,32);
  line(OriginX-metersInPixels/6,OriginY,OriginX+metersInPixels/6,OriginY);
  line(OriginX,OriginY-metersInPixels/6,OriginX,OriginY+metersInPixels/6);
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
    rect(CBOX+CBW/50,CBOY+CBH/5, CBW/10, CBH/4);
    rect(CBOX+CBW/8,CBOY+CBH/5, CBW/10,CBH/4);
    rect(CBOX+CBW/50,CBOY+0.7*CBH, CBW/10, CBH/4);
    rect(CBOX+CBW/8,CBOY+0.7*CBH, CBW/10, CBH/4);

    rect(CBOX+CBW/50+CBW/4,CBOY+CBH/5, CBW/10, CBH/4);
    rect(CBOX+CBW/8+CBW/4,CBOY+CBH/5, CBW/10,CBH/4);
    rect(CBOX+CBW/50+CBW/4,CBOY+0.7*CBH, CBW/10, CBH/4);
    rect(CBOX+CBW/8+CBW/4,CBOY+0.7*CBH, CBW/10, CBH/4);


    fill(0);

    textAlign(CENTER, CENTER);
    textSize(metersInPixels/2);

    text('x1/cm',CBOX+CBW/15,CBOY+CBH*0.07);
    text('y1/cm',CBOX+CBW*0.17,CBOY+CBH*0.07);
    text('v1',CBOX+CBW/15,CBOY+0.55*CBH);
    text('θ1',CBOX+CBW*0.17,CBOY+0.55*CBH);

    text('x2/cm',CBOX+CBW/15+CBW/4,CBOY+CBH*0.07);
    text('y2/cm',CBOX+CBW*0.17+CBW/4,CBOY+CBH*0.07);
    text('v2',CBOX+CBW/15+CBW/4,CBOY+0.55*CBH);
    text('θ2',CBOX+CBW*0.17+CBW/4,CBOY+0.55*CBH);

    rect(CBOX + 0.5*CBW, CBOY+ CBH/4, CBW/8, CBW/8);
    rect(CBOX + 0.65*CBW, CBOY+ CBH/4, CBW/8, CBW/8);
    rect(CBOX + 0.8*CBW, CBOY+ CBH/4, CBW/8, CBW/8);

    
    textAlign(CENTER, CENTER);

    textSize(metersInPixels*1.5);

    fill(250);
    text('√',CBOX + 0.5*CBW +  CBW/16 , CBOY+ CBH/4 +  CBW/16);

    if (!paused){
      fill(50);
    } else {
      fill(250);
    }

    text('⇩',CBOX + 0.65*CBW +  CBW/16 , CBOY+ CBH/4 +  CBW/16);



    }
}

function drawDynValuesBi(){

  if (!movingmenu){
    textSize(metersInPixels/1.2);
    fill(0);
    textAlign(LEFT, TOP);

    if (VarInput == 'x1'){
      fill(77,164,34);
      if (Listening){
        fill(200,0,0);}
      } else {
        fill(0);
      }

    text(PlX1.toString(),CBOX+CBW/50,CBOY+CBH/5);

    if (VarInput == 'y1'){
      fill(77,164,34);
      if (Listening){
        fill(200,0,0);}
      } else {
        fill(0);
      }

    text(PlY1.toString(),CBOX+CBW/8,CBOY+CBH/5);

    if (VarInput == 'v1'){
      fill(77,164,34);
      if (Listening){
        fill(200,0,0);}
      } else {
        fill(0);
      }
    text(PlV1.toString(),CBOX+CBW/50,CBOY+0.7*CBH);

    if (VarInput == 'a1'){
      fill(77,164,34);
      if (Listening){
        fill(200,0,0);}
      } else {
        fill(0);
      }

    text(PlA1.toString(),CBOX+CBW/8,CBOY+0.7*CBH);

    if (VarInput == 'x2'){
      fill(77,164,34);
      if (Listening){
        fill(200,0,0);}
      } else {
        fill(0);
      }

    text(PlX2.toString(),CBOX+CBW/50+CBW/4,CBOY+CBH/5);

    if (VarInput == 'y2'){
      fill(77,164,34);
      if (Listening){
        fill(200,0,0);}
      } else {
        fill(0);
      }

    text(PlY2.toString(),CBOX+CBW/8+CBW/4,CBOY+CBH/5);

    if (VarInput == 'v2'){
      fill(77,164,34);
      if (Listening){
        fill(200,0,0);}
      } else {
        fill(0);
      }

    text(PlV2.toString(),CBOX+CBW/50+CBW/4,CBOY+0.7*CBH);

    if (VarInput == 'a2'){
      fill(77,164,34);
      if (Listening){
        fill(200,0,0);}
      } else {
        fill(0);
      }

    text(PlA2.toString(),CBOX+CBW/8+CBW/4,CBOY+0.7*CBH);

  }

}

let DispX, DispY;

function drawAngular(){

  let CircR = min(sceneHeight,sceneWidth)/3;

  CircOX = sceneWidth/2;
  CircOY = sceneHeight/2;

  

  if (VarInput == 'Th' && Listening){


    fill(0);
    textSize(metersInPixels);
    textAlign(CENTER,BOTTOM);
    text('Pick an angle. Click to Confirm.',sceneWidth/2,sceneHeight/3)

    fill('rgba(50,50,50,0.75)');
    ellipse(CircOX,CircOY,CircR);
   

    if (ListenedValue == ''){
    DispX = mouseX - CircOX;
    DispY = - mouseY + CircOY;

    PlAngl = round(CToDeg(DispX,DispY)*10)/10;



    if (PlAngl - (floor(PlAngl/AngStep))*AngStep<AngTol ){
      PlAngl = (floor(PlAngl/AngStep))*AngStep;
    }

    else if ((floor(PlAngl/AngStep)+1)*AngStep - PlAngl <AngTol){
      PlAngl = (floor(PlAngl/AngStep)+1)*AngStep;
    }

    } else {

    PlAngl = parseFloat(ListenedValue);
    }

    

    fill('rgba(255,255,0,0.6)');
    arc(CircOX,CircOY,CircR,CircR,-1*PlAngl*PI/180,0);
  }

}

const VCap = 10;
const Flipped = false;

function drawVelSelect(){

  if (VarInput == 'v' && Listening){

      
    fill(0);
    textSize(metersInPixels);
    textAlign(CENTER,BOTTOM);
    text('Pick a speed. Click to Confirm.',sceneWidth/2,sceneHeight/2)

    fill('rgba(50,50,50,0.75)');
    rect(sceneWidth/4,sceneHeight/2,sceneWidth/2,metersInPixels)


    if (ListenedValue == ''){
      if (mouseX<=sceneWidth/4){
        PlVelo = 0;
      } else if (mouseX>=3*sceneWidth/4){
        PlVelo = VCap;
      } else{
        
        PlVelo = round((mouseX - sceneWidth/4)/(sceneWidth/2)*VCap*100)/100;

      }
    } else {
      PlVelo = parseFloat(ListenedValue);}

    fill('rgba(240,240,0,1)');
    rect(sceneWidth/4,sceneHeight/2,PlVelo/VCap*sceneWidth/2,metersInPixels);

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

let XLog = [];
let YLog = [];

const GlobalTrailLength = 500;
let TrailLength = 180;

function drawTrail(){

  TrailLength = min(TrailLength,round(GlobalTrailLength/particles.length));


  if (particles == [] || particles.length >= 10){
    XLog = [];
    YLog = [];
    return;
  } else {

    if (!paused){
      for (let i = 0; i < particles.length; i++) {
        XLog.push(particles[i].x);
        YLog.push(particles[i].y);
      }
    }

    if (XLog.length >= TrailLength*particles.length){
      XLog = XLog.slice(-TrailLength*particles.length);
      YLog = YLog.slice(-TrailLength*particles.length);
    }

    for (let i = 0; i < XLog.length; i++)
    {
      noStroke();
      fill('rgba(5,8,9,'+i/TrailLength/particles.length+')')
      ellipse(XLog[i],YLog[i],metersInPixels*0.1*SphCM);
    }
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
      Angle = asin(vY/vMod) + 2*Pi;
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
      textSize(min(metersInPixels*5,sceneWidth/6));
      textAlign(LEFT, TOP);
      
	    text('|| Paused',metersInPixels,metersInPixels);


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

function drawToy(x,y,l){

  noStroke();
  fill(238,15,15);
  ellipse(x, y, l);

  textAlign(CENTER,CENTER);
  fill(255);

  textSize(metersInPixels*2);

  if (particles.length < Cap){
    text('+',x+l/4,y+l/4);
  }
  
  textSize(metersInPixels);

  textAlign(RIGHT,TOP);

  text((Cap-particles.length),x+l,y-l);

}


function drawSave(x,y,l){

  noStroke();
  fill(238,15,15);
  ellipse(x, y, l);

  textAlign(CENTER,CENTER);
  fill(255);

  textSize(metersInPixels*2);

  if (particles.length < Cap){
    text('+',x+l/4,y+l/4);
  }
  
  textSize(metersInPixels);

  textAlign(RIGHT,TOP);

  text((Cap-particles.length),x+l,y-l);

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


function drawReset(x,y,l){
  push();
  translate(x, y);
  if (Dumped){
  fill(255);
  stroke(255);} else{
  fill(122);
  stroke(122);

  }

  strokeWeight(metersInPixels/5);
  textSize(min(menuHeight,menuWidth)/1.2);
  textAlign(CENTER,CENTER);
  text('⟳',0,0);
  pop();
}

function drawReverse(x, y, l){
  push();
  translate(x, y);
  fill(255);
  stroke(255);
  triangle(l/2, -l/2, l/2, l/2, -l/2, 0);

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
    rect(-l/2, -l/2, l/4, l);
    rect(l/4, -l/2, l/4, l);
  }
  pop();
}

function drawX(x, y, l){
  push();
  stroke(255,255,30);
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

  if (item < 5){
    item = 4;
  }

  return item;
}

function isMouseInMenu(){
return false;
}

function isMouseInCreate(){
  return ((mouseX > CBOX + 0.5*CBW) && (mouseX < CBOX + 0.5*CBW + CBW/5) && (mouseY > CBOY+ CBH/4) && (mouseY < CBOY+ CBH/4 + CBW/5));
}

function isMouseInSave(){
  return ((mouseX > CBOX + 0.76*CBW) && (mouseX < CBOX + 0.76*CBW + CBW/5) && (mouseY > CBOY+ CBH/4) && (mouseY < CBOY+ CBH/4 + CBW/5));
}

function isMouseInV(){
  return ((mouseX > CBOX + 0.02*CBW) && (mouseX < CBOX + 0.02*CBW + CBW/5) && (mouseY > CBOY+ CBH*0.7) && (mouseY < CBOY+ CBH*0.7 + CBH/4));
}

function isMouseInT(){
  return ((mouseX > CBOX + 0.25*CBW) && (mouseX < CBOX + 0.25*CBW + CBW/5) && (mouseY > CBOY+ CBH*0.7) && (mouseY < CBOY+ CBH*0.7 + CBH/4));
}



function isMouseInObjA(){
  OBX = particles[0].x;
  OBY = particles[0].y;
  OBR = particles[0].r;

  return ((OBX-mouseX)*(OBX-mouseX)+(OBX-mouseX)*(OBX-mouseX)<OBR*OBR);
}

function isMouseInObjB(){
  OBX = particles[1].x;
  OBY = particles[1].y;
  OBR = particles[1].r;

  return ((OBX-mouseX)*(OBX-mouseX)+(OBX-mouseX)*(OBX-mouseX)<OBR*OBR);
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
  return (isMouseInCreate() || isMouseInSave() || isMouseInMenu() || isMouseInGrabber()|| isMouseInV()|| isMouseInT());
}

function isMouseInGrabber(){
  return   ((mouseX > CBOX+CBW-35) && (mouseX < CBOX+CBW) && (mouseY > CBOY) && (mouseY < CBOY + 35));
}


// ##############
// #            #
// #   EVENTS   #
// #            #
// ##############


function RestoreParticle(){

  if (Dumped){
    particles = [];
    for (let i = 0; i < ReturnPoint[0].length; i++) {
      QuickCreateObject(ReturnPoint[0][i],ReturnPoint[1][i],ReturnPoint[2][i],ReturnPoint[3][i]);
    }
  }

}

function ReverseParticle(){

  for (let i = 0; i < particles.length; i++) {
    particles[i].vx*=-1;
    particles[i].vy*=-1;
  }

}


function AccParticle(){

  for (let i = 0; i < particles.length; i++) {
    particles[i].vx*=2;
    particles[i].vy*=2;
  }

}

function DecParticle(){

  for (let i = 0; i < particles.length; i++) {
    particles[i].vx*=0.5;
    particles[i].vy*=0.5;
  }

}


function GiveXY(){

  PlX = round((mouseX - OriginX) * METER_RATIO*100)/100;
  PlY = round((mouseY - OriginY) * METER_RATIO*100)/100;

}

function windowResized() {
  resizeCanvas(window.innerWidth*0.8, window.innerWidth*0.8/19*13);
  for (let i = 0; i < particles.length; i++) {
    particles[i].x *= sceneWidth / oldSceneWidth;
    particles[i].y *= sceneHeight / oldSceneHeight;
    particles[i].vx *= sceneWidth / oldSceneWidth;
    particles[i].vy *= sceneHeight / oldSceneHeight;
    particles[i].r *= sceneWidth / oldSceneWidth;
    // Math.sqrt(sceneWidth*sceneHeight / (oldSceneWidth * oldSceneHeight));
  }
  ReturnPoint = [];
  Dumped = false;
  oldWidth = width;
  oldHeight = height;
  oldSceneWidth = sceneWidth;
  oldSceneHeight = sceneHeight;
}

function CreateObject(){

  XLog = [];
  YLog = [];
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

}

function QuickCreateObject(x,y,vX,vY){

  XLog = [];
  YLog = [];
  
  particles.push({
    x: x,
    y: y,
    r: SphCM / METER_RATIO,
    mass: 1,
    charge: 0,
    vx: vX,
    vy: vY
  });

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



let Erasing = false;

function mousePressed() {


  if (Listening){

    if (VarInput == 'x' || VarInput == 'y'){

      GiveXY();

    }

    if (VarInput == 'Th'){

      if (ListenedValue == ''){
      DispX = mouseX - CircOX;
      DispY = - mouseY + CircOY;
  
      PlAngl = round(CToDeg(DispX,DispY)*10)/10;
      if (PlAngl - (floor(PlAngl/AngStep))*AngStep<AngTol ){
        PlAngl = (floor(PlAngl/AngStep))*AngStep;
      }
  
      else if ((floor(PlAngl/AngStep)+1)*AngStep - PlAngl <AngTol){
        PlAngl = (floor(PlAngl/AngStep)+1)*AngStep;
      }
    
    } else {
        PlAngl = parseFloat(ListenedValue);
      }
    }

    if (VarInput == 'v')
    {
      if (ListenedValue == ''){
      if (mouseX<=sceneWidth/4){
        PlVelo = 0;
      } else if (mouseX>=3*sceneWidth/4){
        PlVelo = VCap;
      } else{
        
        PlVelo = round((mouseX - sceneWidth/4)/(sceneWidth/2)*VCap*100)/100;
      }} else {PlVelo = parseFloat(ListenedValue);}
    }

    Listening = false;


  } else if (!Listening){
    if (isMouseInCreate()){
      if (particles.length < Cap){
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

    
    } else if (PARTICLE_MODES.includes(drawingMode) && (particles.length < Cap)&&AllowClickingCreate) {
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
      
      
      /*function is_touch_enabled() {
        return ( 'ontouchstart' in window ) || 
              ( navigator.maxTouchPoints > 0 ) || 
              ( navigator.msMaxTouchPoints > 0 );
      }*/

      if (!isMouseBusy() && !movingmenu){
        XLog = [];
        YLog = [];
      
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

      if (item === REVERSE){
        ReverseParticle();
      } else if (item === BIG_NEUTRAL_PARTICLE_MODE){
        if (particles.length < Cap){
          CreateObject();
        }else{
          print('No more!');
        }
        
      } else if (item === RESET){
        RestoreParticle();
      } else if (item === ERASOR_MODE){
        if (Erasing){
          drawingMode = BIG_NEUTRAL_PARTICLE_MODE;
          Erasing = false;
        } else {
          Erasing = true;
          drawingMode = item;
        }

      } else if (item === PLAY_PAUSE_MODE){
        paused = !paused;
      } else if (item === DELETE_ALL){
        particles = [];
        vectors = [];
        XLog = [];
        YLog = []; 
        Dumped = false;
        
      } else {
        drawingMode = item;
      }
    }
  }
}
}


let Listening = false;
let ListenedValue = '';

const ListVars = ['x','y','v','Th'];
let VarInd = 0;

function checkTabPress(e) {
  "use strict";
  // pick passed event of global event object
  e = e || event;
  var activeElement;
  if (e.keyCode == 9) {
      // Here read the active selected link.
      activeElement = document.activeElement;
      // If HTML element is and anchor
      if (activeElement.tagName.toLowerCase() == 'a')
          // get its hyperlink
          alert(activeElement.href);
  }
}

var body = document.querySelector('body');
body.addEventListener('keyup', checkTabPress);


function keyPressed(){


  if (key === 'R'){
    
    VarInput = '';

    RestoreParticle();

    }


  if (key === 'J'){
  
    VarInput = '';

    ReverseParticle();

    }

  if (key === 'A'){

    VarInput = '';

    dt *= 2;

    }

  if (key === 'Z'){

      VarInput = '';
  
      dt /= 2;
  
      }

  if (key === 'C'){

    particles = [];
    vectors = [];
    XLog = [];
    YLog = []; 
    Dumped = false;
    
  }

  if (key === 'O'){

    AllowClickingCreate = !AllowClickingCreate;
    
  }

  if (key === 'F'){
    PlAngl += 5;
    PlAngl = (PlAngl%360);
  }

  if (key === 'G'){
    PlAngl -= 5;
    PlAngl = (PlAngl%360)
    if (PlAngl<0){PlAngl+=360;}
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
    CreateBi();
  }


  if (keyCode === 27){
    DX = 0;
    DY = 0;
  }


  if (keyCode === 8 && !Listening){
    XLog = [];
    YLog = [];
    particles.splice(-1);
  }


}