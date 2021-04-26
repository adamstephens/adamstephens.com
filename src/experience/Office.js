import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class London {
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

    // this.offset = new THREE.Vector3(0, 0, 0);
    // this.intersect = this.resources.items.level1IntersectModel.scene.children[0];
    // this.intersect.visible = false;
    // this.scene.add(this.intersect);

    this.group = new THREE.Group();
    this.group.visible = false;
    this.scene.add(this.group);

    this.setBaked();
    this.setFoo();

    this.show();
  }

  show() {
    this.group.visible = true;

    // Group translation
    // const y = -this.offset.y - 2;
    // const duration = Math.abs(y) * 0.5;

    // this.group.position.y = y;

    // // Shadow
    // this.shadow.material.uniforms.uAlpha.value = 0;
  }

  setBaked() {
    this.baked = {};

    // Apply
    this.baked.apply = (_object) => {
      _object.traverse((_child) => {
        if (_child instanceof THREE.Mesh) {
          _child.material = this.baked.material;
        }
      });
    };

    // Texture
    this.baked.texture = this.resources.items.officeTexture;
    this.baked.texture.flipY = false;
    this.baked.texture.encoding = THREE.sRGBEncoding;

    // Model
    this.baked.model = this.resources.items.officeModel.scene;

    // Material
    this.baked.material = new THREE.MeshBasicMaterial({ map: this.baked.texture });

    // Apply baked texture and add to scene
    this.baked.apply(this.baked.model);
    this.group.add(this.baked.model);
  }

  setFoo() {
    const rtWidth = 512;
    const rtHeight = 512;
    const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

    const rtFov = 75;
    const rtAspect = rtWidth / rtHeight;
    const rtNear = 0.1;
    const rtFar = 5;
    const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
    rtCamera.position.z = 2;

    const rtScene = new THREE.Scene();
    rtScene.background = new THREE.Color('white');

    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      rtScene.add(light);
    }

    const sphere = new THREE.BoxBufferGeometry(1, 1, 1);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
    rtScene.add(sphereMesh);

    const planeSizes = {
      width: 1.98,
      height: 1.34,
    };

    const planeGeometry = new THREE.PlaneGeometry(planeSizes.width, planeSizes.height, 1);
    const planeMaterial = new THREE.MeshPhongMaterial({
      map: renderTarget.texture,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.y = -Math.PI * 0.5;
    plane.position.y = 1.44;
    plane.position.x = 1.54;
    plane.position.z = 1.08;

    if (this.debug) {
      this.experience.gui.add(plane.scale, 'x').min(0).max(5).step(0.01);
      this.experience.gui.add(plane.scale, 'y').min(0).max(5).step(0.01);
      this.experience.gui.add(plane.position, 'x').min(0).max(3).step(0.01);
      this.experience.gui.add(plane.position, 'y').min(0).max(3).step(0.01);
      this.experience.gui.add(plane.position, 'z').min(0).max(3).step(0.01);
    }

    this.group.add(plane);

    this.controls = new OrbitControls(rtCamera, this.experience.canvas);
    this.controls.enableZoom = false;
    this.controls.enableDamping = true;

    this.time.on('tick', () => {
      this.experience.renderer.renderer.setRenderTarget(renderTarget);
      this.experience.renderer.renderer.render(rtScene, rtCamera);
      this.experience.renderer.renderer.setRenderTarget(null);

      this.controls.update();
    });
  }

  update() {
  //   this.river.material.uniforms.uTime.value = this.time.elapsedTime;
  //   this.customUniforms.uTime.value = this.time.elapsedTime;
  }

  destroy() {
    this.shadow.geometry.dispose();
    this.shadow.material.dispose();
    this.baked.material.dispose();
  }
}
