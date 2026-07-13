import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const PhysicsScene = dynamic(() => import('../components/PhysicsScene'), { ssr: false });

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Head>
        <title>物理エンジン実験場</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <canvas id="renderCanvas"></canvas>

      <div id="panel" className={open ? 'open' : ''}>
        {/* モバイル: ドロワーハンドル（タップで展開/収納） */}
        <div id="drawerHandle" onClick={() => setOpen(o => !o)}>
          <span className="handle-bar"></span>
          <span className="handle-label">物理エンジン実験場 {open ? '▼' : '▲'}</span>
        </div>

        {/* デスクトップタイトル */}
        <h2 className="desktop-title">物理エンジン実験場</h2>

        {/* スポーン（モバイル collapsed 時も見える） */}
        <section id="spawnSection">
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

        {/* 物理パラメータ（モバイル collapsed 時は隠れる） */}
        <section id="physicsParams">
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

        <section className="hint">
          <p className="desktop-hint">ドラッグ: 視点回転　ホイール: ズーム</p>
          <p className="mobile-hint">1本指: 視点回転　ピンチ: ズーム</p>
          <p id="bodyCount">オブジェクト数: 0</p>
        </section>
      </div>

      <PhysicsScene />
    </>
  );
}
