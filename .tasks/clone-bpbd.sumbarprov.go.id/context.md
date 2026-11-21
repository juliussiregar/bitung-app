# Website Clone Task Context

**Target URL:** https://bpbd.sumbarprov.go.id/home
**Domain:** bpbd.sumbarprov.go.id
**Created:** 2026-11-20
**Project:** BPBD Bitung / BPBD Portal
**Status:** In Progress
**Framework:** Next.js (App Router, Tailwind CSS, TypeScript, motion)

---

## 1. Color Palette

| Name | Hex Value | Usage |
|------|-----------|-------|
| Primary Orange | `#ea580c` | Primary brand color, CTA buttons, active states, accents |
| Light Orange | `#f97316` | Gradient accents, hover highlights |
| Soft Amber | `#fb923c` | Text highlights on dark backgrounds, badges |
| Deep Navy | `#172554` | Hero overlay gradient, brand contrast |
| Royal Blue | `#1e3a8a` | Header brand elements, secondary buttons |
| Dark Slate | `#0f172a` | Hero background, dark mode surfaces |
| Slate Border | `#e2e8f0` | Card borders, dividers |
| Text Primary | `#0f172a` / `#1e293b` | Main headings and body text |
| Text Muted | `#64748b` | Subtitles, metadata, dates |
| Text Light | `#f8fafc` | Headings on dark backgrounds |

---

## 2. Typography

- **Primary Font:** Inter, Plus Jakarta Sans, system-ui, sans-serif
- **Headings:**
  - Hero Title: `text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase`
  - Section Headings: `text-2xl sm:text-3xl font-extrabold tracking-tight`
  - Card Titles: `text-lg sm:text-xl font-bold`
  - Badges & Subtitles: `text-xs sm:text-sm font-semibold tracking-wider uppercase`

---

## 3. Layout & Structure

1. **Top Emergency Ticker:** Running alerts for weather warnings and 24/7 hotline.
2. **Main Navigation (Header):**
   - Logo BPBD + Brand Title
   - Menu Dropdowns: Beranda, Profil, Publikasi, Perpustakaan, PPID, Kontak
   - Action Buttons: Search dialog trigger, LAPOR button, Mobile hamburger toggle
3. **Hero Slider:**
   - Full-width cinematic slider with continuous subtle zoom (`animate-zoom-bg`)
   - Badge pill "KOTA BITUNG" / "PROVINSI SUMATERA BARAT"
   - Large bold headline + descriptive subtitle
   - Dual CTA buttons: "Berita Terbaru" (orange gradient) & "Tentang Kami" (glass border)
   - Slide index counter `01 / 04`, animated progress bar, navigation arrows, scroll mouse indicator
4. **Berita Terkini:**
   - Section header with vertical orange accent bar
   - Featured main article card (50% width) with gradient overlay and "Terbaru" tag
   - 3 stacked compact news cards (50% width) with hover card lift
5. **Layanan & Informasi (Quick Services):**
   - 6 interactive service cards: Profil, Publikasi, Perpustakaan, PPID, LAPOR, Kontak
   - Linear gradient corner glow and directional arrow animation
6. **Statistik & Peta Kebencanaan:**
   - Incident counters for Banjir, Cuaca Ekstrem, Tanah Longsor, Gempa Bumi, dll.
   - Live disaster status summary
7. **Transparansi & Kinerja:**
   - Indeks Kepuasan Masyarakat (IKM) meter (94.76%)
   - Realisasi Anggaran OPD progress bar
8. **Edukasi Bencana & Pengumuman:**
   - 2-column layout: Edukasi Bencana cards + Pengumuman cards
   - PDF/file badges, dates, and direct download links
9. **Galeri Dokumentasi:**
   - Tabs for "Foto Kegiatan" and "Video Edukasi"
   - Grid with hover zoom overlay
10. **Media Sosial & Instagram Feed:**
    - Live-styled cards with Instagram handle and post previews
11. **Link Terkait (Instansi):**
    - BNPB, BMKG, PVMBG, Pemda, Satu Data, Sepakat
12. **Comprehensive Footer:**
    - BPBD Logo with glow
    - Pusdalops 24/7 Emergency Hotline callout
    - Address, phone, email, and social media channels
    - Copyright and legal credits
13. **Floating Controls:**
    - Back-to-top button with orange gradient
    - Accessibility / Disabilitas assistance floating widget

---

## 4. Assets Inventory

- `/images/bpbd.png` - Official BPBD emblem logo
- `/logos/psebpbd.png` - PSE Kominfo certification logo
- `/logos/bnpb.png` - BNPB official logo
- `/logos/bmkg.png` - BMKG official logo
- `/logos/satudata.png` - Satu Data Indonesia logo
- `/logos/sepakat.png` - Sepakat platform logo
- `/logos/sumbarprov.png` - Pemerintah Daerah logo
