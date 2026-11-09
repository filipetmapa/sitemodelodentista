"use client";

import { ContactShadows, Environment, Float, Lightformer, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createBlobGeometry, createCrownGeometry, createRootGeometry } from "./geometry";
import { pillarState, toothState } from "./store";

const GOLD = "#C5A46D";

/** Iluminação de estúdio sem dependências externas (lightformers customizados). */
export function StudioEnvironment({ intensity = 1, backdrop = "#2a1218" }: { intensity?: number; backdrop?: string }) {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={[backdrop]} />
      <Lightformer form="rect" intensity={1.4 * intensity} color="#ffe9c9" position={[0, -1, 5]} scale={[8, 2, 1]} />
      <Lightformer form="rect" intensity={2.4 * intensity} color="#fff6ea" position={[0, 5, -2]} scale={[10, 3, 1]} rotation-x={Math.PI / 2} />
      <Lightformer form="rect" intensity={1.6 * intensity} color="#fff1df" position={[-5, 1, 1]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" intensity={1.2 * intensity} color={GOLD} position={[5, 0.5, -1]} scale={[2, 6, 1]} rotation-y={-Math.PI / 2} />
      <Lightformer form="ring" intensity={0.8 * intensity} color="#ffffff" position={[0, 1, 5]} scale={3} />
    </Environment>
  );
}

function usePorcelain(roughness = 0.22) {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f3ebdf"),
        roughness,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        ior: 1.5,
        envMapIntensity: 1.1,
      }),
    [roughness],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

function useGold(roughness = 0.28) {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color(GOLD), metalness: 1, roughness, envMapIntensity: 1.2 }),
    [roughness],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

function useDisposable<T extends THREE.BufferGeometry>(factory: () => T, deps: unknown[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const geo = useMemo(factory, deps);
  useEffect(() => () => geo.dispose(), [geo]);
  return geo;
}

/** Molar estilizado em porcelana: escultura de galeria. */
export function Tooth({ detail = 1, interactive = true, staticPose = false }: { detail?: number; interactive?: boolean; staticPose?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const crown = useDisposable(() => createCrownGeometry(detail), [detail]);
  const root = useDisposable(() => createRootGeometry(1.1, 0.42, detail), [detail]);
  const root2 = useDisposable(() => createRootGeometry(0.98, 0.38, detail), [detail]);
  const porcelain = usePorcelain(0.2);
  const tilt = useRef({ x: 0, z: 0 });
  const kickSpin = useRef(0);
  const lastKick = useRef(0);

  useFrame((_, delta) => {
    if (!group.current || !spin.current || staticPose) return;
    const d = Math.min(delta, 0.05);
    // rotação contínua lenta + perspectiva ligada ao scroll
    spin.current.rotation.y += d * 0.18;
    if (toothState.kick !== lastKick.current) {
      lastKick.current = toothState.kick;
      kickSpin.current += 0.55;
    }
    const k = kickSpin.current * Math.min(1, d * 4);
    kickSpin.current -= k;
    spin.current.rotation.y += k;
    const p = toothState.progress;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, p * Math.PI * 0.9, 0.08);
    // inclinação até 8° seguindo o ponteiro (interpolação suave)
    const max = THREE.MathUtils.degToRad(8);
    const tx = interactive ? toothState.pointerY * max : 0;
    const tz = interactive ? -toothState.pointerX * max : 0;
    tilt.current.x += (tx - tilt.current.x) * 0.06;
    tilt.current.z += (tz - tilt.current.z) * 0.06;
    group.current.rotation.x = 0.18 + tilt.current.x;
    group.current.rotation.z = tilt.current.z;
  });

  return (
    <group ref={group} rotation={[0.18, staticPose ? 0.6 : 0, 0]}>
      <group ref={spin} position={[0, 0.25, 0]}>
        <mesh geometry={crown} material={porcelain} scale={[0.95, 0.95, 0.95]} />
        <mesh geometry={root} material={porcelain} position={[-0.36, -0.25, 0.08]} rotation={[0.06, 0, -0.12]} scale={[-1, 1, 1]} />
        <mesh geometry={root2} material={porcelain} position={[0.38, -0.25, 0.1]} rotation={[0.04, 0, 0.1]} />
        <mesh geometry={root2} material={porcelain} position={[0.02, -0.25, -0.32]} rotation={[-0.14, 0, 0]} scale={[0.85, 0.9, 0.85]} />
      </group>
    </group>
  );
}

function Pedestal() {
  const gold = useGold(0.42);
  return (
    <mesh position={[0, -1.62, 0]} material={gold}>
      <cylinderGeometry args={[1.05, 1.05, 0.03, 128]} />
    </mesh>
  );
}

function RimLight() {
  const light = useRef<THREE.SpotLight>(null);
  useFrame(() => {
    if (!light.current) return;
    const since = (performance.now() - toothState.kick) / 1000;
    const flash = toothState.kick ? Math.exp(-since / 0.45) : 0;
    light.current.intensity = 26 + 60 * flash;
  });
  return <spotLight ref={light} position={[-3.5, 2.5, -3]} angle={0.6} penumbra={1} color={GOLD} intensity={26} decay={1.4} />;
}

/** Câmera ligada ao progresso da seção (perspectiva sincronizada ao scroll). */
function ScrollCamera() {
  const cam = useRef<THREE.PerspectiveCamera>(null);
  useFrame(() => {
    if (!cam.current) return;
    const p = toothState.progress;
    const target = new THREE.Vector3(Math.sin(p * 0.8) * 0.6, 1.1 + p * 0.5, 6.6 - p * 0.8);
    cam.current.position.lerp(target, 0.08);
    cam.current.lookAt(0, -0.35, 0);
  });
  return <PerspectiveCamera ref={cam} makeDefault position={[0, 1.1, 6.6]} fov={30} />;
}

export function ToothScene({ detail = 1, interactive = true, staticPose = false }: { detail?: number; interactive?: boolean; staticPose?: boolean }) {
  return (
    <>
      {staticPose ? <PerspectiveCamera makeDefault position={[0, 1.1, 6.6]} fov={30} rotation={[-0.21, 0, 0]} /> : <ScrollCamera />}
      <StudioEnvironment />
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 5]} intensity={2.1} color="#fff0dc" />
      <RimLight />
      <Tooth detail={detail} interactive={interactive} staticPose={staticPose} />
      <Pedestal />
      <ContactShadows position={[0, -1.6, 0]} opacity={0.55} blur={2.4} scale={4} far={2.2} resolution={256} color="#12060a" frames={1} />
    </>
  );
}

