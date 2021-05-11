import * as THREE from 'three';
import { HalfFloatType } from 'three';
import {
  DepthOfFieldEffect, GodRaysEffect, EffectComposer, EffectPass, RenderPass,
} from 'postprocessing';

export default class Renderer {
  constructor(_options) {
    this.experience = _options.experience;
    this.canvas = this.experience.canvas;
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;
    this.setRender();
    this.resize();
  }

  setRender() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.renderer.setSize(this.config.width, this.config.height);
    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.PCFShadowMap;
    // this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // this.renderer.toneMappingExposure = 1;
    this.renderer.setPixelRatio(this.renderer.capabilities.isWebGL2 ? this.config.pixelRatio : 2);

    window.addEventListener('resize', () => {
      // Update sizes
      this.config.width = window.innerWidth;
      this.config.height = window.innerHeight;

      // Update camera
      this.camera.camera.aspect = this.config.width / this.config.height;
      this.camera.camera.updateProjectionMatrix();

      // Update renderer
      this.resize();
    });

    this.postProcessing();
  }

  render() {
    this.renderer.render(this.scene, this.camera.camera);
  }

  postProcessing() {
    const options = {
      focalLength: 0.0002,
      focusDistance: 0.0002,
      bokehScale: 8,
      width: this.config.width,
      height: this.config.height,
    };
    const dof = new DepthOfFieldEffect(this.camera.camera, options);

    const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array([
      -0.1, -0.1, 0.1,
	 0.1, -0.1, 0.1,
	 0.1, 0.1, 0.1,

	 0.1, 0.1, 0.1,
      -0.1, 0.1, 0.1,
      -0.1, -0.1, 0.1,
    ]);

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0xffcc80 });
    const mesh = new THREE.Points(geometry, material);
    mesh.position.set(6.2, 1.7, 1.5);
    this.scene.add(mesh);
    const godRays = new GodRaysEffect(this.camera.camera, mesh, { density: 1, decay: 0.94, clampMax: 0.95 });

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera.camera));
    this.composer.addPass(new EffectPass(this.camera.camera, dof));
    this.composer.addPass(new EffectPass(this.camera.camera, godRays));

    if (this.debug) {
      this.experience.gui
        .add(options, 'bokehScale')
        .min(0)
        .max(10)
        .step(0.001)
        .onChange((f) => dof.bokehScale = f);

      this.experience.gui
        .add(options, 'focalLength')
        .min(0)
        .max(1)
        .step(0.00001)
        .onChange((f) => dof.circleOfConfusionMaterial.uniforms.focalLength.value = f);

      this.experience.gui
        .add(options, 'focusDistance')
        .min(0)
        .max(1)
        .step(0.00001)
        .onChange((f) => dof.circleOfConfusionMaterial.uniforms.focusDistance.value = f);
    }
  }

  resize() {
    this.renderer.setSize(this.config.width, this.config.height);
    this.renderer.setPixelRatio(this.renderer.capabilities.isWebGL2 ? this.config.pixelRatio : 2);
  }

  destroy() {
    this.renderer.dispose();
  }
}
