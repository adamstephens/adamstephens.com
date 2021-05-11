import Particle from './Particle';

export default class Cloth {
  constructor(_options) {
    this.w = _options.w || 10;
    this.h = _options.h || 10;
    this.curtain = _options.curtain;
    this.mass = this.curtain.mass;
    this.restDistance = this.curtain.restDistance;

    this.particles = [];
    this.constraints = [];

    this.initCloth();
  }

  initCloth() {
    const index = (u, v) => u + v * (this.w + 1);
    const particles = [];
    const constraints = [];

    // Create particles
    for (let v = 0; v <= this.h; v += 1) {
      for (let u = 0; u <= this.w; u += 1) {
        particles.push(
          new Particle({
            x: u / this.w, y: -v / this.h, z: 0, curtain: this.curtain,
          }),
        );
      }
    }

    // Structural

    for (let v = 0; v < this.h; v += 1) {
      for (let u = 0; u < this.w; u += 1) {
        constraints.push([
          particles[index(u, v)],
          particles[index(u, v + 1)],
          this.restDistance,
        ]);

        constraints.push([
          particles[index(u, v)],
          particles[index(u + 1, v)],
          this.restDistance,
        ]);
      }
    }

    for (let u = this.w, v = 0; v < this.h; v += 1) {
      constraints.push([
        particles[index(u, v)],
        particles[index(u, v + 1)],
        this.restDistance,
      ]);
    }

    for (let v = this.h, u = 0; u < this.w; u += 1) {
      constraints.push([
        particles[index(u, v)],
        particles[index(u + 1, v)],
        this.restDistance,
      ]);
    }

    this.particles = particles;
    this.constraints = constraints;

    this.index = index;
  }
}
