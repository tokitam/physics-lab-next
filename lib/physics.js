import { MeshBuilder, StandardMaterial, Color3, Vector3, Quaternion } from '@babylonjs/core';
import { PhysicsAggregate, PhysicsShapeType } from '@babylonjs/core/Physics/v2';

const BODY_LIMIT = 100;
const SPAWN_Y = 10;

const BALL_PALETTE = [
  [1, 0.25, 0.25],   // 赤
  [0.15, 0.55, 1],   // 青
  [0.15, 0.85, 0.35],// 緑
  [1, 0.82, 0.08],   // 黄
  [1, 0.42, 0.08],   // オレンジ
  [0.72, 0.18, 1],   // 紫
  [0.08, 0.88, 0.88],// シアン
];

const BOX_PALETTE = [
  [1, 0.28, 0.55],   // ピンク
  [0.28, 0.78, 1],   // スカイブルー
  [0.28, 0.88, 0.52],// ミント
  [1, 0.68, 0.08],   // アンバー
  [0.88, 0.32, 0.08],// テラコッタ
  [0.55, 0.28, 1],   // バイオレット
  [0.08, 1, 0.62],   // エメラルド
];

function randomColor(palette) {
  const [r, g, b] = palette[Math.floor(Math.random() * palette.length)];
  return new Color3(r, g, b);
}

function randomOffset() {
  return (Math.random() - 0.5) * 0.6;
}

function applyMaterial(agg, friction, restitution) {
  agg.shape.material = { friction, restitution };
}

export function spawnBall(scene, state) {
  if (state.bodies.length >= BODY_LIMIT) removeOldest(state);

  const mesh = MeshBuilder.CreateSphere('ball', { diameter: 1 }, scene);
  mesh.position.set(randomOffset(), SPAWN_Y + state.bodies.length * 0.1, randomOffset());

  const mat = new StandardMaterial('ballMat', scene);
  mat.diffuseColor = randomColor(BALL_PALETTE);
  mat.specularColor = new Color3(0.4, 0.4, 0.4);
  mesh.material = mat;

  const aggregate = new PhysicsAggregate(mesh, PhysicsShapeType.SPHERE, {
    mass: 1,
    friction: state.friction,
    restitution: state.restitution,
  }, scene);

  state.bodies.push({ mesh, aggregate });
}

export function spawnBox(scene, state, posOverride) {
  if (state.bodies.length >= BODY_LIMIT) removeOldest(state);

  const mesh = MeshBuilder.CreateBox('box', { width: 1.2, height: 0.6, depth: 0.6 }, scene);

  if (posOverride) {
    mesh.position.copyFrom(posOverride.position);
    mesh.rotationQuaternion = posOverride.rotation.clone();
  } else {
    mesh.position.set(randomOffset(), SPAWN_Y + state.bodies.length * 0.1, randomOffset());
    mesh.rotationQuaternion = Quaternion.Identity();
  }

  const mat = new StandardMaterial('boxMat', scene);
  mat.diffuseColor = randomColor(BOX_PALETTE);
  mat.specularColor = new Color3(0.3, 0.3, 0.3);
  mesh.material = mat;

  const aggregate = new PhysicsAggregate(mesh, PhysicsShapeType.BOX, {
    mass: 1,
    friction: state.friction,
    restitution: state.restitution,
  }, scene);

  state.bodies.push({ mesh, aggregate });
}

export function spawnTower(scene, state) {
  const layers = 5;
  const cols = 3;
  const boxH = 0.65;
  const boxW = 1.25;
  const gap = 0.05;

  let idx = 0;
  for (let layer = 0; layer < layers; layer++) {
    for (let col = 0; col < cols; col++) {
      const delay = idx * 80;
      const isEven = layer % 2 === 0;
      const y = 0.5 + layer * (boxH + gap);
      const offset = (col - 1) * (boxW + gap);

      const position = isEven
        ? new Vector3(offset, y, 0)
        : new Vector3(0, y, offset);

      const rotation = isEven
        ? Quaternion.Identity()
        : Quaternion.RotationAxis(Vector3.Up(), Math.PI / 2);

      setTimeout(() => spawnBox(scene, state, { position, rotation }), delay);
      idx++;
    }
  }
}

export function clearAll(state) {
  for (const { mesh, aggregate } of state.bodies) {
    aggregate.dispose();
    mesh.dispose();
  }
  state.bodies = [];
}

export function updateAllMaterials(state) {
  const { friction, restitution } = state;
  for (const { aggregate } of state.bodies) {
    applyMaterial(aggregate, friction, restitution);
  }
}

function removeOldest(state) {
  const oldest = state.bodies.shift();
  if (oldest) {
    oldest.aggregate.dispose();
    oldest.mesh.dispose();
  }
}
