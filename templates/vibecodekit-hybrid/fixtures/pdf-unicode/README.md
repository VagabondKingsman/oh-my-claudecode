# PDF Unicode fixtures — RRI-T Vietnamese rubric

These fixtures exist for Phase 6b (`vibecodekit-hybrid-rri-t`). When the build under test emits PDFs and the project is VN-first (`OMC_LOCALE=vi`), the RRI-T walk MUST compare the emitted PDF's textual content against these canonical strings to detect silent diacritic loss.

## Strings to probe

| ID | Category | String | Why it matters |
|----|---------|--------|----------------|
| PDF-VN-01 | Diacritic density | `Nguyễn Phương Thảo trả 1.234.567 ₫ ngày 01/02/2026` | Full combining-diacritic stress + VND format + DD/MM/YYYY. |
| PDF-VN-02 | Rare tone mark | `Quãng đường nằm giữa Tuyên Quang và Yên Bái` | `ữ`, `ằ`, `ữa`, `ê` — rare in English-only fonts. |
| PDF-VN-03 | CCCD row | `CCCD: 001234567890 — cấp ngày 12/05/2024 tại Hà Nội` | Digits + diacritics inline. |
| PDF-VN-04 | Address cascade | `Số 42, Phường Cửa Đông, Quận Hoàn Kiếm, Hà Nội` | Tests that address cascade fields render together. |
| PDF-VN-05 | Long invoice line | `Dịch vụ tư vấn triển khai hệ thống kế toán quý IV năm 2026 — gói cao cấp` | Longest realistic line; catches buffer truncation. |
| PDF-VN-06 | Currency corners | `(-250.000 ₫) và 1.000.000.000 ₫ + 0,50 ₫` | Negative parens + large grouping + decimal comma. |
| PDF-VN-07 | Mixed glyphs | `Email: nguyễn.thị.hồng@ví-dụ.vn` | Email local-part with diacritics + IDN domain. |
| PDF-VN-08 | Combining vs precomposed | `Hà Nội` (NFC) vs `Hà Nội` (NFD) | Must render identically regardless of normalization form. |

## Pass criteria

A PDF passes the Vietnamese export check when **all of the following** hold:

1. **Round-trip integrity**: `pdf-extract` → NFC-normalize → byte-equal to the source string for every probe above.
2. **Glyph presence**: no probe's characters are rendered as `□` / `?` / `.notdef` in the extracted glyph map.
3. **Font embedding**: the PDF font dictionary lists exactly one Unicode font (or font subset) that supports U+0100–U+1EFF; no synthetic bold/italic workaround.
4. **Width sanity**: the bounding box of the longest probe (PDF-VN-05) does not exceed the page content area at the declared font size.

Any failure is a RRI-T `PAINFUL` (not FAIL) by default — the content is usually present but visually broken — unless the diacritic loss causes a **legal / identity** field (name, CCCD, address) to become ambiguous, in which case the verdict is `FAIL`.

## How to wire it in

In the RRI-T walkthrough for stage 6b, under the **Localization (🌏)** stress axis, add:

> Emit a sample PDF for the happy path of every PDF-producing workflow. For each emitted PDF, run the 8 probes above and log a verdict line per probe into the RRI-T report.

Store the probe results in the final report under a dedicated `## PDF Unicode probes` heading so the reviewer can audit them without opening the PDFs.

## Automation hint

If you have `pdftotext` (poppler) available locally, a one-liner probe is:

```bash
pdftotext -layout build/invoice.pdf - | python3 -c '
import sys, unicodedata, json
text = unicodedata.normalize("NFC", sys.stdin.read())
probes = json.load(open("templates/vibecodekit-hybrid/fixtures/pdf-unicode/probes.json"))["probes"]
missing = [p["id"] for p in probes if p["string"] not in text]
print(json.dumps({"missing": missing}))
'
```

The JSON probe list lives alongside this README at [`probes.json`](./probes.json) so both humans and scripts consume the same source of truth.
