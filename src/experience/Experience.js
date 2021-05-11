import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import assets from './assets';
import Camera from './Camera';
import Renderer from './Renderer';
import Resources from './Resources';
import Office from './Office';
import Floor from './Floor';
import ShadowMaterial from './materials/ShadowMaterial';

// import Terrain from './experience/terrain';

export default class Experience {
  constructor(_options) {
    this.canvas = _options.canvas;
    // eslint-disable-next-line no-undef
    this.time = app.time;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe6faff);

    this.setConfig();
    this.setDebug();
    this.setStatsMonitoring();
    this.setColors();
    this.loadResources();
    this.setLights();
    this.setCamera();
    this.setRenderer();
    this.setTime();
    // this.setFloor();
  }

  setConfig() {
    this.config = {};
    this.config.width = window.innerWidth;
    this.config.height = window.innerHeight;
    this.config.pixelRatio = Math.min(window.devicePixelRatio, 2);
    // this.config.orientation = this.sizes.viewport.width < this.sizes.viewport.height ? 'portrait' : 'landscape';
    // this.config.ouka = window.location.hash === '#ouka';
  }

  setDebug() {
    if (window.location.hash === '#debug') {
      this.gui = new dat.GUI();
      this.debug = true;
    }
  }

  setStatsMonitoring() {
    if (!this.debug) {
      return;
    }

    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
  }

  setColors() {
    this.colors = {};

    this.colors.floorOuter = {};
    this.colors.floorOuter.string = '#d0cbff';
    this.colors.floorOuter.instance = new THREE.Color(this.colors.floorOuter.string);

    this.colors.floorInner = {};
    this.colors.floorInner.string = '#e7dbf7';
    this.colors.floorInner.instance = new THREE.Color(this.colors.floorInner.string);

    this.colors.floorShadow = {};
    this.colors.floorShadow.string = '#8d70d6';
    this.colors.floorShadow.instance = new THREE.Color(this.colors.floorShadow.string);

    this.colors.floorLight = {};
    this.colors.floorLight.string = '#FFFFFF';
    this.colors.floorLight.instance = new THREE.Color(this.colors.floorLight.string);

    this.colors.glow = {};
    this.colors.glow.string = '#e2c1ff';
    this.colors.glow.instance = new THREE.Color(this.colors.glow.string);

    this.colors.tint = {};
    this.colors.tint.string = '#0e0a19';
    this.colors.tint.instance = new THREE.Color(this.colors.tint.string);

    if (this.debug) {
      const colorsFolder = this.gui.addFolder('Colors');

      Object.keys(this.colors).forEach((key) => {
        const color = this.colors[key];

        colorsFolder.addColor(color, 'string')
          .name(key)
          .onChange(() => {
            color.instance.set(color.string);
          });
      });
    }
  }

  setLights() {
    // const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
    // directionalLight.position.set(10, 10, 0);
    // this.scene.add(directionalLight);
    // const helper = new THREE.DirectionalLightHelper(directionalLight, 1);
    // this.scene.add(helper);
    // const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // this.scene.add(directionalLightCameraHelper);

    // const light = new THREE.PointLight(0xffffff, 1, 100);
    // light.position.set(0, 1, 0);
    // this.scene.add(light);
    // const pointLightHelper = new THREE.PointLightHelper(light, 0.1);
    // this.scene.add(pointLightHelper);

    const amblight = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(amblight);
  }

  setFloor() {
    this.floor = new Floor({
      experience: this,
    });
  }

  setShadow() {
    this.shadow = {};

    // Geometry
    this.shadow.geometry = new THREE.PlaneBufferGeometry(20, 20, 1, 1);

    // Material
    // this.resources.items.floorShadow.encoding = THREE.LinearEncoding
    this.shadow.material = new THREE.MeshStandardMaterial();
    // this.shadow.material.uniforms.uColor.value = this.colors.floorShadow.instance;
    // this.shadow.material.uniforms.uLightColor.value = this.colors.floorLight.instance;
    // this.shadow.material.uniforms.uMask.value = this.resources.items.officeShadowTexture;
    // this.shadow.material.uniforms.uLightMask.value = this.resources.items.officeLightTexture;
    // this.shadow.material.uniforms.uAlpha.value = 1;

    // Mesh
    this.shadow.mesh = new THREE.Mesh(this.shadow.geometry, this.shadow.material);
    this.shadow.mesh.receiveShadow = true;
    this.shadow.mesh.position.y = 0.01;
    this.shadow.mesh.position.x = 0;
    this.shadow.mesh.rotation.x = -Math.PI * 0.5;
    this.shadow.mesh.rotation.z = -Math.PI * 1;
    this.shadow.mesh.matrixAutoUpdate = false;
    this.shadow.mesh.updateMatrix();
    this.scene.add(this.shadow.mesh);
  }

  /**
  * Load all resources
  */
  loadResources() {
    this.resources = new Resources(assets());

    // this.resources.on('progress', (_group, _resource, _data) => {
    // });

    this.resources.on('groupEnd', (_group) => {
      window.requestAnimationFrame(() => {
        switch (_group.name) {
          case 'office': {
            const overlay = document.querySelector('.loading');
            overlay.classList.add('complete');

            this.office = new Office({
              experience: this,
              index: _group.data.index,
            });
            // this.setShadow();
            break;
          }

          default:
            break;
        }
      });
    });

    // this.resources.on('end', (_group) => {
    // });
  }

  /**
  * Camera
  */
  setCamera() {
    this.camera = new Camera({
      experience: this,
    });
  }

  /**
  * Render
  */
  setRenderer() {
    this.renderer = new Renderer({
      experience: this,
    });
  }

  /**
  * Frame animation
  */
  setTime() {
    this.time.on('tick', () => {
      // if (this.achievedFirstRender && window.scrollY > this.sizes.viewport.height) {
      //   return;
      // }

      // this.achievedFirstRender = true;

      if (this.stats) {
        this.stats.begin();
      }

      if (this.office) {
        this.office.update();
      }

      this.camera.update();

      // this.renderer.render();
      this.renderer.composer.render();

      if (this.stats) {
        this.stats.end();
      }
    });
  }
}
