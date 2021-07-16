# Physics Playground

Simple electrodynamics demo

## Code organization

Physics-related code is in `physics.js`.
This file defines the `update()` which advances the state by a single timestep.
The rest of the code is in `sketch.js` and it is split into four sections:
* The definition of the `p5.js` functions `setup()` and `draw()`
* Drawing functions
* Useful helper functions
* Events
