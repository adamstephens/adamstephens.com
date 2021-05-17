import * as THREE from 'three';

export default class MonitorScreen {
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

    this.currentScreen = 0;
    this.animationCounter = 0;
    this.charCounter = 0;
    this.animationStep = 0.1;
    this.typedContent = `this.geometry = new THREE.PlaneGeometry(0.61, 0.343, 1);
    this.material = new THREE.MeshBasicMaterial({ map: this.screenTexture });
    this.screen = new THREE.Mesh(this.geometry, this.material);
    this.screen.position.set(-0.0544, 1.0634, 0.2331);
    this.screen.rotation.y = Math.PI;
    this.screen.rotation.x = Math.PI * 0.028;`;

    this.initScreen();
  }

  initScreen() {
    const video = document.getElementById('video');
    video.play();

    this.screenTexture = new THREE.VideoTexture(video);
    this.screenTexture.format = THREE.RGBAFormat;
    this.screenTexture.encoding = THREE.sRGBEncoding;
    this.screenTexture2 = this.resources.items.screenTexture2;

    this.geometry = new THREE.PlaneGeometry(0.61, 0.343, 1);
    this.material = new THREE.MeshBasicMaterial({ map: this.screenTexture });
    this.screen = new THREE.Mesh(this.geometry, this.material);
    this.screen.position.set(-0.0544, 1.0634, 0.2331);
    this.screen.rotation.y = Math.PI;
    this.screen.rotation.x = Math.PI * 0.028;
  }

  switchScreen(texture) {
    this.material.map = texture;
    this.material.map.needsUpdate = true;
  }

  update() {
    this.material.map.needsUpdate = true;
  }

  destroy() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
