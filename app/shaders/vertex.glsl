attribute vec2 uv;
attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uDirection;
uniform float uMultiplier;
uniform float uTime;

varying float vDisplacement;
varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 newPosition = position;

  float z = cos(uTime + newPosition.x * mix(1.0, 3.0, uMultiplier));
  newPosition.z += z * (position.x - uDirection) * 0.4;
  vDisplacement = newPosition.z;
  newPosition.z *= uMultiplier;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
