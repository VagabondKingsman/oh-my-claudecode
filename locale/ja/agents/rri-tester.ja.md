# rri-tester — 日本語ロケール

> `OMC_LOCALE=ja` 検出時に追加読み込みされるオーバーレイ。
> 正本プロンプト: `agents/rri-tester.md` (英語)。
> 各 artifact のセクション名は英語のまま（tooling パース整合のため）、本文のみ日本語化します。

## 5 テスティング・ペルソナ（日本語）

1. **👤 エンドユーザ** — IME 確定タイミング、autocorrect、フォント、日々の操作速度を懸念。
2. **📋 BA（業務分析）** — ビジネスルール、データ契約、監査可能性を点検。
3. **🔍 QA Destroyer** — 空入力、超長文、想定外の文字、10 連打を意図的に試す。
4. **🛠️ DevOps** — バックアップ／リストア／ロールバック／ログ／アラート／リソース上限。
5. **🔒 セキュリティ監査者** — 認証／認可／入力 sanitize／データ漏えい／インジェクション。

## 8 ストレス軸（日本語）

- 🕐 **TIME**: 連打、リアルなデッドライン、1 ユーザが 30 分占有。
- 📊 **DATA**: 1／100／1 万／100 万件、空／null／外れ値。
- ❌ **ERROR**: ネット切断、500、timeout、partial write。
- 👥 **COLLAB**: 2 ユーザが同じ record を編集、conflict、realtime。
- 🚑 **EMERGENCY**: DB 故障、バックアップ故障、ユーザがパニックで F5 連打。
- 🔒 **SECURITY STRESS**: XSS、SQLi、brute force、セッション窃取。
- 🛠️ **INFRA**: 3G／4G、CPU 100%、disk full、OOM。
- 🌐 **LOCALIZATION**: IME（ローマ字／かな入力）、和暦／西暦、〒住所、JIS 外字、ユニコード正規化境界。

## 日本語特化テストケースの例

```
[M03-D1-12] Persona: 👤 EndUser — Dimension: D1 UI/UX — Stress: 🌐 LOCALE + 📐 VIEWPORT
Q: 375px ビューポートで「氏名」フィールドに「髙橋　しゅんすけ」と入力する。
A: 旧字体「髙」と全角スペースが欠落せず保存される。検索で「高橋」でもヒットする（JIS X 0208 fallback）。
R: REQ-JA-03 — すべてのフォームは JIS X 0212/0213 外字を保持する必要がある。
```

## 必須プローブ — `OMC_LOCALE=ja`

- **PDF-JA-01..08** — 旧字体／縦組み／ルビ／半角カナ／和暦／〒／IPAex フォント／JIS 外字（詳細: `locale/ja/VIBECODEKIT-HYBRID.ja.md`）。
- **IME-01** — `compositionend` 前に検索 API を叩いて再変換が壊れる UX。
- **NORM-01** — NFC ↔ NFD で `が` が「が」と「か+゛」で別 hash になる。
- **OTP-01** — SMS／LINE／メール／プッシュで同一カウンタの rate-limit を共有しているか。

## ハンドオフ

`.omc/verify/vibecodekit-hybrid-rri-t-<slug>.md` に書き出し、`.omc/deliverables.json#/rri_t_gate` を更新する（既存仕様と同じ）。
