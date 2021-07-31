///// PHYSICS.JS
/// ORIGINAL VERSION BY DIEGO LOPEZ.

const SFric = 0; // -kv^2
const SBoun = 1; // Restitution of Wall
const SReco = 1; // Restitution of Ball

function SGN(x){

  if (x == 0){
    return 1;
  } else {
  return x/abs(x);}
}

function update(dt, particles, vectors, width, height) { 

  /*
  for (let i = 0; i < particles.length; i++) {


    let netField = netElectricField(particles, vectors, particles[i].x,
      particles[i].y, particles[i].r);
    // acceleration initial X and Y
    let aiX = particles[i].charge*netField.x/particles[i].mass;
    let aiY = particles[i].charge*netField.y/particles[i].mass;

    particles[i].vx += aiX * dt;
    particles[i].vy += aiY * dt;
  }
  */
  // collision
  for (let i = 0; i < particles.length; i++) 
  {
    if(particles.length > 1) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[j].x - particles[i].x;
        let dy = particles[j].y - particles[i].y;
        let d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

        let dvx = particles[j].vx - particles[i].vx;
        let dvy = particles[j].vy - particles[i].vy;

        let velDotDis = dvx * dx + dvy * dy;

        // collision and modification velocity (see Diego's website for the f ull formula)
        // checks if distance between particles = 0 and 
        if(d <= (particles[i].r + particles[j].r) && velDotDis < 0){ 


          // Start of computing lamda (as in the formula in the website)
          let disSquared = dx*dx + dy*dy;

          let l = -2*particles[i].mass*particles[j].mass /
            (particles[i].mass + particles[j].mass)*velDotDis/disSquared;
          // end of computation of lamda

          // after collision, modification of the velocities of each particle
          // (following the formula on Diego's website)
          particles[i].vx -= l/(particles[i].mass)*dx;
          particles[i].vy -= l/(particles[i].mass)*dy;
          particles[j].vx += l/(particles[j].mass)*dx;
          particles[j].vy += l/(particles[j].mass)*dy;


/*// No spin no shear. FW's naive twist. 
          let uax = particles[i].vx;
          let uay = particles[i].vy;

          let ubx = particles[j].vx;
          let uby = particles[j].vy;

          let ma = particles[i].mass;
          let mb = particles[j].mass;

// THIS IS FALSE

        particles[i].vx = (SBoun*mb*(ubx-uax) + ma * uax + mb* ubx) / (ma + mb);

        particles[i].vy = (SBoun*mb*(uby-uay) + ma * uay + mb* uby) / (ma + mb);


        particles[j].vx = (SBoun*ma*(uax-ubx) + ma * uax + mb* ubx) / (ma + mb);

        particles[j].vy = (SBoun*ma*(uay-uby) + ma * uay + mb* uby) / (ma + mb);
*/

        }
      }
    }

    // to set the bounderies of the screen and make the particles bounce on the edges of the screen

    
    if (particles[i].x + particles[i].r >= width){
      particles[i].vx *= -1 * SBoun;
      particles[i].x = width - particles[i].r;
    } else if (particles[i].x - particles[i].r <= 0){
      particles[i].vx *= -1 * SBoun;
      particles[i].x = particles[i].r;
    }
   
/*
   if (particles[i].x >= width){
    particles[i].x -= width;
  } else if (particles[i].x <= 0){
    particles[i].x += width;
  }
 */

    if (particles[i].y + particles[i].r >= height){
      particles[i].vy *= -1 * SBoun;
      particles[i].y = height - particles[i].r;

    } else if (particles[i].y - particles[i].r <= 0){
      particles[i].vy *= -1 * SBoun;
      particles[i].y = particles[i].r;
    }
    particles[i].x += particles[i].vx * dt;
    particles[i].y += particles[i].vy * dt;

    let vT = sqrt(particles[i].vx*particles[i].vx+particles[i].vy*particles[i].vy);

    let SX = SGN(particles[i].vx);
    let SY = SGN(particles[i].vy);

    particles[i].vx = particles[i].vx - (SFric)*vT*abs(particles[i].vx) * dt * SX;
    particles[i].vy = particles[i].vy - (SFric)*vT*abs(particles[i].vy) * dt * SY;


  }


}

