import * as THREE from "three";

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Coroa de molar estilizada: esfera deformada em "quadrado arredondado",
 * com quatro cúspides suaves, sulcos centrais e colo (região cervical) afinado.
 */
export function createCrownGeometry(detail = 1) {
  const geo = new THREE.SphereGeometry(1, Math.round(128 * detail), Math.round(96 * detail));
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const cusps = [
    [0.42, 0.4],
    [-0.42, 0.4],
    [0.42, -0.4],
    [-0.44, -0.38],
  ];
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    let { x, y, z } = v;
    // seção horizontal em superelipse (quadrado arredondado)
    const theta = Math.atan2(z, x);
    const n = 3.2;
    const sq = 1 / Math.pow(Math.pow(Math.abs(Math.cos(theta)), n) + Math.pow(Math.abs(Math.sin(theta)), n), 1 / n);
    const k = 0.62 + 0.38 * sq;
    x *= k * 1.02;
    z *= k * 0.94;

    if (y > 0) {
      y *= 0.78;
      // cúspides
      const top = smoothstep(0.25, 0.85, v.y);
      let bump = 0;
      for (const [cx, cz] of cusps) bump += Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / 0.09);
      // sulcos (fissuras) em cruz
      const groove = Math.exp(-(x * x) / 0.012) * 0.7 + Math.exp(-(z * z) / 0.016) * 0.55;
      y += top * (0.16 * bump - 0.12 * groove);
      // achatamento leve do topo
      y -= top * 0.06;
    } else {
      // colo: estreita conforme desce
      const t = -v.y;
      const neck = 1 - 0.3 * Math.pow(t, 1.4);
      x *= neck;
      z *= neck;
      y *= 0.62;
    }
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Raiz cônica levemente curvada (LatheGeometry). */
export function createRootGeometry(length = 1.35, radius = 0.36, detail = 1) {
  const pts: THREE.Vector2[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = radius * Math.pow(1 - t, 0.62) * (1 - 0.08 * Math.sin(t * Math.PI));
    pts.push(new THREE.Vector2(Math.max(r, 0.004), -t * length));
  }
  pts[pts.length - 1] = new THREE.Vector2(0.0, -length - 0.02);
  const geo = new THREE.LatheGeometry(pts, Math.round(64 * detail));
  // curvatura suave
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = -y / length;
    pos.setX(i, pos.getX(i) + 0.12 * t * t);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Forma orgânica (blob) para os diferenciais. */
export function createBlobGeometry(detail = 1) {
  const geo = new THREE.IcosahedronGeometry(0.72, Math.round(24 * detail));
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n =
      0.12 * Math.sin(v.x * 3.1 + v.y * 1.7) +
      0.08 * Math.sin(v.y * 4.3 - v.z * 2.2) +
      0.06 * Math.sin(v.z * 5.1 + v.x * 1.3);
    v.multiplyScalar(1 + n);
    v.y *= 0.86;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}
