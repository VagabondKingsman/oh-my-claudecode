# vibecodekit-hybrid-rri-ui — hướng dẫn tiếng Việt

> Overlay tiếng Việt cho skill `vibecodekit-hybrid-rri-ui`. Chỉ phần mô tả phase & checklist là Việt; heading / YAML frontmatter giữ tiếng Anh.

## Mục đích

Đóng gói toàn bộ vòng đời chất lượng UI cho Enterprise SaaS Việt Nam: phê bình UX **trước khi** thiết kế (`rri-ux-critic`) + kiểm thử UI **sau khi** thiết kế (`rri-tester` dimension D1) + release gate theo 6 tiêu chí.

## 5 Phase

| Phase | Thời lượng | Mục tiêu |
|-------|------------|----------|
| 0 — Setup | ≤ 1 ngày | Design tokens + constraints Việt (font ≥ 14 px, 44 px target, buffer +30%). |
| 1 — UX Critique | 2–3 ngày | Gọi `vibecodekit-hybrid-rri-ux`, thu 80–120 issue S→V→P→F→I. |
| 2 — UI Design | 3–5 ngày | Thiết kế component & screen; self-check 8 trục Flow Physics. |
| 3 — UI Testing | 2–3 ngày | Gọi `vibecodekit-hybrid-rri-t` (scope D1 + 1–2 dimension phụ), 100–140 test case. |
| 4 — Measure & Gate | ≤ 1 ngày | Tổng hợp release gate 6 tiêu chí. |
| 5 — Handoff | liên tục | Bàn giao design spec + test case cho `executor` / `designer`. |

## 6 tiêu chí release (UI APPROVED)

1. ✅ Mọi U1–U7 UX dimension ≥ 70%.
2. ✅ ≥ 5/7 UX dimension ≥ 85%.
3. ✅ 0 P0 BROKEN / FAIL.
4. ✅ 12/12 kiểm tra tiếng Việt pass (khi `OMC_LOCALE=vi`).
5. ✅ Responsive ở 375 / 768 / 1440 px — không vỡ layout, không mất nội dung.
6. ✅ 0/12 anti-pattern vi phạm.

## Lệnh thường dùng

```bash
# Chạy full pipeline cho một module
/oh-my-claudecode:vibecodekit-hybrid-rri-ui <slug> --module checkout

# Chỉ chạy phase test (phase 3) trên thiết kế đã có
/oh-my-claudecode:vibecodekit-hybrid-rri-ui <slug> --phase 3

# Bật strict: biến mọi FRICTION / PAINFUL thành BROKEN
/oh-my-claudecode:vibecodekit-hybrid-rri-ui <slug> --strict
```

## Khi nào bỏ qua

- Project backend / CLI không có UI → dùng `vibecodekit-hybrid-rri-t` trực tiếp.
- Chỉ muốn critique hoặc chỉ muốn test → gọi thẳng `vibecodekit-hybrid-rri-ux` hoặc `vibecodekit-hybrid-rri-t`.
