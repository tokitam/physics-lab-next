import Head from 'next/head';
import dynamic from 'next/dynamic';

const PhysicsScene = dynamic(() => import('../components/PhysicsScene'), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>物理エンジン実験場</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <canvas id="renderCanvas"></canvas>

      <div id="panel">
        <h2>物理エンジン実験場</h2>

        <section>
          <h3>物理パラメータ</h3>
          <label>
            摩擦係数 <span id="frictionVal">0.50</span>
            <input type="range" id="friction" min="0" max="1" step="0.01" defaultValue="0.5" />
          </label>
          <label>
            反発係数 <span id="restitutionVal">0.30</span>
            <input type="range" id="restitution" min="0" max="1" step="0.01" defaultValue="0.3" />
          </label>
          <label className="checkbox">
            <input type="checkbox" id="applyToExisting" defaultChecked />
            既存オブジェクトにも即適用
          </label>
        </section>

        <section>
          <h3>スポーン</h3>
          <div className="btn-row">
            <button id="btnBall">ボール追加</button>
            <button id="btnBox">箱を追加</button>
          </div>
          <div className="btn-row">
            <button id="btnTower">タワー建設</button>
            <button id="btnClear" className="danger">全削除</button>
          </div>
        </section>

        <section className="hint">
          <p>ドラッグ: 視点回転　ホイール: ズーム</p>
          <p id="bodyCount">オブジェクト数: 0</p>
        </section>
      </div>

      <PhysicsScene />
    </>
  );
}
