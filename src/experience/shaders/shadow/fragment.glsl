uniform vec3 uColor;
uniform vec3 uLightColor;
uniform sampler2D uMask;
uniform sampler2D uLightMask;
uniform float uAlpha;

varying vec2 vUv;

void main()
{
  float maskStrength = texture2D(uMask, vUv).r;
  float lightMaskStrength = texture2D(uLightMask, vUv).r;
  float mixPoint = (lightMaskStrength - maskStrength) + 0.5;
  vec3 mixColor = mix(uColor, uLightColor, mixPoint);
  gl_FragColor = vec4(mixColor, max(maskStrength, lightMaskStrength) * uAlpha);
}