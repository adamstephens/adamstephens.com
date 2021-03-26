import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import assets from './assets';
import Camera from './Camera';
import Renderer from './Renderer';
import Resources from './Resources';
import London from './London';

// import Terrain from './experience/terrain';

export default class Experience {
  constructor(_options) {
    this.canvas = _options.canvas;
    // eslint-disable-next-line no-undef
    this.time = app.time;
    this.scene = new THREE.Scene();

    this.setConfig();
    this.setDebug();
    this.setStatsMonitoring();
    this.loadResources();
    this.setLights();
    this.setCamera();
    this.setRenderer();
    this.setTime();
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

  setLights() {
    const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(0.25, 2, -2.25);
    this.scene.add(directionalLight);
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
          case 'london': {
            this.london = new London({
              experience: this,
              index: _group.data.index,
            });
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

      if (this.london) {
        this.london.update();
      }
      this.camera.update();

      this.renderer.render();

      if (this.stats) {
        this.stats.end();
      }
    });
  }
}
