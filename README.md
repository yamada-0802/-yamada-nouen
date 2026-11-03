# 山田農園 GitHub Pages 作業版

正本: `yamada_codex_package/reference/desktop.png`、`mobile.png`。
写真が未提供のため写真枠を「写真未設定」としている非公開の作業版です。2027年度以降に実写真を設定できます。代替写真・架空投稿は使用していません。

## ローカル確認

このフォルダで `python3 -m http.server 8000` を実行し、http://localhost:8000 を開きます。JSON読み込みのため、HTMLファイルを直接開く方式では動作しません。

## 写真・設定

[更新手順](docs/写真と設定の更新.md)を参照。
`data/settings.json` の heroImage、aboutImage、productImage、infoImage に `assets/hero.jpg` 等の実在する写真の相対パスを設定します。写真はassets内に追加してください。画像が未指定・読み込み失敗の場合は「写真未設定」を維持します。

ギャラリーは `assets/gallery/` に写真、`data/gallery.json` に表示情報を保存します。小さいorder順に表示され、日付は未詳ならnullです。

お知らせは `data/news.json` に `[{"date":"実際のYYYY-MM-DD","text":"実際のお知らせ本文"}]` の形式で追加します。説明中の値はそのまま使わないでください。空配列なら「お知らせ未設定」です。

問い合わせ先は settings.json のcontactUrlに実際の https:// フォームURL、または mailto:メールアドレス を指定します。未設定では送信ボタンを出しません。InstagramとXも未設定時はリンクを作りません。

管理者用ボタンはGitHubのJSON編集画面に移動します。GitHubのログインと対象リポジトリへの書き込み権限が必要です。これはサイト内のアップロード管理画面ではありません。

## 公開前

個別写真、問い合わせ先、SNS、お知らせを設定。現状の水稲情報は既存サイトから維持しています。家族経営など未確認の紹介文は既存の紹介文を使用。詳細ボタンはスイカ情報を開閉します。

本番反映時は既存リポジトリのバックアップ後、index.html、css、js、data、assets、docsを配置し、Google所有権確認ファイルを維持してください。GitHub Settings → Pagesで現在の公開元を確認してから同じ公開設定を使用します。この作業版の作成だけでは本番に反映されません。
