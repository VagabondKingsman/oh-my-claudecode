# vibecodekit-hybrid-rri-sec — 日本語ロケール

> `OMC_LOCALE=ja` 検出時に追加読み込みされるオーバーレイ。
> 正本 SKILL: `skills/vibecodekit-hybrid-rri-sec/SKILL.md` (英語)。

## 目的

リリース直前のセキュリティ・レビュー: 現実の攻撃者から守れることを証明し、同時に仕様が書き忘れた信頼仮定を炙り出す。スキルはセッション全体を `rri-security-auditor` エージェントに委譲し、4 段階 verdict（PASS／FAIL／PAINFUL／MISSING）＋ Module × 攻撃軸 のカバレッジ・マトリクス＋ release-gate verdict を返す。

## 使うべきとき

- vibecodekit-hybrid の BUILD 後、認証／認可／決済／PII／アップロード／外部連携を含む変更があったとき。
- `vibecodekit-hybrid-verify` が release verdict を確定する前。
- ユーザが「rri-sec」「セキュリティ監査」「脅威モデル」「脆弱性レビュー」「APPI 監査」と言ったとき。

## 使わないべきとき

- まだ RRI／VISION／BLUEPRINT 段階で具体実装が無いとき。
- ユーザが静的 lint だけを求めているとき → `security-reviewer` を直接使う。
- ユーザが本番環境への直接攻撃を求めているとき → 拒否してチケット化推奨を記録する。

## 5 ペルソナ

1. 🧩 **脅威モデラー** — 信頼境界の図式化、「誰が誰を信じているか?」「どの境界に信頼仮定があるか?」
2. 🛡️ **AppSec エンジニア** — 技術コントロール、依存 lint、シークレット衛生、OWASP Top 10。
3. 🔴 **レッドチーマー** — 動機を持つ攻撃者、仮定の破壊、創造的な abuse case。
4. 📋 **コンプライアンス監査者** — GDPR／PCI-DSS／HIPAA／**APPI（個人情報保護法）**／マイナンバー法 の証跡。
5. 🕵️ **プライバシー・オフィサー** — データ最小化、法的根拠、アクセス／削除権、越境移転。

## 8 攻撃軸（A1–A8）

`agents/rri-security-auditor.ja.md` を参照。

## `OMC_LOCALE=ja` 時の必須補強

- **APPI 第 17/21/28 条** をコンプライアンス・エビデンス表に必須追加。
- **マイナンバー法**（該当時）の隔離保管証跡。
- **ユニコード正規化境界**（NFC ↔ NFD）が dedup ロジックに与える影響を A8 で必須評価。
- **JIS X 0212/0213 外字** がログ／PDF／バックアップで `?` に化けないかを A6 で必須評価。
- **OTP 同一カウンタ**（SMS／LINE／メール／プッシュ）を A1 で必須評価。

## ハンドオフ

- `.omc/verify/vibecodekit-hybrid-rri-sec-<slug>.md` (テンプレート: `templates/vibecodekit-hybrid/rri-sec-report.md`)。
- `.omc/deliverables.json#/rri_sec_gate` ∈ { 🟢, 🟡, 🔴 }。
- 次スキル: `vibecodekit-hybrid-verify`。
