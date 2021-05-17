import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls';

export default class Camera {
  constructor(_options) {
    this.experience = _options.experience;
    this.canvas = this.experience.canvas;
    this.scene = _options.experience.scene;
    this.config = this.experience.config;
    this.debug = this.experience.debug;
    this.width = this.config.width;
    this.height = this.config.height;

    this.targetPosition = new THREE.Vector3(-0.095, 0.841, -0.235);

    this.setCamera();
    this.setControls();
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.1, 10000);
    this.camera.position.set(-1.3, 0.835, -1.15);
    this.camera.lookAt(this.targetPosition);
    this.scene.add(this.camera);

    // Debug Camera
    if (this.debug) {
      const cameraFolder = this.experience.gui.addFolder('Camera');
      cameraFolder.add(this.camera.position, 'x').min(-2).max(3).step(0.001);
      cameraFolder.add(this.camera.position, 'y').min(-2).max(3).step(0.001);
      cameraFolder.add(this.camera.position, 'z').min(-2).max(3).step(0.001);
      cameraFolder.add(this.targetPosition, 'x').min(-2).max(3).step(0.001)
        .name('target X')
        .onChange(() => {
          this.update();
        });
      cameraFolder.add(this.targetPosition, 'y').min(-2).max(3).step(0.001)
        .name('target Y')
        .onChange(() => {
          this.update();
        });
      cameraFolder.add(this.targetPosition, 'z').min(-2).max(3).step(0.001)
        .name('target Z')
        .onChange(() => {
          this.update();
        });
    }
  }

  introAnimation() {
    const tween = gsap.to(this.camera.position, {
      duration: 2.5,
      x: -1.306,
      y: 1.392,
      z: -2,
      delay: 1,
      ease: 'power4.inOut',
      onStart() {
        console.log('animation_started');
      },
      onUpdate() {
        console.log('animation_ongoing');
      },
      onComplete() {
        console.log('animation_completed');
      },
    });
    tween.play();
  }

  setControls() {
    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
    // setup real compass thing, with event.alpha
      this.controls = new DeviceOrientationControls(this.camera);
    } else {
      this.controls = new OrbitControls(this.camera, this.canvas);
    }
    this.controls.enableDamping = true;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 3.5;
    this.controls.minPolarAngle = Math.PI * 0.2;
    this.controls.maxPolarAngle = Math.PI * 0.5;
    this.controls.minAzimuthAngle = Math.PI * 0.9;
    this.controls.maxAzimuthAngle = Math.PI * 1.3;

    // Cursor
    // this.cursor = {
    //   x: 0,
    //   y: 0,
    // };

    // window.addEventListener('mousemove', (event) => {
    //   this.cursor.x = event.clientX / this.width - 1;
    //   this.cursor.y = -(event.clientY / this.height - 1);
    // });
  }

  update() {
    this.controls.update();
    // this.camera.position.x = Math.min(this.cursor.x * 2, 0.1);
    // this.camera.position.y = Math.max(this.cursor.y * 2, 0.5);
    this.camera.lookAt(this.targetPosition);
  }
}
