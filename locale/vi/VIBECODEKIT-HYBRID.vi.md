# Vibecodekit Hybrid (tiếng Việt)

> Quy trình Chủ thầu–Chủ nhà–Thợ kết hợp phương pháp Vibecodekit v5 với runtime oh-my-claudecode (OMC).

## Tóm tắt

`vibecodekit-hybrid` là một **skill** cấp cao nối phương pháp Vibecodekit v5 (Chủ nhà ↔ Chủ thầu ↔ Thợ) vào các primitives có sẵn của OMC (skill, agent, hook, state, multi-provider). Nó chuỗi 8 giai đoạn:

```
SCAN → RRI → VISION → BLUEPRINT → TASK GRAPH → BUILD → VERIFY → REFINE
```

Mỗi giai đoạn được uỷ quyền cho một skill hoặc agent chuyên biệt. Artifact được lưu dưới `.omc/research/`, `.omc/specs/`, `.omc/plans/` để toàn bộ quyết định đều tra được, review được, tái lập được.

## Vì sao cần skill này

- `autopilot` tối ưu tốc độ, giả định mục tiêu đã rõ.
- Nhiều dự án thực tế **không rõ** — cần phỏng vấn theo persona, chọn tên pattern, và duyệt bản vẽ (Blueprint) **trước khi** viết một dòng code.
- Vibecodekit v5 đã chuẩn hoá quy trình này dưới dạng Contractor–Worker Protocol; skill này ráp nối vào OMC mà không động đến runtime TypeScript.

## Sơ đồ pipeline

| # | Giai đoạn | Skill / Agent | Artifact |
|---|-----------|---------------|----------|
| 1 | SCAN | `vibecodekit-hybrid-scan` → agent `explore` | `.omc/research/vibecodekit-hybrid-scan-<slug>.md` |
| 2 | RRI | `vibecodekit-hybrid-rri` → agent `rri-interviewer` | `.omc/specs/vibecodekit-hybrid-rri-<slug>.md` |
| 3 | VISION | `vibecodekit-hybrid-vision` + `templates/vibecodekit-hybrid/vision-patterns/` | Section Vision trong Blueprint |
| 4 | BLUEPRINT | `ralplan` (Planner → Architect → Critic) | `.omc/plans/vibecodekit-hybrid-<slug>.md` |
| 5 | Cổng APPROVED | Người dùng xác nhận `APPROVED` | — |
| 6 | BUILD | `team` / `autopilot` / `ralph` + template TIP | Completion Report từ Thợ |
| 7 | VERIFY | `vibecodekit-hybrid-verify` + `verifier` + `qa-tester` | `.omc/plans/vibecodekit-hybrid-verify-<slug>.md` |
| 8 | REFINE | `ai-slop-cleaner` (chỉ chạy khi có mục PAINFUL / MISSING) | Blueprint được vá |

## 5 RRI personas

Agent `rri-interviewer` đi đúng thứ tự 5 persona, mỗi câu hỏi đưa 2-4 lựa chọn cụ thể (không hỏi mở).

1. **End User** (Người dùng cuối) — top-3 công việc hàng ngày, cảm giác thành công.
2. **Business Analyst** — giá, gói, compliance, audit, báo cáo.
3. **QA Destroyer** — biên dữ liệu, đầu vào xấu, concurrency, edge Tiếng Việt.
4. **Developer** — dev loop, test, migration, telemetry, convention.
5. **DevOps / Operator** — deploy, secret, rollback, observability, chi phí, scale.

Với dự án nặng UI/UX, Phase 2 sẽ bổ sung 5 persona RRI-UX (Speed Runner / First-Timer / Data Scanner / Multi-Tasker / Field Worker) qua agent `rri-ux-critic` tách riêng.

## 3 chế độ phỏng vấn

- **Challenge** (mặc định khi user tự tin): đề xuất phương án mạnh, bắt user phản biện khi muốn khác.
- **Guided**: đưa 2-3 phương án cân bằng, kèm pros/cons, không đề xuất.
- **Explore**: hỏi mở trước, hội tụ về phương án sau. Dùng cho dự án mới, user chưa có mental model.

## 7 Vision Pattern

Mỗi pattern trong `templates/vibecodekit-hybrid/vision-patterns/` có layout chuẩn, stack mặc định (đề xuất, không bắt buộc), non-goals, persona focus, Flow Physics, và khung acceptance:

