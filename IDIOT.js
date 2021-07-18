
function mousePressed() {

  if ((VarInput == 'Th' || VarInput == 'v') && Listening){

    if (VarInput == 'Th')
    {
      DispX = mouseX - CircOX;
      DispY = - mouseY + CircOY;
  
      PlAngl = round(CToDeg(DispX,DispY)*10)/10;
    }

    if (VarInput == 'v')
    {
      if (mouseX<=sceneWidth/4){
        PlVelo = 0;
      } else if (mouseX>=3*sceneWidth/4){
        PlVelo = VCap;
      } else {
        PlVelo = round((mouseX - sceneWidth/4)/(sceneWidth/2)*VCap*100)/100;
      }
    }

    Listening = false;


  } 
  if (!Listening){
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

    } else if(isMouseInV()) {
      Listening = true;
      paused = true;
      VarInput = 'v';
    } else if(isMouseInT()) {
      Listening = true;
      paused = true;
      VarInput = 'Th';
    
    } else if (PARTICLE_MODES.includes(drawingMode) && (particles.length < Cap)) {
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
        XLog = [];
        YLog = [];
        particles.push({
          x: mouseX,
          y: mouseY,
          r: r,
          mass: mass,
          charge: charge,
          vx: vx,
          vy: vy
        });

        if (particles.length == Cap){
          ReturnPoint = [];
          for (let i = 0; i < particles.length; i++) {
            
            ReturnPoint.push(particles[i]);
          }
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
        XLog = [];
        YLog = [];  
      } else {
        drawingMode = item;
      }
    }
	}}
}}


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

  if (key === 'R'){
      VarInput = '';

      particles = [];

      if (Restorable){
        
        for (let i = 0; i < ReturnPoint.length; i++) {
          particles.push(ReturnPoint[i]);
        }
      }
      Restorable = true;
    
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
    if (particles.length < Cap){
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
    XLog = [];
    YLog = [];
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
    } else if (VarInput == 'y'){
      PlY = InputValue;
    }

  if (keyCode === 13){
  Listening = false;
  ListenedValue = '';
  }
}
}
