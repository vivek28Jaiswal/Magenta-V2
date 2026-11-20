import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform int   uShapeType;

const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;

const int MAX_CLICKS = 10;
uniform vec2  uClickPos[MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
    a = floor(a);
    return fract(a.x / 2. + a.y * a.y * .75);
}

#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.
#define FBM_SCALE       4.0

float hash11(float n) { return fract(sin(n)*43758.5453); }

float vnoise(vec3 p) {
    vec3 ip = floor(p);
    vec3 fp = fract(p);

    float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
    float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
    float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
    float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
    float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
    float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
    float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
    float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));

    vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);

    float x00 = mix(n000, n100, w.x);
    float x10 = mix(n010, n110, w.x);
    float x01 = mix(n001, n101, w.x);
    float x11 = mix(n011, n111, w.x);

    float y0  = mix(x00, x10, w.y);
    float y1  = mix(x01, x11, w.y);

    return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t) {
    vec3 p   = vec3(uv * FBM_SCALE, t);
    float amp  = 1.;
    float freq = 1.;
    float sum  = 1.;

    for (int i = 0; i < FBM_OCTAVES; ++i) {
        sum  += amp * vnoise(p * freq);
        freq *= FBM_LACUNARITY;
        amp  *= FBM_GAIN;
    }
    
    return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov) {
    float r = sqrt(cov) * .25;
    float d = length(p - 0.5) - r;
    float aa = 0.5 * fwidth(d);
    return cov * (1.0 - smoothstep(-aa, aa, d * 2.));
}

void main() {
    float pixelSize = uPixelSize;
    vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
    float aspectRatio = uResolution.x / uResolution.y;

    vec2 pixelId = floor(fragCoord / pixelSize);
    vec2 pixelUV = fract(fragCoord / pixelSize); 

    float cellPixelSize = 8. * pixelSize;
    vec2 cellId = floor(fragCoord / cellPixelSize);
    vec2 cellCoord = cellId * cellPixelSize;
    
    vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

    float feed = fbm2(uv, uTime * 0.05);
    feed = feed * 0.55 - 0.60;

    const float speed     = 0.35;
    const float thickness = 0.12;
    const float dampT     = 0.9;
    const float dampR     = 8.0;

    for (int i = 0; i < MAX_CLICKS; ++i) {
        vec2 pos = uClickPos[i];
        if (pos.x < 0.0) continue;

        vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution) )) * vec2(aspectRatio, 1.0);

        float t = max(uTime - uClickTimes[i], 0.0);
        float r = distance(uv, cuv);

        float waveR = speed * t;
        float ring  = exp(-pow((r - waveR) / thickness, 2.0));
        float atten = exp(-dampT * t) * exp(-dampR * r);
        feed = max(feed, ring * atten);
    }

    float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
    float bw    = step(0.5, feed + bayer);

    float coverage = bw;
    float M = coverage;
    if (uShapeType == SHAPE_CIRCLE) {
        M = maskCircle(pixelUV, coverage);
    }

    vec3 color = uColor; 
    fragColor = vec4(color, M * 0.75);
}
`;

export default function BayerDitherBackground({
  color = '#E05A38',
  pixelSize = 4,
  shape = 'square',
  className = '',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId;
    const MAX_CLICKS = 10;

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'auto';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: true });
    if (!gl) {
      console.warn('WebGL2 not supported for Bayer dither');
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      context: gl,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const uniforms = {
      uResolution: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uClickPos: {
        value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)),
      },
      uClickTimes: { value: new Float32Array(MAX_CLICKS) },
      uShapeType: { value: shape === 'circle' ? 1 : 0 },
      uPixelSize: { value: pixelSize },
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      glslVersion: THREE.GLSL3,
      transparent: true,
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    const resize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener('resize', resize);
    resize();

    // Click & pointer interactivity
    let clickIx = 0;
    const triggerRipple = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const fx = (clientX - rect.left) * (canvas.width / rect.width);
      const fy = (rect.height - (clientY - rect.top)) * (canvas.height / rect.height);

      uniforms.uClickPos.value[clickIx].set(fx, fy);
      uniforms.uClickTimes.value[clickIx] = uniforms.uTime.value;
      clickIx = (clickIx + 1) % MAX_CLICKS;
    };

    const handlePointerDown = (e) => {
      triggerRipple(e.clientX, e.clientY);
    };

    // Also trigger subtle ripple on window click within hero
    window.addEventListener('pointerdown', handlePointerDown);

    // Initial ripple for dramatic entrance
    setTimeout(() => {
      triggerRipple(window.innerWidth * 0.5, window.innerHeight * 0.35);
    }, 400);

    const clock = new THREE.Clock();
    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
      material.dispose();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [color, pixelSize, shape]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden select-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
