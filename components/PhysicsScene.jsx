import { useEffect } from 'react';

export default function PhysicsScene() {
  useEffect(() => {
    let engine;

    async function init() {
      const [
        { Engine, Scene, Color4, Vector3, ArcRotateCamera,
          HemisphericLight, DirectionalLight, Color3,
          MeshBuilder, StandardMaterial, ShadowGenerator },
        { HavokPlugin, PhysicsAggregate, PhysicsShapeType },
        HavokPhysics,
        { spawnBall, spawnBox, spawnTower, clearAll, updateAllMaterials },
      ] = await Promise.all([
        import('@babylonjs/core'),
        import('@babylonjs/core/Physics/v2').then(async m => {
          const plugin = await import('@babylonjs/core/Physics/v2/Plugins/havokPlugin');
          return { ...m, ...plugin };
        }),
        import('@babylonjs/havok').then(m => m.default),
        import('../lib/physics.js'),
      ]);

      const canvas = document.getElementById('renderCanvas');
      engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

      const state = { bodies: [], friction: 0.5, restitution: 0.3 };

      const scene = new Scene(engine);
      scene.clearColor = new Color4(0.82, 0.83, 0.85, 1);

      const camera = new ArcRotateCamera('cam', -Math.PI / 4, Math.PI / 3, 22, Vector3.Zero(), scene);
      camera.attachControl(canvas, true);
      camera.lowerRadiusLimit = 5;
      camera.upperRadiusLimit = 60;
      camera.wheelPrecision = 3;

      const hemi = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
      hemi.intensity = 0.6;
      hemi.groundColor = new Color3(0.6, 0.62, 0.65);

      const sun = new DirectionalLight('sun', new Vector3(-1, -2, -1).normalize(), scene);
      sun.intensity = 1.2;
      sun.position = new Vector3(10, 20, 10);

      const shadows = new ShadowGenerator(1024, sun);
      shadows.useBlurExponentialShadowMap = true;

      const havok = await HavokPhysics({ locateFile: () => '/HavokPhysics.wasm' });
      const plugin = new HavokPlugin(true, havok);
      scene.enablePhysics(new Vector3(0, -9.81, 0), plugin);

      // 地面
      const ground = MeshBuilder.CreateBox('ground', { width: 20, height: 0.5, depth: 20 }, scene);
      ground.position.y = -0.25;
      const groundMat = new StandardMaterial('groundMat', scene);
      groundMat.diffuseColor = new Color3(0.68, 0.70, 0.74);
      groundMat.specularColor = Color3.Black();
      ground.material = groundMat;
      ground.receiveShadows = true;
      new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0, friction: 0.5 }, scene);

      // スポーン後のメッシュに影を自動付与
      const origPush = state.bodies.push.bind(state.bodies);
      state.bodies.push = (...items) => {
        for (const item of items) {
          item.mesh.receiveShadows = true;
          shadows.addShadowCaster(item.mesh);
        }
        return origPush(...items);
      };

      // UI バインド
      const frictionSlider = document.getElementById('friction');
      const frictionVal = document.getElementById('frictionVal');
      const restitutionSlider = document.getElementById('restitution');
      const restitutionVal = document.getElementById('restitutionVal');
      const applyToExisting = document.getElementById('applyToExisting');
      const bodyCount = document.getElementById('bodyCount');

      frictionSlider.addEventListener('input', () => {
        state.friction = parseFloat(frictionSlider.value);
        frictionVal.textContent = state.friction.toFixed(2);
        if (applyToExisting.checked) updateAllMaterials(state);
      });

      restitutionSlider.addEventListener('input', () => {
        state.restitution = parseFloat(restitutionSlider.value);
        restitutionVal.textContent = state.restitution.toFixed(2);
        if (applyToExisting.checked) updateAllMaterials(state);
      });

      document.getElementById('btnBall').addEventListener('click', () => spawnBall(scene, state));
      document.getElementById('btnBox').addEventListener('click', () => spawnBox(scene, state));
      document.getElementById('btnTower').addEventListener('click', () => spawnTower(scene, state));
      document.getElementById('btnClear').addEventListener('click', () => clearAll(state));

      scene.registerAfterRender(() => {
        bodyCount.textContent = `オブジェクト数: ${state.bodies.length}`;
      });

      engine.runRenderLoop(() => scene.render());
      window.addEventListener('resize', () => engine.resize());

      // 初期オブジェクト: ボール3つ・箱2つを時間差で落とす
      const initItems = [
        () => spawnBall(scene, state),
        () => spawnBall(scene, state),
        () => spawnBox(scene, state),
        () => spawnBall(scene, state),
        () => spawnBox(scene, state),
      ];
      initItems.forEach((fn, i) => setTimeout(fn, i * 120));
    }

    init().catch(console.error);

    return () => {
      engine?.dispose();
    };
  }, []);

  return null;
}
