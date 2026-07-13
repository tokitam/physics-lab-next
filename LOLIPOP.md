# ロリポップ！デプロイナウ 記録

## 公開 URL

https://physics-lab.lolipop-now.app

## プロジェクト情報

| 項目             | 値                              |
|------------------|---------------------------------|
| プロジェクト名   | physics-lab                     |
| プロジェクト ID  | 01KXD37J267A0FEVDSXTYWPK89      |
| 初回デプロイ ID  | 01KXD37JER81J8MVCY4TA0K776      |
| フレームワーク   | next (Next.js)                  |
| ドメイン         | physics-lab.lolipop-now.app     |
| デプロイ日       | 2026-07-13                      |

## ローカルリンク

`.lolipop/project.json` にプロジェクト ID が保存済み。
このディレクトリで `lolipop deploy` を実行するだけで次回以降のデプロイが通る。

## よく使うコマンド

```bash
# 再デプロイ
cd ~/work/physics-lab-next
lolipop deploy

# ログ確認
lolipop project logs --latest

# 状態・URL 確認
lolipop project show
```

## 構成メモ

- **元プロジェクト**: `~/work/physics-lab/`（Vite + バニラ JS）
- **ロリポップが Next.js のみ対応**のため、このディレクトリ（`physics-lab-next`）に Next.js ラッパーとして移植
- 物理ロジック（`lib/physics.js`）は元プロジェクトからほぼそのまま流用
- Babylon.js は SSR 非対応のため `next/dynamic(..., { ssr: false })` でクライアント限定レンダリング
- Havok WASM は `public/HavokPhysics.wasm` に配置し `locateFile: () => '/HavokPhysics.wasm'` で明示指定（MIME type 問題回避）
- `next.config.ts` に `output: 'standalone'` を設定（ロリポップの必須要件）

## セキュリティ警告（参考）

デプロイ時に HIGH 脆弱性が 1 件検出された（ビルドは継続）:
- CVE-2026-48815: sigstore 3.1.0 → 4.1.1 で修正済み（Next.js 本体の依存）