- `landing.md` — landing page một trang.
- `saas.md` — ứng dụng SaaS đã đăng nhập, multi-tenant.
- `dashboard.md` — dashboard phân tích dữ liệu.
- `blog.md` — blog / content site.
- `portfolio.md` — portfolio cá nhân / studio.
- `enterprise-module.md` — module mới trong ứng dụng doanh nghiệp có sẵn.
- `custom.md` — escape hatch có chủ đích khi không pattern nào vừa.

## 4 mức verdict khi VERIFY

`vibecodekit-hybrid-verify` không chấp nhận PASS/FAIL nhị phân. Mỗi requirement nhận một trong:

- `PASS` ✅ — đã làm và có bằng chứng test.
- `FAIL` ❌ — chưa làm hoặc hỏng.
- `PAINFUL` ⚠️ — về kỹ thuật chạy được, nhưng UX tệ hoặc chi phí vận hành cao.
- `MISSING` 🔲 — không đánh giá được (thiếu test, thiếu môi trường, thiếu dữ liệu).

Mọi mục `PAINFUL` / `MISSING` tự động sinh TIP follow-up cho REFINE. Không được âm thầm bỏ qua.

## Các template artifact

Tất cả nằm dưới `templates/vibecodekit-hybrid/`:

- `scan-report.md` — schema cho SCAN Report.
- `tip.md` — Task Instruction Pack, mỗi task một file.
- `completion-report.md` — báo cáo từ Thợ về Chủ thầu.
- `blueprint.md` — Blueprint có sẵn RRI Requirements Matrix + Task Decomposition Preview.
- `verify-report.md` — báo cáo Verify với 4 mức verdict.
- `vision-patterns/*.md` — 7 vision pattern ở trên.

## Cách gọi

Từ khoá kích hoạt tự động:

```
vibecodekit build me một landing cho X
vibecodekit-hybrid run trên repo này
vibecode-master: saas cho mini-ERP tiếng Việt
```

Gọi tường minh:

```
/oh-my-claudecode:vibecodekit-hybrid
/oh-my-claudecode:vibecodekit-hybrid --pattern saas --locale vi --interactive
/oh-my-claudecode:vibecodekit-hybrid --auto   # bỏ qua cổng APPROVED
```

Các cờ hỗ trợ:

- `--interactive` (mặc định): dừng ở cổng APPROVED sau BLUEPRINT.
- `--auto`: bỏ cổng APPROVED, coi Blueprint là đã duyệt.
- `--pattern <landing|saas|dashboard|blog|portfolio|enterprise-module|custom>`: ép pattern.
- `--locale <en|vi>`: ép locale (nếu không, đọc từ README + `OMC_LOCALE`).

## Liên hệ với các skill OMC đang có

| Skill hiện có | Vai trò bên trong vibecodekit-hybrid |
|---------------|--------------------------------------|
| `explore` | Dùng bên trong `vibecodekit-hybrid-scan` |
| `deep-interview` | Phỏng vấn Socratic ambiguity-gated. Không được dùng trong RRI (RRI có agent 5 persona riêng). Vẫn có thể gọi độc lập để giảm mơ hồ. |
| `ralplan` | Engine consensus cho Blueprint (Planner → Architect → Critic) |
| `autopilot` | Engine BUILD khi task không song song được |
| `team` | Engine BUILD khi Task Decomposition Preview có ≥ 3 task độc lập |
| `ralph` | Engine BUILD khi user yêu cầu persistence |
| `verifier` / `code-reviewer` / `security-reviewer` | Dùng trong VERIFY cho technical health |
| `qa-tester` | Dùng trong VERIFY cho persona walkthrough |
| `ai-slop-cleaner` | Dùng trong REFINE, bounded bởi Blueprint đã duyệt |

## Phạm vi Phase 1 (PR này)

- 5 skill: `vibecodekit-hybrid` + 4 sub (`-scan`, `-rri`, `-vision`, `-verify`).
- 1 agent: `rri-interviewer` (5 persona × 3 mode).
- 11 template: scan-report, tip, completion-report, blueprint, verify-report, 7 vision pattern.
- Tích hợp keyword-detector: `vibecodekit`, `vibecodekit-hybrid`, `vibecode-master`.
- Docs: file tiếng Anh `docs/VIBECODEKIT-HYBRID.md` + file này (Việt).

## Phase 2 đã bàn giao (PR này)

