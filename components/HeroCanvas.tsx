"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { Environment } from "@react-three/drei";
import { useTheme } from "next-themes";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Shape = "box" | "sphere" | "ico";

type BodySpec = {
  position: [number, number, number];
  rotation: [number, number, number];
  shape: Shape;
  scale: number;
};

const PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

function makeSpecs(count: number): BodySpec[] {
  const shapes: Shape[] = ["box", "sphere", "ico"];
  const rng = mulberry32(7);
  return Array.from({ length: count }, () => ({
    position: [(rng() - 0.5) * 14, (rng() - 0.5) * 8, (rng() - 0.5) * 4],
    rotation: [rng() * Math.PI, rng() * Math.PI, rng() * Math.PI],
    shape: shapes[Math.floor(rng() * shapes.length)],
    scale: 0.4 + rng() * 0.7,
  }));
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function FloatingBody({ spec, accent }: { spec: BodySpec; accent: string }) {
  const ref = useRef<RapierRigidBody>(null);
  const { pointer, camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const idleSeed = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    const body = ref.current;
    if (!body) return;

    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(PLANE, target.current);

    const t = body.translation();
    const dx = t.x - target.current.x;
    const dy = t.y - target.current.y;
    const dz = t.z - target.current.z;
    const dist2 = dx * dx + dy * dy + dz * dz;

    const radius = 3.5;
    if (dist2 < radius * radius && dist2 > 0.01) {
      const dist = Math.sqrt(dist2);
      const falloff = (1 - dist / radius) ** 2;
      const strength = 0.18 * falloff;
      body.applyImpulse({ x: (dx / dist) * strength, y: (dy / dist) * strength, z: (dz / dist) * strength * 0.4 }, true);
    }

    const time = state.clock.elapsedTime + idleSeed;
    body.applyTorqueImpulse(
      { x: Math.sin(time * 0.3) * 0.0008, y: Math.cos(time * 0.27) * 0.0008, z: Math.sin(time * 0.21) * 0.0006 },
      true,
    );

    const back = -t.z * 0.0004;
    body.applyImpulse({ x: -t.x * 0.0006, y: -t.y * 0.0006, z: back }, false);
  });

  const geom =
    spec.shape === "box" ? (
      <boxGeometry args={[spec.scale, spec.scale, spec.scale]} />
    ) : spec.shape === "sphere" ? (
      <sphereGeometry args={[spec.scale * 0.6, 24, 24]} />
    ) : (
      <icosahedronGeometry args={[spec.scale * 0.7, 0]} />
    );

  return (
    <RigidBody
      ref={ref}
      position={spec.position}
      rotation={spec.rotation}
      linearDamping={1.4}
      angularDamping={1.2}
      colliders={spec.shape === "sphere" ? "ball" : "hull"}
    >
      <mesh castShadow>
        {geom}
        <meshStandardMaterial color={accent} roughness={0.35} metalness={0.2} />
      </mesh>
    </RigidBody>
  );
}

function Scene({ count }: { count: number }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const accent = isDark ? "#6b7280" : "#cbd5e1";
  const specs = useMemo(() => makeSpecs(count), [count]);

  return (
    <>
      <ambientLight intensity={isDark ? 0.4 : 0.8} />
      <directionalLight position={[6, 8, 5]} intensity={isDark ? 0.8 : 1.1} />
      <Physics gravity={[0, 0, 0]} timeStep="vary">
        {specs.map((s, i) => (
          <FloatingBody key={i} spec={s} accent={accent} />
        ))}
      </Physics>
      <Environment preset="city" environmentIntensity={isDark ? 0.25 : 0.45} />
    </>
  );
}

export default function HeroCanvas({ count = 22 }: { count?: number }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene count={count} />
    </Canvas>
  );
}
