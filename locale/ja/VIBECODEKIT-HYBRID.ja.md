# vibecodekit-hybrid — 日本語ガイド

> 英語正本: `docs/VIBECODEKIT-HYBRID.md`
> このファイルは `OMC_LOCALE=ja` 検出時にスキル／エージェントが追加で参照するオーバーレイです。

## クイック・スタート（日本語プロジェクト）

```bash
# 1. ロケールを固定
echo '{"locale":"ja"}' > .omc/locale.json

# 2. パイプラインのスキャフォールド
omc vibecodekit scaffold checkout-redesign --locale ja

# 3. Claude Code セッション内でオーケストレータ起動
#    /oh-my-claudecode:vibecodekit-hybrid checkout-redesign

# 4. リリース・ゲート確認
omc vibecodekit status checkout-redesign
```

## パイプライン段階別の日本語特有ルール

| Stage | 日本語特有のチェック |
|-------|---------------------|
| 1. SCAN | README/`package.json` から日本語比率を推定。`>10%` で `.omc/locale.json` を `ja` に書き込み（手動で固定したい場合は SCAN 前に作成） |
| 2. RRI | 日本語ペルソナ・バンクから 5 名選定（顧客／モデル／ユーザー／運用者）。敬語レベルを質問段階で確定 |
| 3. VISION | コンテキストに「日本語は LCP/CLS が崩れやすい（縦組み混在・ルビ）」を追加 |
| 4. BLUEPRINT | 12 アンチパターン・チェックリストを ACCEPTANCE に必ず差し込む |
| 5. BUILD | 通常通り。日本語特化ルールはこの段階では追加しない |
| 6a. RRI-UX | `rri-ux-critic` が日本語ペルソナで再審査（半角カナ／和暦混在／苗字並び等） |
| 6b. RRI-T | `rri-tester` が PDF 文字化け・ユニコード正規化境界・IME compositionend を必須テスト軸に追加 |
| 6c. RRI-SEC | `rri-security-auditor` が APPI 第 17/21/28 条＋マイナンバー法を必須行に追加 |
| 7. VERIFY | release gate 集計時、`rri_*_gate` のいずれかが MISSING であれば 🟡 以下に丸める |
| 8. REFINE | 日本語特化な MISSING を優先的にチケット化 |

## RRI-T（テスト）— 日本語必須フィクスチャ

`templates/vibecodekit-hybrid/fixtures/pdf-unicode/probes.json` の **PDF-VN-** プローブと並行して、`OMC_LOCALE=ja` のときは以下のプローブも MISSING 検証対象になります:

- **PDF-JA-01** — `pdftotext` 経由で「髙橋」「𠮷田」「渡邊」が文字化けしないか
- **PDF-JA-02** — 縦組み PDF からの `pdftotext --layout` の読み出し精度
- **PDF-JA-03** — ルビ（振り仮名）付き PDF が親文字／ルビを正しく分離できるか
- **PDF-JA-04** — 半角カナ混在 PDF が UTF-8 で正規化されるか
- **PDF-JA-05** — 和暦表記（令和7年）が西暦変換されずに保持されるか
- **PDF-JA-06** — `〒` 記号が SHA 計算前に NFC 正規化されるか
- **PDF-JA-07** — IPAex フォント／Noto Sans CJK JP の埋め込み確認
- **PDF-JA-08** — 旧字体 (JIS X 0212 / 0213) が `?` に化けないか

これらは Phase 4e オーバーレイで追加。各プローブは `templates/vibecodekit-hybrid/fixtures/pdf-unicode/probes.ja.md` に詳細化されています。

## RRI-UX — 日本語アンチパターン 12 項目

詳細は `locale/ja/README.ja.md` を参照。release gate アグリゲータは、`OMC_LOCALE=ja` 検出時に **12 項目すべて** をカバレッジ・マトリクスに必須追加します。

## RRI-SEC — APPI 控制行

詳細は `locale/ja/agents/rri-security-auditor.ja.md`。Compliance Evidence セクションに APPI 第 17/21/28 条およびマイナンバー法（該当時）を追加します。

## release gate と HUD（Phase 4f）

`OMC_LOCALE=ja` のとき:

- `omc vibecodekit status` の出力ラベルが `locale_signal: ja (omc-locale-json)` のような形式で表示
- HUD 要素 `vibecodekitGate` は引き続き共通のグリフ（🟢/🟡/🔴）を使用。日本語化はラベルではなくドキュメント側に寄せる方針
- GitHub Check Run（Phase 4a）はサマリ表に `RRI-SEC (APPI)` 行を含める

## 関連ファイル

- 英語正本: `docs/VIBECODEKIT-HYBRID.md`
- ベトナム語: `locale/vi/VIBECODEKIT-HYBRID.vi.md`
- 日本語マイグレーション: `docs/VIBECODEKIT-MIGRATION.md` の Phase 4e 節を参照
