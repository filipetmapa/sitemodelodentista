/** Estado compartilhado entre o DOM (scroll/hover) e as cenas 3D (lido em useFrame). */
export const toothState = {
  progress: 0, // progresso da seção de tratamentos (0–1)
  active: 0, // tratamento em destaque
  kick: 0, // timestamp da última troca de tratamento (reação do dente)
  pointerX: 0, // -1..1
  pointerY: 0, // -1..1
};

export const pillarState = {
  hovered: -1,
};

export function markToothKick(index: number) {
  if (toothState.active !== index) {
    toothState.active = index;
    toothState.kick = performance.now();
  }
}

export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function isLowPower(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency || 4;
  return cores <= 4;
}
