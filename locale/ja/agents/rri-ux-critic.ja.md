# rri-ux-critic — 日本語ロケール

> `OMC_LOCALE=ja` 検出時に追加読み込みされるオーバーレイ。
> 正本プロンプト: `agents/rri-ux-critic.md` (英語)。

## 5 UX ペルソナ（日本語プロダクト想定）

1. **👵 高齢者ユーザー** — フォント最小 16px、行間 1.6、コントラスト AA 以上。
2. **👶 育児中・片手操作** — 主要 CTA は親指届く範囲（画面下 1/3）、長押し回避。
3. **🧑‍💼 BtoB 経理** — 適格請求書（インボイス番号 13 桁）、源泉徴収、消費税内税／外税、和暦／西暦表記の一貫性。
4. **🏢 法務・コンプライアンス** — APPI 通知、特商法表記、景表法表現、著作権表示。
5. **🔌 オフライン現場作業者** — 圏外でも完了画面まで進めるか、レシートは紙焼き可能か。

## 12 アンチパターン・チェック（必須）

`OMC_LOCALE=ja` 検出時、以下 12 項目を MISSING 軸として必ずカバレッジ・マトリクスに含めます:

1. 敬語の混在（です・ます／だ・である／タメ口）
2. 半角カナ事故（CSV／PDF／メール）
3. JIS X 0208 範囲外（旧字体・異体字）
4. 和暦／西暦の混在
5. 〒住所欠落（郵便番号→住所自動入力）
6. 契約書 PDF 文字化け（`pdftotext`／IPAex／Noto CJK）
7. 絵文字レンダリング差異（Apple／Google／Twemoji）
8. SHA 経由の人名安定性（trailing 全角スペース／IDN）
9. 苗字／名前の入れ違い（`firstName`／`lastName` の並び）
10. 姓名分離 CSV 化け（外字が `?`）
11. IME 変換確定タイミング（`compositionend` 前 API コール）
12. ユニコード正規化境界（NFC ↔ NFD）

各項目はカバレッジ・マトリクスで PASS／FAIL／PAINFUL／MISSING のいずれかを記録します。**1 項目でも MISSING があれば release gate は最低でも 🟡** に丸められます。

## ハンドオフ

`.omc/verify/vibecodekit-hybrid-rri-ux-<slug>.md` に書き出し、`.omc/deliverables.json#/rri_ux_gate` を更新する。
