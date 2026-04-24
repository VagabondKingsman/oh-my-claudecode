# Hỗ trợ tiếng Việt (`OMC_LOCALE=vi`)

Thư mục `locale/vi/` chứa phần dịch / bổ sung tiếng Việt cho các skill & agent của vibecodekit-hybrid. Bật bằng cách:

```bash
export OMC_LOCALE=vi
# hoặc gọi: /oh-my-claudecode:vibecodekit-hybrid --locale vi "<ý tưởng>"
```

## Quy tắc

1. **Heading / section name** trong SKILL.md chính & template luôn giữ tiếng Anh để công cụ parse đồng nhất. Chỉ phần nội dung body, prompt, checklist mới chuyển sang tiếng Việt.
2. Khi `OMC_LOCALE=vi` được bật:
   - `rri-interviewer` dùng bộ câu hỏi trong `locale/vi/agents/rri-interviewer.vi.md`.
   - `rri-tester` dùng bộ test case tiếng Việt trong `locale/vi/agents/rri-tester.vi.md` (đặc thù VN: VND, DD/MM/YYYY, CCCD, Telex/VNI, buffer +30% độ rộng).
   - `rri-ux-critic` bật 12-item Vietnamese checklist trong Coverage Matrix.
   - Skill `vibecodekit-hybrid-rri-ui` tự động chạy đủ 12 anti-pattern VN.
3. Nếu không có file `.vi.md` tương ứng, hệ thống fallback về bản tiếng Anh (không crash).

## Auto-detect (khi không đặt env)

SCAN stage cố gắng suy luận locale từ:
- `README.md` / `package.json` có tỉ lệ từ VN > 10% → `vi`
- `.omc/locale.json` có field `{"locale":"vi"}`
- Input user chứa dấu tiếng Việt (ăn, ư, ờ, …) với tần suất cao → gợi ý `vi`

## Các file hiện có

- `VIBECODEKIT-HYBRID.vi.md` — tài liệu tổng quan (Phase 1 đã có)
- `agents/rri-interviewer.vi.md` — 5 personas × 3 modes bằng tiếng Việt (Phase 2)
- `agents/rri-tester.vi.md` — test bank tiếng Việt (Phase 2)
- `agents/rri-ux-critic.vi.md` — bộ quy tắc Flow Physics + 12-item checklist (Phase 2)
- `skills/vibecodekit-hybrid-rri-ui.vi.md` — guide pipeline 5 phase (Phase 2)

## Quy tắc giao diện Việt bắt buộc

- Text VN thường dài hơn EN ~30% → buffer container & button.
- VND: `1.234.567 ₫` (dấu chấm phân cách hàng nghìn), auto-format on blur.
- Ngày tháng: DD/MM/YYYY với placeholder `23/02/2025`.
- Địa chỉ: cascade Tỉnh → Quận → Phường → Đường → Số nhà.
- Tìm kiếm tolerant dấu: `nguyen` phải match `Nguyễn`.
- Số điện thoại: chấp nhận `+84` & `0xxx`, mask `0912 345 678`.
- CCCD (12 số) & CMND (9 số) đều accept.
- Tắt autocorrect trên field tiếng Việt (Telex/VNI xung đột với browser spellcheck).
- Font Unicode cho PDF export — test bằng chuỗi `Nguyễn Thị Hồng Ánh` đầy đủ dấu.
- Probe responsive 375 / 768 / 1440 px bằng chuỗi VN dài nhất — không cắt, không xuống dòng gãy layout.
