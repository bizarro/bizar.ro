precision highp float;

uniform float uAlpha;
uniform float uAlphaDelta;
uniform float uAlphaMultiplier;
uniform float uMultiplier;

uniform sampler2D tMap;

varying float vDisplacement;
varying vec2 vUv;

void main() {
  vec3 color = texture2D(tMap, vUv).rgb;

  if (vDisplacement > 0.0) {
    color += vDisplacement * mix(0.5, 1.0, uMultiplier);
  }

  gl_FragColor.rgb = color;
  gl_FragColor.a = mix(uAlpha, 1.0, uAlphaMultiplier * uAlphaDelta);
}
