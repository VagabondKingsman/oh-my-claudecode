# vibecodekit-hybrid-rri-ui — 日本語ロケール

> `OMC_LOCALE=ja` 検出時に追加読み込みされるオーバーレイ。
> 正本 SKILL: `skills/vibecodekit-hybrid-rri-ui/SKILL.md` (英語)。

## 日本語プロダクト向け追加チェック

- **縦組み混在の LCP/CLS** — 縦書き／横書きが混在するページで CLS が 0.1 以下を保てるか。
- **ルビ（振り仮名）レイアウト** — `<ruby>` 要素が iOS Safari／Android Chrome で正しくレンダリングされるか。
- **行間／字間** — 16px 以上、行高 1.6 以上、`letter-spacing` を Mincho／Gothic で混在させない。
- **半角カナ混入** — エクスポート／メール送信で `ｶﾅ` が混入しないか（A11y 上も読み上げが破綻）。
- **絵文字差異** — Apple／Google／Twemoji で意味が変わる絵文字（🍑／🤰／👨‍👩‍👧）の使用を避けるか、画像化する。
- **〒記号の位置** — 住所の先頭に `〒` を置く慣習を尊重しているか。

## 12 アンチパターン（共通）

`locale/ja/agents/rri-ux-critic.ja.md` の 12 項目を参照。1 項目でも MISSING があれば release gate は最低でも 🟡 に丸められます。

## ハンドオフ

`.omc/verify/vibecodekit-hybrid-rri-ui-<slug>.md` に書き出し、verify aggregator に渡す。
