function update(dt, particles, vectors, width, height) { for (let i = 0; i < particles.length; i++) {
    let netField = netElectricField(particles, vectors, particles[i].x,
      particles[i].y, particles[i].r);
    // acceleration initial X and Y
    let aiX = particles[i].charge*netField.x/particles[i].mass;
    let aiY = particles[i].charge*netField.y/particles[i].mass;

    particles[i].vx += aiX * dt;
    particles[i].vy += aiY * dt;
  }

  // collision
  for (let i = 0; i < particles.length; i++) {
    if(particles.length > 1) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[j].x - particles[i].x;
        let dy = particles[j].y - particles[i].y;
        let d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

        let dvx = particles[j].vx - particles[i].vx;
        let dvy = particles[j].vy - particles[i].vy;

        let velDotDis = dvx * dx + dvy * dy;

        // collision and modification velocity (see Diego's website for the full formula)
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
        }
      }
    }

    // to set the bounderies of the screen and make the particles bounce on the edges of the screen
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
