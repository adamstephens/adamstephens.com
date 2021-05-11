import * as THREE from 'three';

export default class Particle {
  constructor(_options) {
    this.position = new THREE.Vector3();
    this.previous = new THREE.Vector3();
    this.original = new THREE.Vector3();
    this.a = new THREE.Vector3(0, 0, 0); // acceleration
    this.x = _options.x;
    this.y = _options.y;
    this.z = _options.z;
    this.curtain = _options.curtain;
    this.mass = this.curtain.mass;
    this.restDistance = this.curtain.restDistance;
    this.invMass = 1 / this.mass;
    this.tmp = new THREE.Vector3();
    this.tmp2 = new THREE.Vector3();
    this.xSegs = 10;
    this.ySegs = 10;

    this.initCloth();
  }

  initCloth() {
    this.curtain.clothFunction(this.x, this.y, this.position); // position
    this.curtain.clothFunction(this.x, this.y, this.previous); // previous
    this.curtain.clothFunction(this.x, this.y, this.original);
  }

  addForce(force) {
    this.a.add(
      this.tmp2.copy(force).multiplyScalar(this.invMass),
    );
  }

  integrate(timesq) {
    const newPos = this.tmp.subVectors(this.position, this.previous);
    newPos.multiplyScalar(this.curtain.DRAG).add(this.position);
    newPos.add(this.a.multiplyScalar(timesq));

    this.tmp = this.previous;
    this.previous = this.position;
    this.position = newPos;

    this.a.set(0, 0, 0);
  }
}
