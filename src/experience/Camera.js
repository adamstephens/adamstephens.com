import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {
  constructor(_options) {
    this.experience = _options.experience;
    this.canvas = this.experience.canvas;
    this.scene = _options.experience.scene;
    this.config = this.experience.config;
    this.width = this.config.width;
    this.height = this.config.height;

    this.setCamera();
    this.setControls();
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(4, 1, -4);
    this.scene.add(this.camera);
  }

  setControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  update() {
    this.controls.update();
  }
}
