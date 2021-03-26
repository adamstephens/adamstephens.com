import * as THREE from 'three';

import shaderVertex from '../shaders/river/vertex.glsl';
import shaderFragment from '../shaders/river/fragment.glsl';

export default function riverMaterial() {
  const uniforms = {
    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.06 },
    uBigWavesFrequency: { value: new THREE.Vector2(1.4, 1.5) },
    uBigWavesSpeed: { value: 0.418 },

    uSmallWavesElevation: { value: 0.061 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    vertexShader: shaderVertex,
    fragmentShader: shaderFragment,
  });

  return material;
}
