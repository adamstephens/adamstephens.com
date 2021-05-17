import * as THREE from 'three';
import Cloth from './Cloth';

export default class Curtain {
  constructor(_options) {
    // Options
    this.experience = _options.experience;
    this.config = this.experience.config;
    this.colors = this.experience.colors;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;
    this.index = _options.index;

    this.position = _options.position;

    this.diff = new THREE.Vector3();
    this.restDistance = 25;
    this.xSegs = 10;
    this.ySegs = 10;
    this.mass = _options.mass;
    this.windForce = new THREE.Vector3(0, 0, 0);
    this.params = {
      enableWind: true,
      showBall: false,
      foo: -5,
    };
    this.tmpForce = new THREE.Vector3();
    this.DAMPING = _options.damping;
    this.DRAG = 1 - this.DAMPING;

    this.GRAVITY = 981 * 1.4;
    // this.GRAVITY = 981 * 0.5;
    this.gravity = new THREE.Vector3(0, -this.GRAVITY, 0).multiplyScalar(this.mass);

    this.TIMESTEP = 18 / 1000;
    this.TIMESTEP_SQ = this.TIMESTEP * this.TIMESTEP;
    this.pins = [];
    this.clothFunction = null;

    this.ballPosition = new THREE.Vector3(1.4, 1.5, 2.1);

    this.initCurtain();
  }

  initCurtain() {
    function plane(width, height) {
      return function (u, v, target) {
        const x = (u - 0.5) * width;
        const y = (v + 0.5) * height;
        const z = 0;

        target.set(x, y, z);
      };
    }

    this.clothFunction = plane(this.restDistance * this.xSegs, this.restDistance * this.ySegs);

    this.cloth = new Cloth({
      w: this.xSegs, h: this.ySegs, curtain: this,
    });

    this.clothMaterial = new THREE.MeshLambertMaterial({
      map: this.resources.items.curtainTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    });

    // this.clothMaterial = new THREE.MeshStandardMaterial({
    //   side: THREE.DoubleSide,
    //   color: 0xffffff,
    //   roughness: 1,
    //   transparent: true,
    //   opacity: 0.95,
    // });

    // cloth geometry
    this.clothGeometry = new THREE.ParametricBufferGeometry(this.clothFunction, this.cloth.w, this.cloth.h);

    // cloth mesh
    this.curtainMesh = new THREE.Mesh(this.clothGeometry, this.clothMaterial);
    const { x, y, z } = this.position;
    this.curtainMesh.position.set(x, y, z);
    this.curtainMesh.rotation.y = Math.PI * 0.5;
    this.curtainMesh.castShadow = true;
    this.curtainMesh.scale.set(0.0025, 0.005, 0.005);

    // this.curtainMesh.customDepthMaterial = new THREE.MeshDepthMaterial({
    //   depthPacking: THREE.RGBADepthPacking,
    //   map: this.resources.items.curtainTexture,
    //   alphaTest: 0.5,
    // });

    const pinsFormation = [];
    this.pins = [0, 2, 4, 6, 8, 10];
    pinsFormation.push(this.pins);

    this.pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    pinsFormation.push(this.pins);

    this.pins = pinsFormation[1];

    this.simulate(0);
    this.render();

    if (this.debug) {
      this.experience.gui.add(this.params, 'foo').min(-10).max(100).step(0.01);
    }
  }

  satisfyConstraints(p1, p2, distance) {
    this.diff.subVectors(p2.position, p1.position);
    const currentDist = this.diff.length();
    if (currentDist === 0) return; // prevents division by 0
    const correction = this.diff.multiplyScalar(1 - distance / currentDist);
    const correctionHalf = correction.multiplyScalar(0.5);
    p1.position.add(correctionHalf);
    p2.position.sub(correctionHalf);
  }

  simulate(now) {
    const windStrength = Math.cos(now / 7000) * 20 + 40;

    this.windForce.set(-Math.sin(now / 2000), Math.cos(now / 3000), -Math.abs(Math.sin(now / 1000)));
    this.windForce.normalize();
    this.windForce.multiplyScalar(windStrength);

    console.log(this.windForce);

    // Aerodynamics forces

    const { particles } = this.cloth;

    if (this.params.enableWind) {
      let indx;
      const normal = new THREE.Vector3();
      const indices = this.clothGeometry.index;
      const normals = this.clothGeometry.attributes.normal;

      for (let i = 0, il = indices.count; i < il; i += 3) {
        for (let j = 0; j < 3; j++) {
          indx = indices.getX(i + j);
          normal.fromBufferAttribute(normals, indx);
          this.tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(this.windForce));
          particles[indx].addForce(this.tmpForce);
        }
      }
    }

    for (let i = 0, il = particles.length; i < il; i++) {
      const particle = particles[i];
      particle.addForce(this.gravity);

      particle.integrate(this.TIMESTEP_SQ);
    }

    // Start Constraints

    const { constraints } = this.cloth;
    const il = constraints.length;

    for (let i = 0; i < il; i++) {
      const constraint = constraints[i];
      this.satisfyConstraints(constraint[0], constraint[1], constraint[2]);
    }

    // for (let i = 0, il = particles.length; i < il; i++) {
    //   const particle = particles[i];
    //   const pos = particle.position;
    //   this.diff.subVectors(pos, this.ballPosition);
    //   if (this.diff.length() < 100) {
    //     // collided
    //     console.log('foo');
    //     this.diff.normalize().multiplyScalar(2);
    //     pos.copy(this.ballPosition).add(this.diff);
    //   }
    // }

    // Floor Constraints
    for (let i = 0, il = particles.length; i < il; i++) {
      const particle = particles[i];
      const pos = particle.position;
      if (pos.z > this.params.foo) {
        pos.z = this.params.foo;
      }
    }

    // Pin Constraints

    for (let i = 0, il = this.pins.length; i < il; i++) {
      const xy = this.pins[i];
      const p = particles[xy];
      p.position.copy(p.original);
      p.previous.copy(p.original);
    }
  }

  render() {
    const p = this.cloth.particles;

    for (let i = 0, il = p.length; i < il; i += 1) {
      const v = p[i].position;

      this.clothGeometry.attributes.position.setXYZ(i, v.x, v.y, v.z);
    }

    this.clothGeometry.attributes.position.needsUpdate = true;

    this.clothGeometry.computeVertexNormals();
  }

  update() {
    this.simulate(this.time.now);
    this.render();
  }

  destroy() {
    this.shadow.geometry.dispose();
    this.shadow.material.dispose();
    this.baked.material.dispose();
  }
}
