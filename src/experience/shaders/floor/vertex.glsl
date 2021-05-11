uniform vec3 uColorInner;
uniform vec3 uColorOuter;
varying vec3 vColor;
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  
  float distanceToCenter = length(modelPosition) * 0.04;
  distanceToCenter += 0.05;
  distanceToCenter = clamp(distanceToCenter, 0.0, 1.0);
  // distanceToCenter = 1.0 - pow(1.0 - distanceToCenter, 0.5);
  // vColor = vec3(distanceToCenter);
  vColor = mix(uColorInner, uColorOuter, distanceToCenter);
}