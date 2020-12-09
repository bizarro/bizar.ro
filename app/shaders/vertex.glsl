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

  newPosition.z += cos(uTime + newPosition.x * 3.0) * (position.x - uDirection) * 0.4 * uMultiplier;

  vDisplacement = newPosition.z;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
