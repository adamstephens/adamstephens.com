import * as THREE from 'three';

export default class ClockHand {
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

    this.initClockHand();
  }

  initClockHand() {
    this.geometry = new THREE.BoxGeometry(0.007, 0.1, 0.001);
    this.material = new THREE.MeshBasicMaterial({ color: 0x2f1e1b });
    this.secondHand = new THREE.Mesh(this.geometry, this.material);
    this.secondHand.position.set(0.808, 1.304, 0.35);
    this.geometry.translate(0, -0.1 / 2, 0);
  }

  update() {
    this.secondHand.rotation.z += Math.PI * 0.001;
  }

  destroy() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
