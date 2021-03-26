import * as THREE from 'three';

import RiverMaterial from './materials/RiverMaterial';

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

    this.setTerrain();
    this.setRiver();

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

  setTerrain() {
    // Set up
    this.terrain = {};

    // Model
    this.terrain.model = this.resources.items.londonTerrain.scene;

    // Apply baked texture and add to scene
    // this.baked.apply(this.dog.model);
    this.group.add(this.terrain.model);
  }

  setRiver() {
    this.river = {};

    this.river.geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
    this.river.material = new RiverMaterial();
    this.river.mesh = new THREE.Mesh(
      this.river.geometry,
      this.river.material,
    );

    this.river.mesh.rotation.x = -Math.PI * 0.5;
    this.river.mesh.rotation.z = -Math.PI * 0;
    this.river.mesh.position.y = -0.2;

    this.group.add(this.river.mesh);

    if (this.debug) {
      this.experience.gui.add(this.river.material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001)
        .name('uBigWavesElevation');
      this.experience.gui.add(this.river.material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001)
        .name('uBigWavesFrequencyX');
      this.experience.gui.add(this.river.material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001)
        .name('uBigWavesFrequencyY');
      this.experience.gui.add(this.river.material.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001)
        .name('uBigWavesSpeed');

      this.experience.gui.add(this.river.material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001)
        .name('uSmallWavesElevation');
      this.experience.gui.add(this.river.material.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001)
        .name('uSmallWavesFrequency');
      this.experience.gui.add(this.river.material.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001)
        .name('uSmallWavesSpeed');
    }
  }

  update() {
    this.river.material.uniforms.uTime.value = this.time.elapsedTime;
  }

  destroy() {
    this.shadow.geometry.dispose();
    this.shadow.material.dispose();
    this.baked.material.dispose();
  }
}
