import * as THREE from 'three';

import shaderFragment from '../shaders/shadow/fragment.glsl';
import shaderVertex from '../shaders/shadow/vertex.glsl';

// eslint-disable-next-line no-unused-vars
export default function shadowMaterial(_parameters = {}) {
  const uniforms = {
    uColor: { value: null },
    uLightColor: { value: null },
    uMask: { value: null },
    uLightMask: { value: null },
    uAlpha: { value: null },
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
    transparent: true,
    depthTest: true,
    depthWrite: false,
    lights: false,
    uniforms,
    extensions,
    defines,
    vertexShader: shaderVertex,
    fragmentShader: shaderFragment,
  });

  // const material = new THREE.MeshBasicMaterial({
  //   map: _parameters.map,
  // });

  return material;
}
