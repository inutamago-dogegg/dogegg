# どぐえぐ Portfolio

東京科学大学デジタル創作同好会 traP でゲームを作っている どぐえぐ (@dogegg314) の個人ポートフォリオサイトです。

🔗 https://inutamago-dogegg.github.io/dogegg/

## 概要

- これまで制作したゲーム・謎解き作品の紹介 (Works)
- 経歴・スキル・自己紹介 (About)
- 執筆記事の一覧 (Articles)
- 各作品の詳細ダイアログでは、関連記事・X投稿・GitHub/Steamリンクなどをまとめて表示

## 技術スタック

- [Astro](https://astro.build) — 静的サイト生成
- [React](https://react.dev) — インタラクティブなUI部分
- TypeScript
- Tailwind CSS
- GitHub Actions + GitHub Pages でホスティング

OGP画像や関連リンクのサムネイルはビルド時に取得・キャッシュしており、外部サイトへの直リンクに頼らない構成になっています。

## プロジェクト構成

```text
/
├── public/               静的アセット
├── src/
│   ├── app/              Reactコンポーネント (UI本体)
│   ├── data/             プロフィール・作品データ
│   ├── lib/              OGP取得・画像キャッシュなどのユーティリティ
│   ├── pages/             各ページ (Astro)
│   └── styles/            スタイル定義
└── astro.config.mjs
```

## 開発

```sh
npm install       # 依存関係のインストール
npm run dev       # 開発サーバー起動 (http://localhost:4321)
npm run build     # 本番ビルド (astro check → astro build)
npm run preview   # ビルド結果をローカルでプレビュー
```

## デプロイ

`main` ブランチへの push (および毎日0時のcron) をトリガーに、GitHub Actions (`.github/workflows/pages.yml`) が自動ビルドして GitHub Pages に公開します。
