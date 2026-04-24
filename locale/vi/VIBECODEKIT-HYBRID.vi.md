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

## Phase 2 & 3 sắp tới

- **Phase 2**: agent `rri-tester`, `rri-ux-critic`; skill RRI-UI; opt-in Vietnamese locale rules qua `OMC_LOCALE=vi`; 4-level verdict được lưu vào `deliverables.json`.
- **Phase 3**: CLI `omc vibecodekit`, preset marketplace, migration guide, ví dụ đầy đủ.

## Credit

Phỏng theo Vibecodekit v5.0 (Contractor–Worker Protocol) và bộ phương pháp RRI (RRI, RRI-T, RRI-UI, RRI-UX) của Nguyễn (VagabondKingsman). Tích hợp dưới dạng skill-pack, **không** sửa runtime OMC.
