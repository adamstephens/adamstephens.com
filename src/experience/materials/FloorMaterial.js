import * as THREE from 'three';

import shaderFragment from '../shaders/floor/fragment.glsl';
import shaderVertex from '../shaders/floor/vertex.glsl';

// eslint-disable-next-line no-unused-vars
export default function floorMaterial(_parameters = {}) {
  const uniforms = {
    uColorInner: { value: null },
    uColorOuter: { value: null },
  };

  const extensions = {
    derivatives: false,
    fragDepth: false,
    drawBuffers: false,
    shaderTextureLOD: false,
  };

  const defines = {};

  const material = new THREE.ShaderMaterial({
    wireframe: false,
    transparent: false,
    depthTest: true,
    depthWrite: true,
    side: THREE.BackSide,
    lights: false,
    uniforms,
    extensions,
    defines,
    vertexShader: shaderVertex,
    fragmentShader: shaderFragment,
  });

  return material;
}