- Thêm 3 skill: `vibecodekit-hybrid-rri-t`, `vibecodekit-hybrid-rri-ux`, `vibecodekit-hybrid-rri-ui`.
- Thêm 2 agent: `rri-tester` (5 persona test × 7 dimension × 8 stress axis) và `rri-ux-critic` (5 UX persona × 7 UX dimension × 8 trục Flow Physics).
- Thêm 3 template: `rri-t-report.md`, `rri-ux-report.md`, `rri-ui-report.md`.
- Orchestrator pipeline gắn thêm Stage 4b (RRI-UX trước khi code) và Stage 6b (RRI-T sau BUILD).
- VERIFY ghi quyết định release vào `.omc/deliverables.json` (`verify_gate`, `verdict_counts`, `release_decision`, các gate con `rri_t_gate` / `rri_ux_gate` / `rri_ui_gate`).
- Keyword detector bổ sung pattern `rri-t`, `rri-ux`, `rri-ui`, `ui-design-pipeline`, `flow-physics(-critique|-test)?` (orchestrator vẫn có priority cao hơn).
- Opt-in Vietnamese qua `OMC_LOCALE=vi`: overlay tại `locale/vi/agents/*.vi.md`, `locale/vi/skills/*.vi.md`, `locale/vi/README.vi.md` (12 anti-pattern VN bắt buộc).

## Phase 3 đã bàn giao (PR này)

- **CLI `omc vibecodekit`** (Node/Commander) với 4 subcommand:
  - `scaffold <slug> [--locale en|vi]` — tạo skeleton `.omc/{research,specs,plans,design,verify}/` + `.omc/deliverables.json`.
  - `status [<slug>]` — in release gate hiện tại từ `deliverables.json`.
  - `patterns` — liệt kê 10 vision pattern.
  - `locales` — liệt kê overlay locale (en + vi).
- **Preset marketplace**: `.claude-plugin/marketplace.json` thêm block `presets` cho `vibecodekit-hybrid` (entry skill, docs, CLI, danh sách skill/agent/template) và tag `vibecodekit` / `rri` / `vietnamese`.
- **Migration guide** tại `docs/VIBECODEKIT-MIGRATION.md`: pre-vibecodekit → Phase 1 → Phase 2 → Phase 3, kèm bảng số lượng agent/skill và hướng dẫn rollback.
- **Ví dụ đầy đủ** dưới `examples/vibecodekit-hybrid/`:
  - `landing-vn/` — landing page studio yoga Việt (locale vi, pattern landing, gate 🟡 → SHIP_WITH_FOLLOWUPS).
  - `saas-enterprise-module/` — module Invoice cho SaaS Việt (locale vi, pattern enterprise-module, 3 gate đều 🟢 → SHIP).
- **Auto-detect locale tại SCAN**: thứ tự tín hiệu xác định `.omc/locale.json` → `OMC_LOCALE` → `--locale` → heuristic README (diacritic density > 8 %) → heuristic manifest (`package.json`/`pyproject.toml`/`Cargo.toml`) → mặc định `en`. Tín hiệu thắng + bằng chứng được ghi vào section 8 của scan report; locale non-default được truyền lại cho orchestrator để các stage sau thừa kế.
- **Fixture PDF Unicode cho RRI-T**: `templates/vibecodekit-hybrid/fixtures/pdf-unicode/` với 8 chuỗi probe (`PDF-VN-01` … `PDF-VN-08`) + `probes.json` có cờ `fail_if_missing` để phân biệt trường danh tính/pháp lý (FAIL nếu vỡ) và mất dấu thẩm mỹ (PAINFUL).

### Ví dụ CLI

```bash
# scaffold artifact, không cần mở Claude
omc vibecodekit scaffold checkout-flow
omc vibecodekit scaffold landing-vn --locale vi

# xem release gate hiện tại
omc vibecodekit status

# liệt kê pattern + locale có sẵn
omc vibecodekit patterns
omc vibecodekit locales
```

### Thang tín hiệu locale (từ cao xuống thấp)

