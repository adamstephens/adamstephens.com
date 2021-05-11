import * as THREE from 'three';
import FloorMaterial from './materials/FloorMaterial';

export default class Floor {
  constructor(_options) {
    // Options
    this.experience = _options.experience;
    this.config = this.experience.config;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.composition = this.experience.composition;
    this.resources = this.experience.resources;
    this.colors = this.experience.colors;

    this.setLathe();
  }

  setLathe() {
    this.lathe = {};
    this.lathe.count = 15;

    this.lathe.points = [];
    for (let i = 0; i < this.lathe.count; i += 1) {
      this.lathe.points.push(
        new THREE.Vector2(
          ((i / this.lathe.count) ** (0.3)) * 25,
          Math.max(0, ((i - 1) / this.lathe.count) * 25),
        ),
      );
    }

    this.lathe.geometry = new THREE.LatheBufferGeometry(this.lathe.points);

    this.lathe.material = new FloorMaterial();
    this.lathe.material.uniforms.uColorInner.value = this.colors.floorInner.instance;
    this.lathe.material.uniforms.uColorOuter.value = this.colors.floorOuter.instance;

    this.lathe.mesh = new THREE.Mesh(this.lathe.geometry, this.lathe.material);
    this.lathe.mesh.receiveShadow = true;
    this.lathe.mesh.material.needsUpdate = true;
    this.scene.add(this.lathe.mesh);
  }

  destroy() {
    this.lathe.geometry.dispose();
    this.lathe.material.dispose();
  }
}
