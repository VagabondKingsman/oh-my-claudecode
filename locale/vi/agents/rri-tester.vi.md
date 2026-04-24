# rri-tester — bộ test tiếng Việt

> Overlay Việt ngữ cho agent `rri-tester`. Chỉ phần nội dung body (câu hỏi, bullet, test case) dùng tiếng Việt. Tên section trong artifact (Coverage Matrix, Release Gate, …) giữ tiếng Anh để tooling parse thống nhất.

## 5 Testing Personas (bản Việt)

1. **👤 Người dùng cuối (End User)** — lo lắng về bàn phím telex, autocorrect, font, tốc độ thao tác hàng ngày.
2. **📋 Chuyên viên BA (Business Analyst)** — kiểm tra business rule, hợp đồng dữ liệu, khả năng audit.
3. **🔍 Kẻ phá QA (QA Destroyer)** — cố tình nhập rỗng, nhập siêu dài, nhập ký tự lạ, nhấn 10 phát liên tục.
4. **🛠️ DevOps** — backup, restore, rollback, log, alert, giới hạn tài nguyên.
5. **🔒 Security Auditor** — auth, authz, input sanitize, data leak, injection.

## 8 Stress Axes (VN mnemonic)

- 🕐 **THỜI GIAN (TIME):** bắn liên tục, deadline thật, 1 user giữ 30 phút.
- 📊 **DỮ LIỆU (DATA):** 1 / 100 / 10k / 1M bản ghi; empty / null / outlier.
- ❌ **LỖI (ERROR):** mất mạng, 500, timeout, partial write.
- 👥 **CỘNG TÁC (COLLAB):** 2 user sửa cùng record, conflict, realtime.
- 🚑 **KHẨN CẤP (EMERGENCY):** hỏng DB, hỏng backup, user hốt hoảng nhấn F5.
- 🔒 **AN NINH (SECURITY STRESS):** XSS, SQLi, brute force, phiên lậu.
- 🛠️ **HẠ TẦNG (INFRA):** 2G/3G, CPU 100%, disk đầy, OOM.
- 🌐 **BẢN ĐỊA HOÁ (LOCALIZATION):** Telex/VNI, VND, DD/MM/YYYY, CCCD, diacritic-insensitive search.

## Mẫu test case (VN)

```
[M03-D1-12] Persona: 👤 End User — Dimension: D1 UI/UX — Stress: 🌐 LOCALE + 📐 VIEWPORT
Q: Người dùng gõ "Nguyễn Thị Hồng Ánh" vào ô "Họ tên" ở màn 375 px.
A: Text hiển thị đầy đủ dấu, không bị cắt, nút "Lưu" vẫn nằm trong vùng nhìn.
R: REQ-VN-03 — Mọi form phải chịu được tên Việt dài nhất.
P: P1
T: Pre: mở /customer/new ở Chrome mobile emulation 375 px.
   Steps: nhập "Nguyễn Thị Hồng Ánh"; nhấn Tab.
   Expected: field giữ nguyên chuỗi có dấu; nút "Lưu" không bị đẩy khỏi viewport.
   Evidence: screenshot /screens/m03-new-375.png.
Result: ⚠️ PAINFUL — nút bị che bởi virtual keyboard; cần padding-bottom dynamic.
```

## 12 kiểm tra VN bắt buộc

1. ✅ Dấu tiếng Việt không mất khi export PDF / Excel.
2. ✅ VND format `1.234.567 ₫`, parse ngược lại được.
3. ✅ DD/MM/YYYY placeholder `23/02/2025`.
4. ✅ Cascade Tỉnh → Quận → Phường → Đường → Số nhà.
5. ✅ Search tolerant dấu (`nguyen` → `Nguyễn`).
6. ✅ Phone `+84` / `0xxx`, mask `0912 345 678`.
7. ✅ CCCD 12 & CMND 9 cùng accept.
8. ✅ Telex/VNI — autocorrect browser bị tắt trên field VN.
9. ✅ Currency parse chịu được khoảng trắng / dấu chấm / dấu phẩy.
10. ✅ Probe VN dài nhất tại 1440 / 768 / 375 px.
11. ✅ Font Unicode cho nhãn in, PDF, biểu đồ.
12. ✅ Input tên cho phép cả `đ / ă / ư / ơ` in hoa & thường.
