# IAT（潜在連合テスト）実験アプリケーション

デモ動画Link => [https://www.youtube.com/watch?v=ISwm9zcTLC8](https://www.youtube.com/watch?v=ISwm9zcTLC8)

デモ体験Link => [https://z3cut10dxf.cognition.run](https://z3cut10dxf.cognition.run)

## 概要

このアプリケーションは、jsPsychライブラリを使用して作成された潜在連合テスト（IAT）です。特定の概念間の潜在的な関連を測定することを目的としています。この実験では、「男性-女性」および「体育会系-文化系」という対の概念間の関連を測定します。

## 機能

- **参加者情報の入力**: 実験開始時に参加者IDを入力します。
- **質問紙調査**: 年齢、性別、所属していた部活動、および特定の概念（体育会系、文化系）に対するジェンダーの印象について質問します。
- **IATの実施**: 7つのブロックから構成されるIATを実施します。
  - ブロック1: 「男性」と「女性」の分類練習
  - ブロック2: 「体育会系」と「文化系」の分類練習
  - ブロック3 & 4: 「男性または体育会系」と「女性または文化系」の組み合わせ
  - ブロック5: 「文化系」と「体育会系」の分類練習（カテゴリの配置を反転）
  - ブロック6 & 7: 「男性または文化系」と「女性または体育会系」の組み合わせ
- **データの保存**: 実験終了後、結果はCSVファイルとしてローカルに保存されます。ファイル名は `pre_` または `post_` と参加者IDから構成されます。

## 使用方法

1.  `index.html` または `index post.html` をウェブブラウザで開きます。
2.  画面の指示に従い、実験を開始します。
3.  参加者IDを入力し、質問に回答した後、IATが開始されます。
4.  キーボードの「E」キーと「I」キーを使用して、画面中央に表示される単語を左右のカテゴリに分類してください。
5.  実験が終了すると、結果が自動的にダウンロードされます。

## ファイル構成

- `index.html`: IAT実験（事前測定用）のメインファイルです。
- `index post.html`: IAT実験（事後測定用）のメインファイルです。
- `script.js`: 事前測定用のIAT実験のロジックを記述したJavaScriptファイルです。
- `script_post.js`: 事後測定用のIAT実験のロジックを記述したJavaScriptファイルです。
- `style.css`: 実験画面のスタイルを定義したCSSファイルです。
- `data/`: 実験結果のデータ分析用のスクリプトや、生データが格納されるディレクトリです。
- `package.json`: プロジェクトの依存関係を定義したファイルです。

## 依存ライブラリ

この実験では、以下のjsPsychライブラリを使用しています。

- jspsych
- @jspsych/plugin-iat-html
- @jspsych/plugin-html-keyboard-response
- @jspsych/plugin-survey-likert
- @jspsych/plugin-survey-multi-choice
- @jspsych/plugin-html-button-response
- @jspsych/plugin-fullscreen
- @jspsych/plugin-survey-text
