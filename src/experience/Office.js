import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Curtain from './curtain/Curtain';
import ClockHand from './ClockHand';
import MonitorScreen from './MonitorScreen';

export default class Office {
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
    this.setCurtain();
    this.setClockHand();
    this.setMonitorScreen();

    this.show();
    this.camera.introAnimation();
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
          if (_child.name === 'Curtain_rail'
          || _child.name === 'Skirting'
          || _child.name.startsWith('walls')
          || _child.name === 'Window') {
            _child.material = this.baked.roomMaterial;
          } else if (_child.name.startsWith('desk-1')) {
            _child.material = this.baked.deskMaterial1;
          } else if (_child.name.startsWith('desk-2')) {
            _child.material = this.baked.deskMaterial2;
          } else if (_child.name.startsWith('desk-3')) {
            _child.material = this.baked.deskMaterial3;
          } else if (_child.name === 'office_workplace_19_langfjall_chair') {
            _child.material = this.baked.chairMaterial;
          } else if (_child.name === 'GEO-vincent_body_3' || _child.name === 'GEO-vincent_body_8' || _child.name === 'GEO-vincent_body_7' || _child.name === 'GEO-vincent_body_6' || _child.name === 'GEO-vincent_body_5' || _child.name === 'GEO-vincent_body_4' || _child.name === 'GEO-vincent_hair' || _child.name.startsWith('GEO-vincent_teeth')) {
            _child.material = this.baked.manMaterial;
          } else if (_child.name === 'GEO-vincent_body_1' || _child.name === 'GEO-vincent_body_2' || _child.name === 'GEO-vincent_eyeglasses' || _child.name.startsWith('GEO-vincent_eyeball')) {
            _child.material = this.baked.manMaterial2;
          } else if (_child.name.startsWith('book') || _child.name.startsWith('shelf') || _child.name === 'Plant') {
            _child.material = this.baked.bookMaterial;
          } else {
            _child.material = this.baked.roomMaterial;
          }
        }
      });
    };

    // Room Texture
    this.baked.roomTexture = this.resources.items.roomTexture;
    this.baked.roomTexture.flipY = false;
    this.baked.roomTexture.encoding = THREE.sRGBEncoding;

    // Desk Texture
    this.baked.deskTexture1 = this.resources.items.deskTexture1;
    this.baked.deskTexture1.flipY = false;
    this.baked.deskTexture1.encoding = THREE.sRGBEncoding;

    this.baked.deskTexture2 = this.resources.items.deskTexture2;
    this.baked.deskTexture2.flipY = false;
    this.baked.deskTexture2.encoding = THREE.sRGBEncoding;

    this.baked.deskTexture3 = this.resources.items.deskTexture3;
    this.baked.deskTexture3.flipY = false;
    this.baked.deskTexture3.encoding = THREE.sRGBEncoding;

    this.baked.chairTexture = this.resources.items.chairTexture;
    this.baked.chairTexture.flipY = false;
    this.baked.chairTexture.encoding = THREE.sRGBEncoding;

    // Man texture
    this.baked.manTexture1 = this.resources.items.manTexture1;
    this.baked.manTexture1.flipY = false;
    this.baked.manTexture1.encoding = THREE.sRGBEncoding;

    this.baked.manTexture2 = this.resources.items.manTexture2;
    this.baked.manTexture2.flipY = false;
    this.baked.manTexture2.encoding = THREE.sRGBEncoding;

    // Book texture
    this.baked.bookTexture = this.resources.items.bookTexture;
    this.baked.bookTexture.flipY = false;
    this.baked.bookTexture.encoding = THREE.sRGBEncoding;

    // Model
    this.baked.model = this.resources.items.officeModel.scene;

    // Room Material
    this.baked.roomMaterial = new THREE.MeshBasicMaterial({ map: this.baked.roomTexture });

    // Desk Material
    this.baked.deskMaterial1 = new THREE.MeshBasicMaterial({ map: this.baked.deskTexture1, side: THREE.DoubleSide });
    this.baked.deskMaterial2 = new THREE.MeshBasicMaterial({ map: this.baked.deskTexture2, side: THREE.DoubleSide });
    this.baked.deskMaterial3 = new THREE.MeshBasicMaterial({ map: this.baked.deskTexture3, side: THREE.DoubleSide });

    // Desk Material
    this.baked.chairMaterial = new THREE.MeshBasicMaterial({ map: this.baked.chairTexture });

    // Book Material
    this.baked.bookMaterial = new THREE.MeshBasicMaterial({ map: this.baked.bookTexture });

    // Man Material
    this.baked.manMaterial = new THREE.MeshBasicMaterial({ map: this.baked.manTexture1 });
    this.baked.manMaterial2 = new THREE.MeshBasicMaterial({ map: this.baked.manTexture2 });

    // Apply baked texture and add to scene
    this.baked.apply(this.baked.model);
    this.group.add(this.baked.model);

    this.baked.manModel = this.resources.items.manModel.scene;
    this.baked.apply(this.baked.manModel);
    this.group.add(this.baked.manModel);
  }

  setCurtain() {
    this.curtain = new Curtain({
      experience: this.experience,
      position: new THREE.Vector3(2.4, 1.1, -0.8),
      mass: 0.5,
      damping: 0.09,
    });
    this.group.add(this.curtain.curtainMesh);

    this.curtain2 = new Curtain({
      experience: this.experience,
      position: new THREE.Vector3(2.4, 1.1, 0.7),
      mass: 0.3,
      damping: 0.03,
    });
    this.group.add(this.curtain2.curtainMesh);
  }

  setClockHand() {
    this.clockHand = new ClockHand({
      experience: this.experience,
    });
    this.group.add(this.clockHand.secondHand);
  }

  setMonitorScreen() {
    this.monitorScreen = new MonitorScreen({
      experience: this.experience,
    });
    this.group.add(this.monitorScreen.screen);
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
    if (this.clockHand) {
      this.clockHand.update();
    }
    if (this.curtain) {
      this.curtain.update();
    }
    if (this.curtain2) {
      this.curtain2.update();
    }
    if (this.monitorScreen) {
      this.monitorScreen.update();
    }

    if (this.resources.items.manModel.mixer) {
      this.resources.items.manModel.mixer.update(this.time.deltaTime);
    }
  }

  destroy() {
    this.shadow.geometry.dispose();
    this.shadow.material.dispose();
    this.baked.material.dispose();
  }
}
