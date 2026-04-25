# vibecodekit-hybrid-rri-sec — Locale tiếng Việt

> Bản dịch + bổ sung tiếng Việt cho skill `vibecodekit-hybrid-rri-sec`.
> File này được kích hoạt khi `OMC_LOCALE=vi`. Skill gốc tiếng Anh ở `skills/vibecodekit-hybrid-rri-sec/SKILL.md` vẫn là canonical.

## Mục đích

Đợt rà soát bảo mật trước khi phát hành: chứng minh hệ thống chống được kẻ tấn công thực tế, đồng thời lộ ra những giả định tin cậy mà spec đã quên ghi xuống. Skill ủy thác toàn bộ phiên rà cho agent `rri-security-auditor` và trả về 4 mức verdict (PASS / FAIL / PAINFUL / MISSING) + ma trận coverage Module × Trục tấn công + verdict release-gate.

## Khi NÊN dùng

- Sau BUILD của vibecodekit-hybrid khi sản phẩm đã đụng tới authn / authz / thanh toán / PII / upload / tích hợp ngoài.
- Trước khi `vibecodekit-hybrid-verify` chốt verdict release.
- Người dùng nói "rri-sec", "audit bảo mật", "threat model", "kiểm tra an ninh", "rà bảo mật".

## Khi KHÔNG nên dùng

- Tính năng còn ở RRI / VISION / BLUEPRINT — chưa có gì cụ thể để đánh.
- Người dùng chỉ muốn lint tĩnh → dùng `security-reviewer` trực tiếp.
- Người dùng yêu cầu khai thác trực tiếp môi trường production — từ chối, agent sẽ ghi ticket khuyến nghị.

## Personas (5)

1. 🧩 **Kỹ sư mô hình mối đe dọa** — vẽ trust boundary, đặt câu hỏi "ai tin ai?", "biên tin cậy nào?"
2. 🛡️ **Kỹ sư AppSec** — kiểm soát kỹ thuật, lint dependency, secret hygiene, OWASP Top 10.
3. 🔴 **Red Teamer** — kẻ tấn công có động cơ, ưu tiên phá vỡ giả định, abuse case sáng tạo.
4. 📋 **Auditor tuân thủ** — bằng chứng kiểm soát theo GDPR / PCI-DSS / HIPAA / **PDPL Nghị định 13/2023**.
5. 🕵️ **Privacy Officer** — tối thiểu hóa dữ liệu, basis hợp pháp, quyền truy cập / xóa, vận chuyển xuyên biên giới.

## 8 trục tấn công (A1–A8)

| Mã | Tên (VI) | Tên (EN) | Ví dụ điển hình |
|----|----------|----------|------------------|
| A1 | Xác thực | AuthN | bypass đăng nhập, brute-force, OTP không có rate-limit |
| A2 | Phân quyền | AuthZ | IDOR, vertical/horizontal escalation, /admin không gate |
| A3 | Tiêm | Injection | SQLi, XSS, SSRF, command injection, fuzz Telex/VNI |
| A4 | Chuỗi cung ứng | Supply chain | postinstall script, lockfile drift, image base lậu |
| A5 | Vệ sinh secret | Secret hygiene | secret trong client bundle, log secret, kẹt repo public |
| A6 | Rò dữ liệu | Data exfil | trả thừa field, error verbose, audit-log log payload nhạy |
| A7 | DoS / Lạm dụng | DoS / Abuse | algorithmic complexity, regex backtracking, rate-limit thiếu |
| A8 | Side channel | Side channel | timing attack, padding oracle, chuẩn hóa diacritic gộp ID |

## Quy ước ticket

```
[<severity>][<verdict>] <module>: <headline> → owner: executor|security-reviewer|debugger
```

- `severity`: Critical / High / Medium / Low (đối chiếu CVSS).
- `verdict`: PASS / FAIL / PAINFUL / MISSING.
- `owner`: pipe sang executor (vá nóng), security-reviewer (cần đào sâu), debugger (cần tái hiện trước).

## Bổ sung bắt buộc khi `OMC_LOCALE=vi`

- **PDPL Nghị định 13/2023 Điều 11** — nhóm dữ liệu nào, cơ sở pháp lý nào, lưu ở đâu.
- **PDPL Điều 13** — đánh giá tác động khi chuyển dữ liệu ra ngoài Việt Nam.
- **CCCD / CMND** — phải gắn nhãn PII và mã hóa khi nghỉ; mọi truy cập phải audit.
- **Họ tên có dấu** — kiểm tra việc lột dấu (`Nguyễn` → `Nguyen`) không gộp 2 user khác nhau.
- **OTP tiếng Việt** — message localised không bypass rate-limit; SMS/Zalo cùng counter.
- **Số tiền VND** — audit log giữ định dạng `1.234.567` (chấm phân cách hàng nghìn) để tránh drift float.
- **CV / CCCD scan upload** — AV scan + giới hạn dung lượng + đường quarantine.

## Output bàn giao

- File: `.omc/verify/vibecodekit-hybrid-rri-sec-<slug>.md`.
- Trường JSON: `.omc/deliverables.json#/rri_sec_gate` ∈ { 🟢, 🟡, 🔴 }.
- Skill kế tiếp: `vibecodekit-hybrid-verify`.

## Liên kết

- Skill canonical: `skills/vibecodekit-hybrid-rri-sec/SKILL.md`
- Agent: `agents/rri-security-auditor.md`
- Template: `templates/vibecodekit-hybrid/rri-sec-report.md`
- Locale agent: `locale/vi/agents/rri-security-auditor.vi.md`
