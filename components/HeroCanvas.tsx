"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
// @ts-expect-error — troika-three-text ships no types
import { Text } from "troika-three-text";

type TextInstance = THREE.Mesh & {
  text: string;
  fontSize: number;
  fontWeight: string | number;
  letterSpacing: number;
  anchorX: string | number;
  anchorY: string | number;
  curveRadius: number;
  outlineWidth: number;
  sync: (cb?: () => void) => void;
  dispose: () => void;
};

type Props = {
  text: string;
  accentColor: string; // any CSS color (oklch, hex, rgb, ...)
  pulseSeq: number;
  onReady?: () => void;
};

const VERT_INJECT_PARS = /* glsl */ `
uniform float uTime;
uniform float uDisplace;

// 3D simplex noise — Ashima / Stefan Gustavson, MIT.
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
varying float vDisplaceAmt;
`;

const VERT_INJECT_BEGIN = /* glsl */ `
  vec3 _pos = transformed;
  float _n = snoise(_pos * 0.55 + vec3(uTime * 0.35, uTime * 0.22, uTime * 0.18));
  float _amt = _n * uDisplace;
  vDisplaceAmt = _n;
  transformed += normal * _amt;
`;

const FRAG_INJECT_PARS = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uColorTarget;
uniform float uColorMix;
varying float vDisplaceAmt;
`;

const FRAG_INJECT_OUTPUT = /* glsl */ `
  vec3 _baseCol = mix(uColor, uColorTarget, clamp(uColorMix, 0.0, 1.0));
  // tint the lit color rather than overwriting it, keeps lighting cues
  gl_FragColor.rgb = mix(gl_FragColor.rgb, _baseCol, 0.85);
  // subtle highlight on positive displacement crests
  gl_FragColor.rgb += vec3(0.10) * smoothstep(0.4, 1.0, vDisplaceAmt);
`;

function makeMaterial(): THREE.MeshStandardMaterial & {
  userData: { uniforms: Record<string, THREE.IUniform> };
} {
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.35,
    roughness: 0.45,
  });

  const uniforms: Record<string, THREE.IUniform> = {
    uTime: { value: 0 },
    uDisplace: { value: 0.04 },
    uColor: { value: new THREE.Color("#2dd4bf") },
    uColorTarget: { value: new THREE.Color("#2dd4bf") },
    uColorMix: { value: 1 },
  };

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>\n${VERT_INJECT_PARS}`,
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>\n${VERT_INJECT_BEGIN}`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>\n${FRAG_INJECT_PARS}`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `#include <opaque_fragment>\n${FRAG_INJECT_OUTPUT}`,
    );
  };

  // Stash the uniforms so the component can update them each frame.
  (mat as unknown as { userData: { uniforms: Record<string, THREE.IUniform> } })
    .userData.uniforms = uniforms;

  return mat as THREE.MeshStandardMaterial & {
    userData: { uniforms: Record<string, THREE.IUniform> };
  };
}

// Convert any CSS color (incl. oklch) → THREE.Color via the browser parser.
function cssColorToThree(css: string): THREE.Color {
  if (typeof window === "undefined") return new THREE.Color("#ffffff");
  const probe = document.createElement("div");
  probe.style.color = css;
  document.body.appendChild(probe);
  const parsed = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  const m = parsed.match(/rgba?\(([^)]+)\)/);
  if (!m) return new THREE.Color("#ffffff");
  const [r, g, b] = m[1].split(",").map((v) => parseFloat(v.trim()) / 255);
  return new THREE.Color(r, g, b);
}

const BASE_DISPLACE = 0.04;
const PULSE_DISPLACE = 0.18;
const PULSE_DURATION = 900; // ms
const COLOR_CROSSFADE = 600; // ms