| Ưu tiên | Tín hiệu | Nguồn | Ghi chú |
|---------|----------|-------|---------|
| 1 | `omc-locale-json` | `.omc/locale.json` | Ghi đè tường minh, luôn thắng |
| 2 | `env:OMC_LOCALE` | Biến môi trường | Giữ qua nhiều phiên trong cùng shell |
| 3 | `flag:--locale` | CLI / invocation flag | Ghi đè cho một run |
| 4 | `readme-heuristic` | `README.md` (fallback `README.vi.md`) | Tỷ lệ nguyên âm mang dấu > 8 % trong 400 ký tự bất kỳ |
| 5 | `manifest-heuristic` | `package.json` / `pyproject.toml` / `Cargo.toml` | Dấu tiếng Việt trong description / author / keywords |
| 6 | `default` | — | Tiếng Anh |

## Phase 4f đã bàn giao (PR này)

Phase 4f lần đầu tiên đưa hai trạng thái của vibecodekit vào **runtime TypeScript của OMC** (không còn chỉ là skill), nhưng vẫn opt-in nên không phá vỡ preset HUD hiện tại:

- **Locale resolver runtime** `src/lib/vibecodekit-locale.ts` — xuất `resolveVibecodekitLocale(cwd?, env?)` và `getVibecodekitLocale()`. Thang tín hiệu runtime hẹp hơn SCAN (runtime không được làm heuristic filesystem mỗi lần render):
  1. `.omc/locale.json` ghi đè tường minh
  2. Biến môi trường `OMC_LOCALE`
  3. Mặc định (`en`)

  Locale hỗ trợ được chuẩn hoá từ dạng POSIX (ví dụ `vi_VN.UTF-8 → vi`). Locale không được hỗ trợ sẽ rớt xuống tín hiệu kế — không bao giờ đổi hành vi ngấm ngầm.
- **Reader release-gate cho HUD** `src/hud/omc-state.ts :: readVibecodekitGateForHud(cwd)` — đọc `.omc/deliverables.json` an toàn (JSON hỏng, thiếu trường, số âm → `null` hoặc 0, không bao giờ throw). Đi theo đúng hợp đồng của `readAutopilotStateForHud` / `readPrdStateForHud`.
- **Phần tử HUD** `src/hud/elements/vibecodekit-gate.ts` — opt-in, hiển thị release gate ngay trên statusline:

  | Verdict | Định dạng |
  |---------|-----------|
  | `SHIP` | `🟢 VK:SHIP 36P` |
  | `SHIP_WITH_FOLLOWUPS` | `🟡 VK:FOLLOWUPS 2⚠` |
  | `DO_NOT_SHIP` | `🔴 VK:DO_NOT_SHIP 3❌` |

  Phần tử này **tắt mặc định** (`elements.vibecodekitGate = false / undefined`) nên preset HUD hiện tại không đổi. Bật bằng cách thêm `"vibecodekitGate": true` vào `omcHud.elements` trong `.claude/omc.jsonc`.
- **CLI `status` bổ sung** — `omc vibecodekit status` giờ thêm dòng `locale_signal` cho biết runtime lấy locale từ tín hiệu nào, khớp đúng với cái HUD thấy.
- **Test** — 24 unit test mới (9 cho resolver, 7 cho reader, 8 cho HUD element), pass toàn bộ trên Node 20 / vitest.

### Bật HUD element

```jsonc
// .claude/omc.jsonc
{
  "omcHud": {
    "elements": {
      "vibecodekitGate": true
    }
  }
}
```

### Ghi đè locale ở runtime

```bash
# Ghi đè bền vững cho project (giữ qua nhiều phiên + CI)
echo '{ "locale": "vi" }' > .omc/locale.json

# Ghi đè tạm cho một shell
export OMC_LOCALE=vi

# Kiểm tra runtime đang thấy gì
omc vibecodekit status
# →   locale_signal    : omc-locale-json (resolved=vi)
```

## Ngoài phạm vi (để cho phase sau)

Phase 4f dừng ở lớp HUD read-only + locale resolver. Phase sau có thể:

- Publish `.omc/deliverables.json` thành GitHub Check Run (ứng cử 4a).
- Tách persona bank tiếng Việt thành skill plugin độc lập để preset khác dùng lại.
- Thêm hook chặn `git push` khi gate là 🔴 (opt-in).
- Dashboard web hiển thị release gate.

## Credit

Phỏng theo Vibecodekit v5.0 (Contractor–Worker Protocol) và bộ phương pháp RRI (RRI, RRI-T, RRI-UI, RRI-UX) của Nguyễn (VagabondKingsman). Tích hợp dưới dạng skill-pack qua Phase 1–3; Phase 4f là lần đầu tiên có code TypeScript runtime (và vẫn opt-in).