// ---------------- Diferenciais ----------------

function Spinner({ index, children, speed = 0.25 }: { index: number; children: React.ReactNode; speed?: number }) {
  const ref = useRef<THREE.Group>(null);
  const v = useRef(speed);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = pillarState.hovered === index ? speed * 4 : speed;
    v.current += (target - v.current) * 0.06;
    ref.current.rotation.y += Math.min(delta, 0.05) * v.current;
  });
  return <group ref={ref}>{children}</group>;
}

function TwistedRing({ detail }: { detail: number }) {
  const gold = useGold(0.22);
  const geo = useDisposable(() => new THREE.TorusKnotGeometry(0.62, 0.12, Math.round(220 * detail), Math.round(28 * detail), 1, 3), [detail]);
  return <mesh geometry={geo} material={gold} rotation={[0.5, 0, 0.3]} scale={0.72} />;
}

function CrackedSphere({ detail }: { detail: number }) {
  const porcelain = usePorcelain(0.24);
  const gold = useGold(0.25);
  const sphere = useDisposable(() => new THREE.SphereGeometry(0.72, Math.round(96 * detail), Math.round(64 * detail)), [detail]);
  const seam = useDisposable(() => new THREE.TorusGeometry(0.716, 0.018, 12, Math.round(160 * detail)), [detail]);
  return (
    <group rotation={[0.3, 0, 0.2]}>
      <mesh geometry={sphere} material={porcelain} />
      <mesh geometry={seam} material={gold} rotation={[Math.PI / 2.4, 0.3, 0]} />
    </group>
  );
}

function OrganicForm({ detail }: { detail: number }) {
  const mat = usePorcelain(0.62);
  const geo = useDisposable(() => createBlobGeometry(detail), [detail]);
  return <mesh geometry={geo} material={mat} />;
}

function Discs() {
  const porcelain = usePorcelain(0.3);
  const gold = useGold(0.26);
  return (
    <group rotation={[1.15, 0.3, 0.2]}>
      <mesh material={porcelain} position={[-0.12, 0, 0.05]}>
        <cylinderGeometry args={[0.62, 0.62, 0.09, 96]} />
      </mesh>
      <mesh material={gold} position={[0.24, 0.16, -0.12]} rotation={[0.12, 0, -0.1]}>
        <cylinderGeometry args={[0.46, 0.46, 0.05, 96]} />
      </mesh>
    </group>
  );
}

export function PillarScene({ index, detail = 1, animate = true }: { index: number; detail?: number; animate?: boolean }) {
  const object =
    index === 0 ? (
      <TwistedRing detail={detail} />
    ) : index === 1 ? (
      <CrackedSphere detail={detail} />
    ) : index === 2 ? (
      <OrganicForm detail={detail} />
    ) : (
      <Discs />
    );
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 3.4]} fov={32} />
      <StudioEnvironment intensity={0.9} backdrop="#d9c9b3" />
      <ambientLight intensity={0.25} />
      <directionalLight position={[2, 3, 4]} intensity={1.8} color="#fff0dc" />
      {animate ? (
        <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.35} floatingRange={[-0.06, 0.06]}>
          <Spinner index={index}>{object}</Spinner>
        </Float>
      ) : (
        object
      )}
    </>
  );
}