// vectors here is only an array storing the vectorsElectricFields
function netElectricField(particles, vectors, x, y, r){
  let eNetX = 0;
  let eNetY = 0;

  let dx, dy, d;

  // goes throught the electric fields vectors 
  for (let j = 0; j < vectors.length; j++){
    // distances between the position of the particles and 
    // the positions of tails of the electric fields vectors
    dx = vectors[j].tailX - x;
    dy = vectors[j].tailY - y;

    d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

    // calculate the net electric field (in components)
    eNetX += Math.pow(e, -d/100) * vectors[j].x * 200;
    eNetY += Math.pow(e, -d/100) * vectors[j].y * 200;
  }

  for(let j = 0; j< particles.length; j++){
    // position of the particle - position of each particle
    dx = x - particles[j].x;
    dy = y - particles[j].y;
    d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
    //  electric field due to j
    if (d > particles[j].r + r) {
      let E = k*particles[j].charge/(Math.pow(d, 2)); 
      eNetX += E * (dx/d);
      eNetY += E * (dy/d);
    }
  }

  return {x:eNetX, y:eNetY};
}


function updateG(dt, particles, vectors, width, height,Gravity) { 


  for (let i = 0; i < particles.length; i++) {
    particles[i].vy += Gravity * dt;
  }

  // collision
  for (let i = 0; i < particles.length; i++) 
  {
    if(particles.length > 1) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[j].x - particles[i].x;
        let dy = particles[j].y - particles[i].y;
        let d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

        let dvx = particles[j].vx - particles[i].vx;
        let dvy = particles[j].vy - particles[i].vy;

        let velDotDis = dvx * dx + dvy * dy;

        // collision and modification velocity (see Diego's website for the f ull formula)
        // checks if distance between particles = 0 and 
        if(d <= (particles[i].r + particles[j].r) && velDotDis < 0){ 


          // Start of computing lamda (as in the formula in the website)
          let disSquared = dx*dx + dy*dy;

          let l = -2*particles[i].mass*particles[j].mass /
            (particles[i].mass + particles[j].mass)*velDotDis/disSquared;
          // end of computation of lamda

          // after collision, modification of the velocities of each particle
          // (following the formula on Diego's website)
          particles[i].vx -= l/(particles[i].mass)*dx;
          particles[i].vy -= l/(particles[i].mass)*dy; 
          particles[j].vx += l/(particles[j].mass)*dx;
          particles[j].vy += l/(particles[j].mass)*dy;


/*// No spin no shear. FW's naive twist. 
          let uax = particles[i].vx;
          let uay = particles[i].vy;

          let ubx = particles[j].vx;
          let uby = particles[j].vy;

          let ma = particles[i].mass;
          let mb = particles[j].mass;

// THIS IS FALSE

        particles[i].vx = (SBoun*mb*(ubx-uax) + ma * uax + mb* ubx) / (ma + mb);

        particles[i].vy = (SBoun*mb*(uby-uay) + ma * uay + mb* uby) / (ma + mb);


        particles[j].vx = (SBoun*ma*(uax-ubx) + ma * uax + mb* ubx) / (ma + mb);

        particles[j].vy = (SBoun*ma*(uay-uby) + ma * uay + mb* uby) / (ma + mb);
*/

        }
      }
    }

    // to set the bounderies of the screen and make the particles bounce on the edges of the screen

    
    if (particles[i].x + particles[i].r >= width){
      particles[i].vx *= -1 * SBoun;
      particles[i].x = width - particles[i].r;
    } else if (particles[i].x - particles[i].r <= 0){
      particles[i].vx *= -1 * SBoun;
      particles[i].x = particles[i].r;
    }
   
/*
   if (particles[i].x >= width){
    particles[i].x -= width;
  } else if (particles[i].x <= 0){
    particles[i].x += width;
  }
 */

    if (particles[i].y + particles[i].r >= height){
      particles[i].vy *= -1 * SBoun;
      particles[i].y = height - particles[i].r;

    } else if (particles[i].y - particles[i].r <= 0){
      particles[i].vy *= -1 * SBoun;
      particles[i].y = particles[i].r;
    }
    particles[i].x += particles[i].vx * dt;
    particles[i].y += particles[i].vy * dt;

    let vT = sqrt(particles[i].vx*particles[i].vx+particles[i].vy*particles[i].vy);

    let SX = SGN(particles[i].vx);
    let SY = SGN(particles[i].vy);

    particles[i].vx = particles[i].vx - (SFric)*vT*abs(particles[i].vx) * dt * SX;
    particles[i].vy = particles[i].vy - (SFric)*vT*abs(particles[i].vy) * dt * SY;


  }


}