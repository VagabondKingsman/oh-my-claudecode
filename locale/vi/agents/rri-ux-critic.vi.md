# rri-ux-critic — overlay Việt ngữ

> Bộ quy tắc Flow Physics + checklist Việt hoá cho agent `rri-ux-critic`. Heading artifact giữ tiếng Anh; nội dung issue S→V→P→F→I viết tiếng Việt.

## 5 UX Personas (bản Việt)

- 🏃 **Tốc Hành (Speed Runner)** — dùng app ≥ 20 lần/ngày, bực với mỗi click thừa.
- 👁️ **Lính Mới (First-Timer)** — lần đầu mở, cần affordance rõ ràng, label đầy đủ.
- 📊 **Soi Dữ Liệu (Data Scanner)** — đọc lướt bảng / dashboard, cần eye-travel ngắn.
- 🔄 **Đa Nhiệm (Multi-Tasker)** — mở nhiều tab, context switch liên tục, sợ mất filter.
- 📱 **Công Tác Ngoài (Field Worker)** — mạng yếu, 1 tay, nắng chói, cần feedback tức thì.

## 8 trục Flow Physics (VN mnemonic)

- 📏 SCROLL — CTA phải trong vùng 100vh đầu tiên.
- 🖱️ CLICK DEPTH — tác vụ chính ≤ 3 click.
- 👁️ EYE TRAVEL — label & input cùng trục mắt; không zig-zag.
- 🧠 DECISION — ≤ 5 hành động chính, còn lại progressive disclosure.
- 🔙 RETURN — huỷ/back luôn giữ state form, không mất dữ liệu.
- 📐 VIEWPORT — layout ổn ở 375 / 768 / 1440 px, không horizontal scroll.
- ⏱️ TIME TO ACTION — nút chính active sau ≤ 300 ms mount.
- 🔄 TASK SWITCH — filter, tab, sort state được giữ qua navigation.

## 5 Mandatory UI Rules (VN)

1. Flow luôn đi xuống — không buộc user scroll ngược.
2. CTA chính luôn hiện trong viewport (sticky nếu trang dài).
3. Progressive disclosure cho form > 7 field hoặc dropdown > 15 mục.
4. Feedback tức thì cho mọi thao tác (loading, success, error).
5. Buffer tiếng Việt: container chịu được chuỗi `Nguyễn Thị Hồng Ánh`.

## Checklist 12 điểm VN

- [ ] VN text > EN ~30% — container / button vẫn chứa.
- [ ] Dấu tiếng Việt render đúng ở body + input.
- [ ] Telex/VNI — autocorrect browser đã tắt trên field VN.
- [ ] VND `1.234.567 ₫` — auto-format, parse tolerant.
- [ ] Date DD/MM/YYYY placeholder `23/02/2025`.
- [ ] Cascade Tỉnh → Quận → Phường → Đường → Số nhà.
- [ ] Search tolerant dấu (`nguyen` → `Nguyễn`).
- [ ] Phone `+84` / `0xxx`, mask `0912 345 678`.
- [ ] CCCD (12) / CMND (9) đều accept.
- [ ] PDF export dùng font Unicode, sample đầy dấu đã verify.
- [ ] Currency parse chịu được space / comma / period variants.
- [ ] Probe VN dài nhất ở 375 / 768 / 1440 px — không truncate, không vỡ layout.

## Mẫu issue S→V→P→F→I (VN)

```
[M02-CHECKOUT-A04] Axis: 📏 SCROLL — Dimension: U1 Flow Direction
S: Trên màn 375 px, user điền xong form giao hàng phải scroll ngược ~600 px để nhấn "Tiếp tục".
V: Vi phạm rule "CTA luôn trong viewport" — nút chính bị bàn phím ảo che.
P: 🏃 Tốc Hành + 📱 Công Tác Ngoài.
F: Dùng sticky bottom bar 64 px chứa CTA; form giữ padding-bottom động = chiều cao bar + safe-area-inset.
I: FRICTION ⚠️ — giảm ~3 giây / checkout.
```
