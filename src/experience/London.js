import * as THREE from 'three';

// import RiverMaterial from './materials/RiverMaterial';

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

    // Model
    this.river.model = this.resources.items.londonRiver.scene;
    this.river.texture = this.resources.items.riverTexture;

    this.river.material = new THREE.MeshStandardMaterial({
      map: this.river.texture,
      wireframe: false,
      transparent: true,
    });

    this.river.material.extensions = {
      derivatives: false,
    };

    this.customUniforms = {
      uTime: { value: 0 },
      uBigWavesElevation: { value: 0.06 },
      uBigWavesFrequency: { value: new THREE.Vector2(1.4, 1.5) },
      uBigWavesSpeed: { value: 0.418 },

      uSmallWavesElevation: { value: 0.061 },
      uSmallWavesFrequency: { value: 3 },
      uSmallWavesSpeed: { value: 0.2 },
      uSmallIterations: { value: 2 },
    };

    this.river.material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.customUniforms.uTime;
      shader.uniforms.uBigWavesElevation = this.customUniforms.uBigWavesElevation;
      shader.uniforms.uBigWavesFrequency = this.customUniforms.uBigWavesFrequency;
      shader.uniforms.uBigWavesSpeed = this.customUniforms.uBigWavesSpeed;
      shader.uniforms.uSmallWavesElevation = this.customUniforms.uSmallWavesElevation;
      shader.uniforms.uSmallWavesFrequency = this.customUniforms.uSmallWavesFrequency;
      shader.uniforms.uSmallWavesSpeed = this.customUniforms.uSmallWavesSpeed;
      shader.uniforms.uSmallIterations = this.customUniforms.uSmallIterations;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
          #include <common>
          uniform float uTime;
          uniform float uBigWavesElevation;
          uniform vec2 uBigWavesFrequency;
          uniform float uBigWavesSpeed;
          uniform float uSmallWavesElevation;
          uniform float uSmallWavesFrequency;
          uniform float uSmallWavesSpeed;
          uniform float uSmallIterations;
          varying float vElevation;
          varying vec3 vViewPositionn;
          vec4 permute(vec4 x)
          {
              return mod(((x*34.0)+1.0)*x, 289.0);
          }
          vec4 taylorInvSqrt(vec4 r)
          {
              return 1.79284291400159 - 0.85373472095314 * r;
          }
          vec3 fade(vec3 t)
          {
              return t*t*t*(t*(t*6.0-15.0)+10.0);
          }
          float cnoise(vec3 P)
          {
              vec3 Pi0 = floor(P); // Integer part for indexing
              vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
              Pi0 = mod(Pi0, 289.0);
              Pi1 = mod(Pi1, 289.0);
              vec3 Pf0 = fract(P); // Fractional part for interpolation
              vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
              vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
              vec4 iy = vec4(Pi0.yy, Pi1.yy);
              vec4 iz0 = Pi0.zzzz;
              vec4 iz1 = Pi1.zzzz;
              vec4 ixy = permute(permute(ix) + iy);
              vec4 ixy0 = permute(ixy + iz0);
              vec4 ixy1 = permute(ixy + iz1);
              vec4 gx0 = ixy0 / 7.0;
              vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
              gx0 = fract(gx0);
              vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
              vec4 sz0 = step(gz0, vec4(0.0));
              gx0 -= sz0 * (step(0.0, gx0) - 0.5);
              gy0 -= sz0 * (step(0.0, gy0) - 0.5);
              vec4 gx1 = ixy1 / 7.0;
              vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
              gx1 = fract(gx1);
              vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
              vec4 sz1 = step(gz1, vec4(0.0));
              gx1 -= sz1 * (step(0.0, gx1) - 0.5);
              gy1 -= sz1 * (step(0.0, gy1) - 0.5);
              vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
              vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
              vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
              vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
              vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
              vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
              vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
              vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
              vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
              g000 *= norm0.x;
              g010 *= norm0.y;
              g100 *= norm0.z;
              g110 *= norm0.w;
              vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
              g001 *= norm1.x;
              g011 *= norm1.y;
              g101 *= norm1.z;
              g111 *= norm1.w;
              float n000 = dot(g000, Pf0);
              float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
              float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
              float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
              float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
              float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
              float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
              float n111 = dot(g111, Pf1);
              vec3 fade_xyz = fade(Pf0);
              vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
              vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
              float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
              return 2.2 * n_xyz;
          }
      `,
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        `
          vec4 mvPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(mvPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                    sin(mvPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                    uBigWavesElevation;
  
  for(float i = 1.0; i <= 4.0; i++)
    {
        elevation -= abs(cnoise(vec3(mvPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }
  
  mvPosition.y += elevation;

  vec4 viewPosition = viewMatrix * mvPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vElevation = elevation;
      `,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
    varying float vElevation;`,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
        `vec3 normall = normalize( cross( dFdx( vViewPosition ), dFdy( vViewPosition ) ) );
  vec3 lightPos = normalize(vec3( - 8000, 2000, 1000));
  float lDot = dot(normall, lightPos);
  float volume = max(0.0, lDot);
  vec3 lightColor = mix(vec3(0.02,0.2,0.3), vec3(0.8,0.95,1), volume);
  gl_FragColor = vec4( lightColor * (outgoingLight ), 0.9 );`,
      );
    };

    this.river.mesh = this.river.model.children[0];
    this.river.mesh.material = this.river.material; // Update the material
    this.river.mesh.material.map.flipY = false;
    this.group.add(this.river.mesh);

    // this.river.geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
    // this.river.material = new RiverMaterial();
    // this.river.mesh = new THREE.Mesh(
    //   this.river.geometry,
    //   this.river.material,
    // );

    // this.river.mesh.rotation.x = -Math.PI * 0.5;
    // this.river.mesh.rotation.z = -Math.PI * 0;
    // this.river.mesh.position.y = -0.2;

    // this.group.add(this.river.mesh);

    // if (this.debug) {
    //   this.experience.gui.add(this.river.material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001)
    //     .name('uBigWavesElevation');
    //   this.experience.gui.add(this.river.material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001)
    //     .name('uBigWavesFrequencyX');
    //   this.experience.gui.add(this.river.material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001)
    //     .name('uBigWavesFrequencyY');
    //   this.experience.gui.add(this.river.material.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001)
    //     .name('uBigWavesSpeed');

    //   this.experience.gui.add(this.river.material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001)
    //     .name('uSmallWavesElevation');
    //   this.experience.gui.add(this.river.material.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001)
    //     .name('uSmallWavesFrequency');
    //   this.experience.gui.add(this.river.material.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001)
    //     .name('uSmallWavesSpeed');
    // }
  }

  update() {
    // this.river.material.uniforms.uTime.value = this.time.elapsedTime;
    this.customUniforms.uTime.value = this.time.elapsedTime;
  }

  destroy() {
    this.shadow.geometry.dispose();
    this.shadow.material.dispose();
    this.baked.material.dispose();
  }
}