function NameText({ text, accentColor, pulseSeq, onReady }: Props) {
  const { viewport, size, gl } = useThree();
  const readyFiredRef = useRef(false);
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<TextInstance | null>(null);
  const matRef = useRef<ReturnType<typeof makeMaterial> | null>(null);

  // Per-frame easing state
  const pulseStartRef = useRef<number | null>(null);
  const colorStartRef = useRef<number | null>(null);
  const lastSeqRef = useRef(pulseSeq);
  const lastColorRef = useRef<string>(accentColor);

  // Build the troika Text instance once.
  if (!textRef.current) {
    const t = new Text() as TextInstance;
    const mat = makeMaterial();
    t.material = mat;
    t.anchorX = "center";
    t.anchorY = "middle";
    t.curveRadius = 0;
    t.outlineWidth = 0;
    t.fontWeight = 1200;
    matRef.current = mat;
    textRef.current = t;
  }

  // Sync text content + size to viewport.
  useEffect(() => {
    const t = textRef.current;
    if (!t) return;
    t.text = text;
    (t as unknown as { font: string }).font = "/Geist/Geist-VariableFont_wght.ttf";
    t.letterSpacing = -0.035;
    t.anchorX = "left";
    t.anchorY = "middle";

    // Anchor the 3D text on top of the (transparent) DOM <h1id="hero-name">.
    // We compute the h1's bounding box relative to the canvas, then convert
    // pixel offsets into world units using viewport.width / size.width.
    const canvasEl = gl.domElement;
    const h1 = document.getElementById("hero-name");
    if (canvasEl && h1) {
      const canvasRect = canvasEl.getBoundingClientRect();
      const h1Rect = h1.getBoundingClientRect();

      const pxToWorldX = viewport.width / size.width;
      const pxToWorldY = viewport.height / size.height;

      const leftPx = h1Rect.left - canvasRect.left;
      const centerYPx = h1Rect.top + h1Rect.height / 2 - canvasRect.top;

      const leftWorld = (leftPx - size.width / 2) * pxToWorldX;
      // y inverted: top of canvas is +y in world.
      const centerYWorld = (size.height / 2 - centerYPx) * pxToWorldY;

      t.fontSize = h1Rect.height * 1.0 * pxToWorldY;
      t.position.x = leftWorld;
      t.position.y = centerYWorld;
    } else {
      t.fontSize = Math.min(viewport.width / 16, 0.95);
      t.position.x = 0;
      t.position.y = 0;
    }

    t.sync(() => {
      if (!readyFiredRef.current) {
        readyFiredRef.current = true;
        onReady?.();
      }
    });
  }, [text, viewport.width, viewport.height, size.width, size.height, gl, onReady]);

  // Trigger pulse + color crossfade when the role index changes.
  useEffect(() => {
    if (!matRef.current) return;
    const u = matRef.current.userData.uniforms;
    if (pulseSeq !== lastSeqRef.current) {
      pulseStartRef.current = performance.now();
      lastSeqRef.current = pulseSeq;
    }
    if (accentColor !== lastColorRef.current) {
      // shift current → uColor (the "from" side); set uColorTarget to new.
      const newCol = cssColorToThree(accentColor);
      // Snapshot current displayed color into uColor.
      const cur = (u.uColor.value as THREE.Color).clone();
      const tgt = (u.uColorTarget.value as THREE.Color).clone();
      const mix = u.uColorMix.value as number;
      const shown = cur.clone().lerp(tgt, Math.max(0, Math.min(1, mix)));
      (u.uColor.value as THREE.Color).copy(shown);
      (u.uColorTarget.value as THREE.Color).copy(newCol);
      u.uColorMix.value = 0;
      colorStartRef.current = performance.now();
      lastColorRef.current = accentColor;
    }
  }, [pulseSeq, accentColor]);

  // Initial color (mount)
  useEffect(() => {
    if (!matRef.current) return;
    const u = matRef.current.userData.uniforms;
    const c = cssColorToThree(accentColor);
    (u.uColor.value as THREE.Color).copy(c);
    (u.uColorTarget.value as THREE.Color).copy(c);
    u.uColorMix.value = 1;
    lastColorRef.current = accentColor;
    // run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state) => {
    if (!matRef.current) return;
    const u = matRef.current.userData.uniforms;
    u.uTime.value = state.clock.elapsedTime;

    // Displacement pulse easing
    const now = performance.now();
    if (pulseStartRef.current !== null) {
      const t = (now - pulseStartRef.current) / PULSE_DURATION;
      if (t >= 1) {
        u.uDisplace.value = BASE_DISPLACE;
        pulseStartRef.current = null;
      } else {
        // ease: quick rise then ease-out back to base
        const rise = Math.min(t / 0.18, 1);
        const fall = Math.max(0, (t - 0.18) / 0.82);
        const e = rise * (1 - 0.5 + 0.5 * Math.cos(Math.PI * fall));
        u.uDisplace.value = BASE_DISPLACE + (PULSE_DISPLACE - BASE_DISPLACE) * e;
      }
    }

    // Color crossfade easing
    if (colorStartRef.current !== null) {
      const t = (now - colorStartRef.current) / COLOR_CROSSFADE;
      if (t >= 1) {
        u.uColorMix.value = 1;
        colorStartRef.current = null;
      } else {
        u.uColorMix.value = 0.5 - 0.5 * Math.cos(Math.PI * t);
      }
    }
  });

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      const t = textRef.current;
      if (t) t.dispose();
    };
  }, []);

  return (
    <group ref={groupRef}>
      <primitive object={textRef.current} />
    </group>
  );
}

function Scene(props: Props) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <NameText {...props} />
    </>
  );
}

export default function HeroCanvas(props: Props) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 5], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
