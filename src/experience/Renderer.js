import * as THREE from 'three';

export default class Renderer {
  constructor(_options) {
    this.experience = _options.experience;
    this.canvas = this.experience.canvas;
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.setRender();
    this.resize();
  }

  setRender() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // this.renderer.toneMappingExposure = 1;
    this.renderer.setPixelRatio(this.renderer.capabilities.isWebGL2 ? this.config.pixelRatio : 2);

    // window.addEventListener('resize', () => {
    //   // Update sizes
    //   sizes.width = window.innerWidth;
    //   sizes.height = window.innerHeight;

    //   // Update camera
    //   camera.aspect = sizes.width / sizes.height;
    //   camera.updateProjectionMatrix();

    //   // Update renderer
    //   renderer.setSize(sizes.width, sizes.height);
    //   renderer.setPixelRatio(this.config.pixelRatio);
    // });
  }

  render() {
    this.renderer.render(this.scene, this.camera.camera);
  }

  resize() {
    this.renderer.setSize(this.config.width, this.config.height);
    this.renderer.setPixelRatio(this.renderer.capabilities.isWebGL2 ? this.config.pixelRatio : 2);
  }

  destroy() {
    this.renderer.dispose();
  }
}
