"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  FileText,
  AlertTriangle,
  Flame,
  CloudRain,
  Waves,
  Wind,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Download,
  ExternalLink,
  Eye,
  Calendar,
  Share2,
  Volume2,
  ZoomIn,
  CheckCircle2,
  Building,
  HelpCircle,
  Activity,
  ArrowUp,
  Compass,
  Play,
  Radio,
} from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function ClonePage() {
  // Navigation & Dropdown state
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hero Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);

  // Gallery tabs
  const [galleryTab, setGalleryTab] = useState<"semua" | "foto" | "video">("semua");
  const [selectedMedia, setSelectedMedia] = useState<{
    type: "foto" | "video";
    title: string;
    url: string;
    date: string;
    caption: string;
  } | null>(null);

  // Accessibility Widget state
  const [a11yOpen, setA11yOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [readingRuler, setReadingRuler] = useState(false);
  const [mousePos, setMousePos] = useState({ y: 0 });

  // Outbound link modal
  const [outboundTarget, setOutboundTarget] = useState<{ name: string; url: string } | null>(null);

  // Back to top visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  // ============================================
  // POSTGRESQL DYNAMIC CONTENT STATE & DEFAULTS
  // ============================================
  const defaultSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80",
      badge: "Kesiapsiagaan Kebencanaan",
      title: "SELAMAT DATANG DI WEBSITE RESMI",
      subtitle: "BPBD KOTA BITUNG",
      desc: "Garda Terdepan Penanggulangan Bencana Kota Bitung: Cepat, Tanggap, Terpadu, dan Berkeadilan Demi Keselamatan Masyarakat.",
      primaryCta: "Layanan Siaga 24 Jam",
      secondaryCta: "Peringatan Dini Cuaca",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1920&q=80",
      badge: "Mitigasi & Edukasi",
      title: "BANGUN KOTA TANGGUH BENCANA",
      subtitle: "DESTANA & KATANA BITUNG",
      desc: "Mewujudkan Kelurahan Tangguh Bencana dan Edukasi Keluarga Tanggap Darurat di seluruh wilayah pesisir dan perbukitan Kota Bitung.",
      primaryCta: "Modul Edukasi",
      secondaryCta: "Profil Relawan",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1599384852952-64126ea0290e?auto=format&fit=crop&w=1920&q=80",
      badge: "Peringatan Dini & Posko",
      title: "PUSAT PENGENDALIAN OPERASI",
      subtitle: "PUSDALOPS-PB BITUNG",
      desc: "Pemantauan cuaca maritim Selat Lembeh, peringatan dini gelombang pasang, pergerakan tanah, dan pos komando reaksi cepat 24/7.",
      primaryCta: "Call Center 112",
      secondaryCta: "Pantauan Bencana",
    },
  ];

  const defaultStats = [
    { id: 1, name: "Banjir & Genangan", count: 4, icon: CloudRain, trend: "Waspada Musim Hujan", color: "from-blue-500 to-cyan-500" },
    { id: 2, name: "Cuaca Ekstrem / Angin", count: 18, icon: Wind, trend: "Peringatan BMKG Aktif", color: "from-amber-500 to-orange-500" },
    { id: 3, name: "Tanah Longsor", count: 2, icon: AlertTriangle, trend: "Wilayah Tebing Curam", color: "from-emerald-500 to-teal-500" },
    { id: 4, name: "Gelombang Pasang", count: 1, icon: Waves, trend: "Pesisir Lembeh & Aertembaga", color: "from-indigo-500 to-blue-600" },
    { id: 5, name: "Kebakaran Lahan", count: 0, icon: Flame, trend: "Status Terkendali", color: "from-rose-500 to-red-600" },
    { id: 6, name: "Gempa Bumi Terasa", count: 3, icon: Activity, trend: "Monitoring BMKG Bitung", color: "from-purple-500 to-violet-600" },
  ];

  const defaultNews = [
    {
      id: "siaga-hidrometeorologi",
      title: "BPBD Bitung Tetapkan Status Siaga Darurat Bencana Hidrometeorologi Selama 60 Hari",
      date: "19 November 2026",
      category: "Berita Utama",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
      excerpt: "Pemerintah Kota Bitung melalui BPBD menetapkan status siaga darurat cuaca ekstrem menyusul peningkatan curah hujan lebat dan angin kencang di perairan Selat Lembeh.",
      readTime: "3 menit baca",
    },
    {
      id: "apel-reaksi-cepat",
      title: "Gelar Apel Kesiapsiagaan Pasukan Reaksi Cepat Menghadapi Cuaca Ekstrem Akhir Tahun",
      date: "18 November 2026",
      category: "Kesiapsiagaan",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80",
      excerpt: "Ratusan personel gabungan BPBD, Basarnas, TNI/Polri dan relawan kebencanaan disiagakan di seluruh pos komando kecamatan.",
      readTime: "2 menit baca",
    },
    {
      id: "simulasi-evakuasi-lembeh",
      title: "Edukasi & Simulasi Mandiri Evakuasi Gempa Bumi di Kawasan Pesisir Lembeh Selatan",
      date: "15 November 2026",
      category: "Edukasi",
      image: "https://images.unsplash.com/photo-1599384852952-64126ea0290e?auto=format&fit=crop&w=600&q=80",
      excerpt: "Warga masyarakat dan sekolah-sekolah di pesisir Lembeh antusias mengikuti pelatihan jalur evakuasi dan mitigasi tsunami berbasis kearifan lokal.",
      readTime: "4 menit baca",
    },
    {
      id: "penanganan-pohon-tumbang",
      title: "Tim TRC BPBD Gerak Cepat Evakuasi Pohon Tumbang di Ruas Jalan Protokol Girian",
      date: "12 November 2026",
      category: "Tanggap Darurat",
      image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
      excerpt: "Pembersihan material kayu dan pengamanan jaringan kabel listrik diselesaikan dalam waktu kurang dari 45 menit tanpa korban jiwa.",
      readTime: "2 menit baca",
    },
  ];

  const defaultEducations = [
    {
      id: 1,
      title: "Buku Saku Tanggap Bencana Gempa Bumi dan Tsunami Kota Bitung",
      category: "Pedoman Mitigasi",
      format: "PDF",
      size: "4.8 MB",
      date: "November 2026",
      slug: "buku-saku-gempa-tsunami",
    },
    {
      id: 2,
      title: "Panduan Jalur Evakuasi dan Titik Kumpul Darurat Pesisir Lembeh",
      category: "Peta Jalur",
      format: "PDF",
      size: "8.2 MB",
      date: "Oktober 2026",
      slug: "panduan-jalur-evakuasi",
    },
    {
      id: 3,
      title: "SOP Penanganan Bencana Tanah Longsor & Pergerakan Tanah Berbasis Komunitas",
      category: "Standar Operasional",
      format: "PDF",
      size: "2.1 MB",
      date: "September 2026",
      slug: "sop-penanganan-longsor",
    },
    {
      id: 4,
      title: "Brosur Kesiapsiagaan Keluarga Hadapi Cuaca Ekstrem & Angin Puting Beliung",
      category: "Edukasi Keluarga",
      format: "PDF",
      size: "1.5 MB",
      date: "Agustus 2026",
      slug: "brosur-cuaca-ekstrem",
    },
  ];

  const defaultAnnouncements = [
    {
      id: 1,
      title: "Surat Keputusan Walikota Bitung Nomor 360-112-2026 tentang Status Siaga Darurat Hidrometeorologi",
      date: "17 November 2026",
      format: "PDF",
      size: "1.2 MB",
      slug: "sk-walikota-siaga-darurat",
    },
    {
      id: 2,
      title: "Peringatan Dini Cuaca Maritim & Gelombang Tinggi Perairan Bitung - Kepulauan Lembeh",
      date: "16 November 2026",
      format: "PDF",
      size: "850 KB",
      slug: "peringatan-dini-cuaca-maritim",
    },
    {
      id: 3,
      title: "Jadwal Pelatihan Relawan Kelurahan Tangguh Bencana (Destana) Angkatan IV Tahun 2026",
      date: "10 November 2026",
      format: "PDF",
      size: "620 KB",
      slug: "jadwal-pelatihan-destana-iv",
    },
    {
      id: 4,
      title: "Laporan Realisasi Bantuan Logistik Pasca Bencana Gelombang Pasang Triwulan III",
      date: "05 November 2026",
      format: "PDF",
      size: "2.4 MB",
      slug: "laporan-logistik-triwulan-iii",
    },
  ];

  const defaultGallery = [
    {
      id: 1,
      type: "foto" as const,
      title: "Apel Gelar Pasukan Kesiapsiagaan Bencana di Lapangan Kantor Walikota Bitung",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
      date: "18 Nov 2026",
      caption: "Pengecekan kesiapan armada perahu karet, mobil rescue, chainsaw, dan tenda darurat.",
    },
    {
      id: 2,
      type: "foto" as const,
      title: "Pemasangan Rambu Jalur Evakuasi dan Warning Sirine Tsunami di Pantai Pasir Putih",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
      date: "14 Nov 2026",
      caption: "Optimalisasi early warning system untuk kawasan padat penduduk tepi pantai.",
    },
    {
      id: 3,
      type: "video" as const,
      title: "Video Simulasi Tanggap Darurat Gempa dan Tsunami Bersama Pelajar Bitung",
      image: "https://images.unsplash.com/photo-1599384852952-64126ea0290e?auto=format&fit=crop&w=800&q=80",
      date: "11 Nov 2026",
      caption: "Latihan 'Drop, Cover, Hold On' serta evakuasi teratur menuju titik kumpul zona aman.",
    },
    {
      id: 4,
      type: "foto" as const,
      title: "Distribusi Bantuan Logistik dan Tenda Pengungsi untuk Wilayah Terdampak Angin Kencang",
      image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
      date: "08 Nov 2026",
      caption: "Penyaluran selimut, matras, sembako, dan kit higienis kepada warga terdampak.",
    },
  ];

  const [slides, setSlides] = useState(defaultSlides);
  const [disasterStats, setDisasterStats] = useState(defaultStats);
  const [newsItems, setNewsItems] = useState(defaultNews);
  const [educations, setEducations] = useState(defaultEducations);
  const [announcements, setAnnouncements] = useState(defaultAnnouncements);
  const [galleryItems, setGalleryItems] = useState(defaultGallery);
  const [siteSettings, setSiteSettings] = useState({
    site_name: "BPBD KOTA BITUNG",
    site_tagline: "Badan Penanggulangan Bencana Daerah",
    hero_badge: "Kesiapsiagaan Kebencanaan",
    ticker_text: "{siteSettings.ticker_text}",
    call_center_112: "112",
    hotline_pusdalops: "(0438) 31112",
    whatsapp_darurat: "+62 811-4321-112",
    email: "bpbd@bitungkota.go.id",
    alamat: "Kompleks Kantor Walikota Bitung, Jl. Sam Ratulangi No. 45, Kota Bitung, Sulawesi Utara",
    status_siaga: "SIAGA DARURAT 24/7",
    ikm_score: 94.8,
    realisasi_keuangan: 94.76,
    realisasi_fisik: 98.33,
  });

  // LAPOR Bencana Citizen Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportForm, setReportForm] = useState({
    reporter_name: "",
    reporter_phone: "",
    disaster_type: "Pohon Tumbang",
    location: "",
    description: "",
  });

  // Fetch Live Content from PostgreSQL API
  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSiteSettings((prev) => ({ ...prev, ...data.settings }));
        if (data.slides && data.slides.length > 0) {
          setSlides(
            data.slides.map((s: any) => ({
              id: s.id,
              image: s.image_url,
              badge: s.badge || "Kesiapsiagaan Kebencanaan",
              title: s.title,
              subtitle: s.subtitle,
              desc: s.description,
              primaryCta: s.primary_cta_text || "Layanan Siaga 24 Jam",
              secondaryCta: s.secondary_cta_text || "Peringatan Dini Cuaca",
            }))
          );
        }
        if (data.disasterStats && data.disasterStats.length > 0) {
          setDisasterStats(
            data.disasterStats.map((st: any) => {
              const iconMap: Record<string, any> = {
                CloudRain,
                Wind,
                AlertTriangle,
                Waves,
                Flame,
                Activity,
              };
              return {
                id: st.id,
                name: st.name,
                count: st.count,
                trend: st.trend || "Status Terpantau",
                icon: iconMap[st.icon_name] || AlertTriangle,
                color: st.color_gradient || "from-blue-500 to-cyan-500",
              };
            })
          );
        }
        if (data.news && data.news.length > 0) {
          setNewsItems(
            data.news.map((n: any) => ({
              id: n.slug || String(n.id),
              title: n.title,
              date: new Date(n.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }),
              category: n.category,
              image: n.image_url || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
              excerpt: n.excerpt,
              readTime: "3 menit baca",
            }))
          );
        }
        if (data.documents && data.documents.length > 0) {
          const edu = data.documents
            .filter((d: any) => d.type === "edukasi" || d.type === "renstra" || d.type === "sop")
            .map((d: any) => ({
              id: d.id,
              title: d.title,
              category: d.category || "Pedoman Mitigasi",
              format: d.file_format || "PDF",
              size: d.file_size || "1.5 MB",
              date: new Date(d.publish_date || d.created_at).toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              }),
              slug: String(d.id),
            }));
          if (edu.length > 0) setEducations(edu);

          const ann = data.documents
            .filter((d: any) => d.type === "pengumuman")
            .map((d: any) => ({
              id: d.id,
              title: d.title,
              format: d.file_format || "PDF",
              size: d.file_size || "1.2 MB",
              date: new Date(d.publish_date || d.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }),
              slug: String(d.id),
            }));
          if (ann.length > 0) setAnnouncements(ann);
        }
        if (data.gallery && data.gallery.length > 0) {
          setGalleryItems(
            data.gallery.map((g: any) => ({
              id: g.id,
              type: g.type as "foto" | "video",
              title: g.title,
              image: g.media_url,
              date: g.event_date || "20 Nov 2026",
              caption: g.caption || "",
            }))
          );
        }
      })
      .catch((err) => console.log("Menggunakan state fallback"));
  }, []);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitting(true);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportForm),
      });
      if (res.ok) {
        setReportSuccess(true);
        setTimeout(() => {
          setReportSuccess(false);
          setReportModalOpen(false);
          setReportForm({
            reporter_name: "",
            reporter_phone: "",
            disaster_type: "Pohon Tumbang",
            location: "",
            description: "",
          });
        }, 3000);
      } else {
        const d = await res.json();
        alert(d.message || "Gagal mengirim laporan");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setReportSubmitting(false);
    }
  };


  // Auto slide effect
  useEffect(() => {
    if (sliderPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sliderPaused, slides.length]);

  // Window scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Accessibility Ruler Mouse Tracking
  useEffect(() => {
    if (!readingRuler) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [readingRuler]);

  // Accessibility class toggles
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    if (largeText) {
      document.body.classList.add("large-font");
    } else {
      document.body.classList.remove("large-font");
    }
  }, [largeText]);

  // Dropdown hover helpers
  const handleMouseEnter = (menuName: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtered gallery items
  const filteredGallery = galleryItems.filter((item) => {
    if (galleryTab === "foto") return item.type === "foto";
    if (galleryTab === "video") return item.type === "video";
    return true;
  });

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-800 antialiased overflow-x-hidden">
      {/* ============================================
          READING RULER (ACCESSIBILITY FEATURE)
          ============================================ */}
      {readingRuler && (
        <div
          className="pointer-events-none fixed left-0 right-0 z-50 h-10 bg-amber-400/25 border-y-2 border-amber-500 shadow-sm transition-all duration-75"
          style={{ top: `${mousePos.y - 20}px` }}
        />
      )}

      {/* ============================================
          TOP EMERGENCY ALERT & HOTLINE TICKER
          ============================================ */}
      <div className="bg-[#0f172a] text-slate-200 border-b border-white/10 text-xs py-2 px-4 select-none">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Running alert ticker */}
          <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
            <span className="shrink-0 flex items-center gap-1.5 bg-[#ea580c] text-white px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-sm animate-pulse">
              <Radio className="w-3 h-3 animate-spin" /> Peringatan Dini
            </span>
            <div className="overflow-hidden whitespace-nowrap text-[11px] text-slate-300">
              <span className="inline-block animate-marquee">
                {siteSettings.ticker_text}
              </span>
            </div>
          </div>

          {/* Hotline contacts & quick accessibility */}
          <div className="hidden lg:flex items-center gap-6 shrink-0 text-slate-300 text-[11px]">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#fb923c]" />
              <span>Jumat, 20 November 2026</span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <a
              href="tel:112"
              className="flex items-center gap-1.5 font-bold text-[#fb923c] hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hotline Darurat: 112 / (0438) 31112</span>
            </a>
            <div className="h-3 w-px bg-white/20" />
            <button
              onClick={() => setA11yOpen(!a11yOpen)}
              className="flex items-center gap-1 text-slate-300 hover:text-[#fb923c] font-medium transition"
              title="Fitur Aksesibilitas Disabilitas"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#fb923c]" />
              <span>Aksesibilitas</span>
            </button>
            <div className="h-3 w-px bg-white/20" />
            <Link
              href="/admin"
              className="flex items-center gap-1 text-amber-300 hover:text-white font-bold transition px-2 py-0.5 rounded-md bg-white/10 hover:bg-[#ea580c]"
              title="Masuk ke Panel Backoffice Admin"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Backoffice</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================
          MAIN NAVIGATION (HEADER)
          ============================================ */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3 text-slate-900 border-b border-slate-100"
            : "bg-white py-4 text-slate-900 border-b border-slate-200"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative shrink-0">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#ea580c] p-0.5 bg-white shadow-md shadow-orange-500/20 flex items-center justify-center transition-transform group-hover:scale-105">
                <Image
                  src="/bpbd.png"
                  alt="Logo BPBD"
                  width={52}
                  height={52}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">
                Badan Penanggulangan Bencana Daerah
              </span>
              <span className="text-base md:text-xl font-extrabold tracking-tight text-[#172554] group-hover:text-[#ea580c] transition-colors leading-tight">
                BPBD KOTA BITUNG
              </span>
              <span className="text-[9px] font-medium text-[#ea580c]">
                Pemerintah Kota Bitung • Sulawesi Utara
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Mega-menus */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-semibold text-slate-700">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-lg hover:text-[#ea580c] hover:bg-orange-50/70 transition-colors"
            >
              Beranda
            </Link>

            {/* Dropdown: Profil */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("profil")}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 px-3.5 py-2 rounded-lg hover:text-[#ea580c] hover:bg-orange-50/70 transition-colors">
                <span>Profil</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
              </button>

              <AnimatePresence>
                {activeDropdown === "profil" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50"
                  >
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                      Tentang BPBD Bitung
                    </div>
                    <Link
                      href="#profil"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-[#ea580c] transition text-sm"
                    >
                      <Building className="w-4 h-4 text-[#ea580c]" />
                      <span>Visi & Misi Organisasi</span>
                    </Link>
                    <Link
                      href="#profil"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-[#ea580c] transition text-sm"
                    >
                      <Shield className="w-4 h-4 text-[#ea580c]" />
                      <span>Tugas Pokok & Fungsi</span>
                    </Link>
                    <Link
                      href="#profil"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-[#ea580c] transition text-sm"
                    >
                      <FileText className="w-4 h-4 text-[#ea580c]" />
                      <span>Struktur Organisasi & Pejabat</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dropdown: Layanan & Siaga */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("layanan")}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 px-3.5 py-2 rounded-lg hover:text-[#ea580c] hover:bg-orange-50/70 transition-colors">
                <span>Layanan & Siaga</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {activeDropdown === "layanan" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50"
                  >
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                      Pelayanan Kebencanaan
                    </div>
                    <Link
                      href="#layanan"
                      className="flex items-start gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-[#ea580c] transition text-sm"
                    >
                      <Radio className="w-4 h-4 text-[#ea580c] mt-0.5" />
                      <div>
                        <div className="font-semibold">Pusdalops 24 Jam</div>
                        <div className="text-xs text-slate-400 font-normal">Penerimaan laporan darurat bencana</div>
                      </div>
                    </Link>
                    <Link
                      href="#layanan"
                      className="flex items-start gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-[#ea580c] transition text-sm"
                    >
                      <AlertTriangle className="w-4 h-4 text-[#ea580c] mt-0.5" />
                      <div>
                        <div className="font-semibold">Reaksi Cepat Lapangan (TRC)</div>
                        <div className="text-xs text-slate-400 font-normal">Penanganan banjir, longsor & pohon tumbang</div>
                      </div>
                    </Link>
                    <Link
                      href="#layanan"
                      className="flex items-start gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-[#ea580c] transition text-sm"
                    >
                      <Shield className="w-4 h-4 text-[#ea580c] mt-0.5" />
                      <div>
                        <div className="font-semibold">Rekomendasi Teknis Kebencanaan</div>
                        <div className="text-xs text-slate-400 font-normal">Kajian risiko tata ruang & izin lingkungan</div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dropdown: Publikasi */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("publikasi")}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 px-3.5 py-2 rounded-lg hover:text-[#ea580c] hover:bg-orange-50/70 transition-colors">
                <span>Publikasi</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {activeDropdown === "publikasi" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50"
                  >
                    <Link
                      href="#berita"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-[#ea580c] transition text-sm"
                    >
                      <FileText className="w-4 h-4 text-[#ea580c]" />
                      <span>Berita Terkini</span>
                    </Link>
                    <Link
                      href="#pengumuman"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-[#ea580c] transition text-sm"
                    >
                      <Radio className="w-4 h-4 text-[#ea580c]" />
                      <span>Pengumuman Resmi</span>
                    </Link>
                    <Link
                      href="#galeri"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-[#ea580c] transition text-sm"
                    >
                      <Eye className="w-4 h-4 text-[#ea580c]" />
                      <span>Galeri Foto & Video</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Perpustakaan & Dokumen */}
            <Link
              href="#edukasi"
              className="px-3.5 py-2 rounded-lg hover:text-[#ea580c] hover:bg-orange-50/70 transition-colors"
            >
              Perpustakaan
            </Link>

            {/* PPID */}
            <Link
              href="#kinerja"
              className="px-3.5 py-2 rounded-lg hover:text-[#ea580c] hover:bg-orange-50/70 transition-colors"
            >
              PPID
            </Link>

            {/* Kontak */}
            <Link
              href="#kontak"
              className="px-3.5 py-2 rounded-lg hover:text-[#ea580c] hover:bg-orange-50/70 transition-colors"
            >
              Kontak
            </Link>
          </nav>

          {/* Action Tools: Search & LAPOR CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#ea580c] hover:border-[#ea580c] transition-all"
              aria-label="Cari Informasi"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* LAPOR Button */}
            <Link
              href="#lapor"
              onClick={(e) => { e.preventDefault(); setReportModalOpen(true); }}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold text-sm shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>LAPOR BENCANA</span>
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="xl:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-3"
            >
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-800 font-bold hover:bg-orange-50 rounded-lg"
              >
                Beranda
              </Link>
              <Link
                href="#profil"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-800 font-bold hover:bg-orange-50 rounded-lg"
              >
                Profil BPBD
              </Link>
              <Link
                href="#layanan"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-800 font-bold hover:bg-orange-50 rounded-lg"
              >
                Layanan & Informasi
              </Link>
              <Link
                href="#berita"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-800 font-bold hover:bg-orange-50 rounded-lg"
              >
                Berita Terkini
              </Link>
              <Link
                href="#edukasi"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-800 font-bold hover:bg-orange-50 rounded-lg"
              >
                Edukasi Bencana & Pengumuman
              </Link>
              <Link
                href="#kinerja"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-800 font-bold hover:bg-orange-50 rounded-lg"
              >
                Transparansi & PPID
              </Link>
              <Link
                href="#kontak"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-slate-800 font-bold hover:bg-orange-50 rounded-lg"
              >
                Kontak & Pusdalops
              </Link>
              <div className="pt-2">
                <Link
                  href="#lapor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#ea580c] text-white font-bold rounded-xl text-center shadow-md shadow-orange-500/30"
                >
                  <AlertTriangle className="w-4 h-4" /> LAPOR BENCANA DARURAT
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============================================
          SEARCH MODAL DIALOG
          ============================================ */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Search className="w-5 h-5 text-[#ea580c]" />
                  <span>Pencarian Informasi Portal BPBD</span>
                </div>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Cari berita, SOP, dokumen, peringatan dini..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#ea580c] text-sm"
                  autoFocus
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                  Pencarian Populer
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("Siaga Darurat");
                    setSearchOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-orange-50 hover:text-[#ea580c] flex items-center justify-between"
                >
                  <span>Status Siaga Darurat Cuaca Ekstrem</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
                <button
                  onClick={() => {
                    setSearchQuery("Buku Saku Gempa");
                    setSearchOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-orange-50 hover:text-[#ea580c] flex items-center justify-between"
                >
                  <span>Buku Saku Mitigasi Gempa & Tsunami</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
                <button
                  onClick={() => {
                    setSearchQuery("Kontak Pusdalops");
                    setSearchOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-orange-50 hover:text-[#ea580c] flex items-center justify-between"
                >
                  <span>Nomor Telepon Pusdalops dan Posko Bencana</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================
          HERO SECTION CAROUSEL
          ============================================ */}
      <section
        className="relative h-[82vh] min-h-[580px] md:h-screen w-full overflow-hidden bg-[#0f172a]"
        onMouseEnter={() => setSliderPaused(true)}
        onMouseLeave={() => setSliderPaused(false)}
      >
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background with Zoom Effect */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-7000 ease-out"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                }}
              />

              {/* Gradient Overlays matching original portal */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-[#172554]/90 z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#172554]/50 via-transparent to-[#172554]/50 z-10" />

              {/* Foreground Content */}
              <div className="relative z-20 h-full container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center text-white pt-16">
                {/* Accent top line */}
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#ea580c] to-transparent mb-5" />

                {/* Badge */}
                <div className="mb-4">
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#ea580c] font-bold border border-[#ea580c]/50 px-4 py-1.5 rounded-full inline-block backdrop-blur-md bg-[#ea580c]/15 shadow-lg shadow-orange-500/10">
                    {slide.badge}
                  </span>
                </div>

                {/* Main Heading & Subtitle */}
                <h2 className="text-sm sm:text-lg md:text-xl font-semibold tracking-[0.2em] uppercase text-white/80 drop-shadow-md">
                  {slide.title}
                </h2>
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-wide text-white drop-shadow-xl mt-2 mb-4 leading-tight">
                  {slide.subtitle}
                </h1>

                {/* Divider dots */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ea580c] shadow-[0_0_12px_#ea580c]" />
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/40" />
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg max-w-2xl text-white/85 leading-relaxed drop-shadow-md mb-8">
                  {slide.desc}
                </p>

                {/* Action CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href="#berita"
                    className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold text-sm shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:shadow-[0_0_40px_rgba(234,88,12,0.65)] hover:scale-105 transition-all inline-flex items-center gap-2"
                  >
                    <span>{slide.primaryCta}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="#profil"
                    className="px-8 py-3.5 rounded-full border border-white/30 text-white font-bold text-sm backdrop-blur-sm hover:bg-white/10 hover:border-white/60 transition-all inline-flex items-center gap-2"
                  >
                    <span>{slide.secondaryCta}</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Next & Previous Buttons */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/30 bg-black/30 backdrop-blur-md items-center justify-center text-white hover:bg-[#ea580c] hover:border-[#ea580c] hover:scale-110 transition-all"
          aria-label="Slide sebelumnya"
        >
          <ChevronDown className="w-6 h-6 rotate-90" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/30 bg-black/30 backdrop-blur-md items-center justify-center text-white hover:bg-[#ea580c] hover:border-[#ea580c] hover:scale-110 transition-all"
          aria-label="Slide berikutnya"
        >
          <ChevronDown className="w-6 h-6 -rotate-90" />
        </button>

        {/* Slide Counter & Progress Indicator */}
        <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2.5">
          <span className="text-[11px] text-white/70 tracking-[0.25em] font-medium">
            0{currentSlide + 1} / 0{slides.length}
          </span>
          <div className="w-44 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              key={currentSlide}
              className="h-full bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-full animate-slider-progress"
            />
          </div>
          <div className="flex gap-2 mt-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "bg-[#ea580c] w-7" : "bg-white/40 w-2 hover:bg-white/70"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll Mouse Indicator */}
        <div className="hidden lg:flex absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-1 opacity-60 hover:opacity-100 transition">
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/70 font-semibold">Scroll</span>
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/80 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ============================================
          QUICK EMERGENCY CALLOUT BANNER
          ============================================ */}
      <section className="bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#0f172a] text-white py-6 border-b border-orange-500/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Call Center 112 */}
            <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10 hover:border-orange-500/50 transition">
              <div className="w-12 h-12 rounded-xl bg-[#ea580c] flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30 animate-pulse-glow">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Panggilan Darurat</span>
                <div className="text-xl font-extrabold tracking-tight">Call Center 112</div>
                <div className="text-xs text-slate-300">Bebas Pulsa 24 Jam Nonstop</div>
              </div>
            </div>

            {/* Pusdalops Posko */}
            <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/10 hover:border-orange-500/50 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">PUSDALOPS-PB BITUNG</span>
                <div className="text-lg font-extrabold tracking-tight">(0438) 31112</div>
                <div className="text-xs text-slate-300">Posko Reaksi Cepat Bencana</div>
              </div>
            </div>

            {/* Status Siaga */}
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-orange-600/20 to-amber-500/10 rounded-2xl border border-[#ea580c]/40">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <div className="text-xs font-bold text-orange-300 uppercase tracking-wide">Status Operasional</div>
                  <div className="text-sm font-extrabold text-white">SIAGA DARURAT 24/7</div>
                </div>
              </div>
              <Link
                href="#peta-bencana"
                className="px-3.5 py-1.5 rounded-xl bg-[#ea580c] hover:bg-orange-600 text-white font-bold text-xs shadow-md transition"
              >
                Pantau Data
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          BERITA TERKINI SECTION
          ============================================ */}
      <section id="berita" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 border-b border-slate-200 pb-5 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-12 bg-gradient-to-b from-[#ea580c] to-[#f97316] rounded-full" />
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Berita Terkini
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Informasi aktual seputar kebencanaan dan kegiatan mitigasi BPBD Kota Bitung
                </p>
              </div>
            </div>

            <Link
              href="#berita"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#ea580c] hover:text-[#c2410c] transition group"
            >
              <span>Lihat Semua Berita</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* News Grid (1 Featured Large Card + 3 Stacked Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured Main Article */}
            <div className="group cursor-pointer flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-500/10 border border-slate-100 hover:border-orange-500/30 transition-all duration-500 hover-card-lift">
              <div className="relative h-72 sm:h-80 overflow-hidden">
                <Image
                  src={newsItems[0].image}
                  alt={newsItems[0].title}
                  fill
                  className="object-cover hover-zoom-img"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    {newsItems[0].category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-4 text-xs text-white/80 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#fb923c]" />
                      {newsItems[0].date}
                    </span>
                    <span>•</span>
                    <span>{newsItems[0].readTime}</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-extrabold leading-snug drop-shadow-md group-hover:text-orange-200 transition">
                    {newsItems[0].title}
                  </h4>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {newsItems[0].excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-[#ea580c]">
                  <span className="flex items-center gap-1.5 group-hover:underline">
                    Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-slate-400 font-normal">Humas BPBD Bitung</span>
                </div>
              </div>
            </div>

            {/* 3 Compact Stacked Cards */}
            <div className="flex flex-col gap-4">
              {newsItems.slice(1, 4).map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-orange-500/30 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 hover-card-lift"
                >
                  <div className="relative w-full sm:w-44 h-36 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover hover-zoom-img"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-[#ea580c] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.date}</span>
                      </div>
                      <h5 className="font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors leading-snug line-clamp-2 text-base">
                        {item.title}
                      </h5>
                      <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center text-xs font-bold text-[#ea580c] group-hover:underline">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          LAYANAN & INFORMASI UTAMA (6 CARDS)
          ============================================ */}
      <section id="layanan" className="py-20 bg-slate-50 border-y border-slate-200/70">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ea580c] bg-orange-100 px-3.5 py-1 rounded-full">
              Pelayanan Terpadu
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Layanan & Informasi Utama
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              Akses cepat dan transparan ke seluruh layanan publik penanggulangan bencana daerah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Profil */}
            <div className="group rounded-3xl bg-white p-7 border border-slate-200/80 hover:border-orange-500/50 shadow-sm hover:shadow-xl transition-all duration-300 hover-card-lift relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#ea580c] flex items-center justify-center mb-5 shadow-inner">
                  <Building className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-[#ea580c] transition">
                  Profil Organisasi
                </h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Informasi visi, misi, struktur kelembagaan, serta tugas pokok dan fungsi BPBD Kota Bitung.
                </p>
              </div>
              <Link
                href="#profil"
                className="mt-6 inline-flex items-center gap-1.5 font-bold text-sm text-[#ea580c] group-hover:underline"
              >
                <span>Lihat Profil</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 2: Publikasi */}
            <div className="group rounded-3xl bg-white p-7 border border-slate-200/80 hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all duration-300 hover-card-lift relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 shadow-inner">
                  <FileText className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                  Publikasi & Kabar
                </h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Kumpulan rilis pers, berita operasional penanganan darurat, galeri kegiatan, dan majalah bencana.
                </p>
              </div>
              <Link
                href="#berita"
                className="mt-6 inline-flex items-center gap-1.5 font-bold text-sm text-blue-600 group-hover:underline"
              >
                <span>Lihat Publikasi</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 3: Perpustakaan */}
            <div className="group rounded-3xl bg-white p-7 border border-slate-200/80 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all duration-300 hover-card-lift relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 shadow-inner">
                  <Compass className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition">
                  Perpustakaan Digital
                </h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Arsip dokumen Renstra, Dokumen Kajian Risiko Bencana (KRB), Rencana Penanggulangan Bencana (RPB), dan SOP.
                </p>
              </div>
              <Link
                href="#edukasi"
                className="mt-6 inline-flex items-center gap-1.5 font-bold text-sm text-emerald-600 group-hover:underline"
              >
                <span>Akses Dokumen</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 4: PPID */}
            <div className="group rounded-3xl bg-white p-7 border border-slate-200/80 hover:border-purple-500/50 shadow-sm hover:shadow-xl transition-all duration-300 hover-card-lift relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5 shadow-inner">
                  <Shield className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-purple-600 transition">
                  Layanan PPID
                </h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Layanan keterbukaan informasi publik secara berkala, serta merta, dan mekanisme permohonan informasi resmi.
                </p>
              </div>
              <Link
                href="#kinerja"
                className="mt-6 inline-flex items-center gap-1.5 font-bold text-sm text-purple-600 group-hover:underline"
              >
                <span>Akses PPID</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 5: LAPOR */}
            <div className="group rounded-3xl bg-white p-7 border border-slate-200/80 hover:border-rose-500/50 shadow-sm hover:shadow-xl transition-all duration-300 hover-card-lift relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5 shadow-inner">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-rose-600 transition">
                  LAPOR Pengaduan
                </h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Sampaikan pengaduan, laporan potensi bencana, kritik, dan saran pembangunan mitigasi daerah secara online.
                </p>
              </div>
              <Link
                href="#lapor"
                className="mt-6 inline-flex items-center gap-1.5 font-bold text-sm text-rose-600 group-hover:underline"
              >
                <span>Lapor Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 6: Kontak */}
            <div className="group rounded-3xl bg-white p-7 border border-slate-200/80 hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all duration-300 hover-card-lift relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5 shadow-inner">
                  <Phone className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-amber-600 transition">
                  Kontak & Pos Komando
                </h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Lokasi kantor, saluran komunikasi radio darurat, email resmi, dan alamat sekretariat posko Pusdalops.
                </p>
              </div>
              <Link
                href="#kontak"
                className="mt-6 inline-flex items-center gap-1.5 font-bold text-sm text-amber-600 group-hover:underline"
              >
                <span>Hubungi Kami</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          PETA & STATISTIK KEBENCANAAN
          ============================================ */}
      <section id="peta-bencana" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 pb-4 border-b border-slate-200 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                Monitoring Real-Time
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Statistik Kejadian Bencana Tahun 2026
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Data terintegrasi Pusdalops-PB mengenai frekuensi kejadian bencana di Kota Bitung
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl text-xs font-bold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Update Data: 20 November 2026</span>
            </div>
          </div>

          {/* Disaster Counters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {disasterStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-orange-500/40 hover:bg-white shadow-sm hover:shadow-lg transition-all text-center flex flex-col items-center justify-between group"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 my-1">{stat.count}</div>
                  <div className="text-xs font-bold text-slate-700 leading-tight mb-2">{stat.name}</div>
                  <div className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 w-full truncate">
                    {stat.trend}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Map & Emergency Summary Card */}
          <div className="mt-8 bg-gradient-to-br from-[#172554] to-[#0f172a] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#fb923c] bg-orange-500/20 px-3.5 py-1 rounded-full border border-orange-500/30">
                Peta Risiko Bencana
              </span>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                Sistem Informasi Geografis Kebencanaan Kota Bitung
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Akses peta tematik daerah rawan longsor perbukitan Dua Sudara, jalur rawan banjir perkotaan, dan zona ancaman abrasi pesisir Selat Lembeh berbasis WebGIS interaktif.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => alert("Peta WebGIS Kebencanaan Terbuka")}
                className="px-6 py-3.5 rounded-full bg-[#ea580c] hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" /> Buka WebGIS Interaktif
              </button>
              <button
                onClick={() => alert("Unduh Katalog Peta Risiko (PDF)")}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Unduh Peta KRB (PDF)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          TRANSPARANSI & KINERJA ORGANISASI
          ============================================ */}
      <section id="kinerja" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ea580c] bg-orange-100 px-3.5 py-1 rounded-full">
              Akuntabilitas Publik
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Transparansi & Capaian Kinerja
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              Laporan berkala mengenai tingkat kepuasan masyarakat serta realisasi program penanggulangan bencana
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* IKM Meter Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">Indeks Kepuasan Masyarakat (IKM)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Survei Kepuasan Pelayanan Publik BPBD Tahun 2026</p>
                </div>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  Kategori A (Sangat Baik)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8 py-4">
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-slate-100"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-[#ea580c]"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="13"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-slate-900">94.8%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Skor IKM</span>
                  </div>
                </div>

                <div className="space-y-3 w-full">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Kecepatan Respon Panggilan TRC</span>
                      <span className="text-[#ea580c]">96.2%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ea580c] rounded-full" style={{ width: "96.2%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Kualitas Bantuan & Evakuasi</span>
                      <span className="text-[#ea580c]">95.0%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ea580c] rounded-full" style={{ width: "95%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Keterbukaan Informasi & Edukasi</span>
                      <span className="text-[#ea580c]">93.5%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ea580c] rounded-full" style={{ width: "93.5%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Realisasi Anggaran OPD */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-xl font-extrabold text-slate-900">Realisasi Keuangan & Fisik OPD</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Laporan Akuntabilitas Kinerja Anggaran BPBD 2026</p>
                  </div>
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    Sesuai Target
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-400 font-medium">Realisasi Keuangan</span>
                    <div className="text-2xl font-extrabold text-[#ea580c] mt-1">94.76%</div>
                    <span className="text-[11px] text-emerald-600 font-bold">Target 99.9%</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-400 font-medium">Realisasi Fisik</span>
                    <div className="text-2xl font-extrabold text-blue-600 mt-1">98.33%</div>
                    <span className="text-[11px] text-emerald-600 font-bold">Target 99.9%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Penggunaan anggaran difokuskan pada pengadaan logistik kedaruratan, pemeliharaan peralatan early warning system, serta pelatihan kelurahan tangguh bencana.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Sumber: SIMBANGDA Kota Bitung</span>
                <Link
                  href="#kinerja"
                  className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1"
                >
                  Detail Laporan Keuangan <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          EDUKASI BENCANA & PENGUMUMAN RESMI
          ============================================ */}
      <section id="edukasi" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Edukasi Bencana */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg shadow-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-slate-900">Edukasi & Mitigasi</h4>
                    <p className="text-xs text-slate-400">Modul panduan keselamatan untuk masyarakat</p>
                  </div>
                </div>
                <Link href="#edukasi" className="text-xs font-bold text-[#ea580c] hover:underline">
                  Semua Dokumen
                </Link>
              </div>

              <div className="space-y-4">
                {educations.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-500/40 hover:bg-orange-50/20 transition flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#ea580c] flex flex-col items-center justify-center font-extrabold text-[10px] shrink-0">
                        <FileText className="w-4 h-4 mb-0.5" />
                        <span>PDF</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate group-hover:text-[#ea580c] transition">
                          {doc.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{doc.category}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Mengunduh: ${doc.title}`)}
                      className="shrink-0 px-3.5 py-1.5 rounded-xl border border-orange-500/30 text-xs font-bold text-[#ea580c] hover:bg-[#ea580c] hover:text-white transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Pengumuman Resmi */}
            <div id="pengumuman" className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg shadow-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-slate-900">Pengumuman Resmi</h4>
                    <p className="text-xs text-slate-400">Instruksi, surat edaran, dan info kedinasan</p>
                  </div>
                </div>
                <Link href="#pengumuman" className="text-xs font-bold text-blue-600 hover:underline">
                  Lihat Semua
                </Link>
              </div>

              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-500/40 hover:bg-blue-50/20 transition flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex flex-col items-center justify-center font-extrabold text-[10px] shrink-0">
                        <FileText className="w-4 h-4 mb-0.5" />
                        <span>PDF</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                          {ann.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{ann.date}</span>
                          <span>•</span>
                          <span>{ann.size}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Mengunduh: ${ann.title}`)}
                      className="shrink-0 px-3.5 py-1.5 rounded-xl border border-blue-400/40 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          GALERI DOKUMENTASI (FOTO & VIDEO)
          ============================================ */}
      <section id="galeri" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 pb-4 border-b border-slate-200 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                Dokumentasi Lapangan
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Galeri Foto & Video Kegiatan
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Rekam jejak aksi nyata personel BPBD Kota Bitung bersama relawan dan masyarakat
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl">
              <button
                onClick={() => setGalleryTab("semua")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  galleryTab === "semua" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setGalleryTab("foto")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  galleryTab === "foto" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Foto
              </button>
              <button
                onClick={() => setGalleryTab("video")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  galleryTab === "video" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Video
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia({ ...item, url: item.image })}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all duration-300 hover-card-lift flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover hover-zoom-img"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      {item.type}
                    </span>
                  </div>
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#ea580c] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold">
                    <span className="text-[10px] text-white/70">{item.date}</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h5 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-[#ea580c] transition">
                    {item.title}
                  </h5>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox / Media Viewer Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl"
            >
              <div className="relative h-72 sm:h-96 w-full bg-slate-900">
                <Image
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-[#ea580c] uppercase">{selectedMedia.type}</span>
                <h4 className="text-lg font-extrabold text-slate-900 mt-1">{selectedMedia.title}</h4>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{selectedMedia.caption}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Tanggal Dokumentasi: {selectedMedia.date}</span>
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================
          MEDIA SOSIAL & INSTAGRAM FEED
          ============================================ */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-4 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-500 text-white flex items-center justify-center shadow-md">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Instagram Resmi @bpbdkotabitung</h3>
                <p className="text-xs text-slate-400">Ikuti kabar siaga dan kegiatan kebencanaan setiap hari</p>
              </div>
            </div>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                setOutboundTarget({ name: "Instagram BPBD", url: "https://instagram.com" });
              }}
              className="px-5 py-2 rounded-full border border-pink-500/30 text-pink-600 font-bold text-xs hover:bg-pink-50 transition flex items-center gap-1.5"
            >
              <InstagramIcon className="w-4 h-4" /> Ikuti di Instagram
            </a>
          </div>

          {/* Social Preview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {newsItems.map((item, idx) => (
              <div
                key={idx}
                className="group relative h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer"
                onClick={() => setOutboundTarget({ name: "Instagram BPBD", url: "https://instagram.com" })}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center text-white">
                  <InstagramIcon className="w-6 h-6 mb-1 text-pink-300" />
                  <span className="text-xs font-bold line-clamp-2">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          LINK TERKAIT & PORTAL LEMBAGA
          ============================================ */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Kerjasama & Integrasi Portal Kebencanaan
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-80 hover:opacity-100 transition-opacity">
            {/* BNPB */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="relative w-16 h-16 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                <Image
                  src="/logos/bnpb.png"
                  alt="BNPB"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-600 group-hover:text-[#ea580c]">BNPB</span>
            </div>

            {/* BMKG */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="relative w-16 h-16 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                <Image
                  src="/logos/bmkg.png"
                  alt="BMKG"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-600 group-hover:text-[#ea580c]">BMKG</span>
            </div>

            {/* Satu Data */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="relative w-16 h-16 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                <Image
                  src="/logos/satudata.png"
                  alt="Satu Data"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-600 group-hover:text-[#ea580c]">Satu Data</span>
            </div>

            {/* Sepakat */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="relative w-16 h-16 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                <Image
                  src="/logos/sepakat.png"
                  alt="Sepakat"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-600 group-hover:text-[#ea580c]">SEPAKAT</span>
            </div>

            {/* Pemerintah Daerah */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="relative w-16 h-16 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                <Image
                  src="/logos/sumbarprov.png"
                  alt="Pemda"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-600 group-hover:text-[#ea580c]">Pemkot Bitung</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          LAPOR SECTION / CALL TO ACTION
          ============================================ */}
      <section id="lapor" className="py-16 bg-gradient-to-r from-[#ea580c] to-[#c2410c] text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-black/15 p-8 sm:p-12 rounded-3xl border border-white/15">
            <div className="max-w-xl space-y-3">
              <span className="text-xs uppercase tracking-widest font-extrabold bg-white text-[#ea580c] px-3.5 py-1 rounded-full inline-block">
                Layanan Cepat Tanggap
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Melihat Potensi atau Kejadian Bencana?
              </h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed">
                Laporkan segera ke Pusdalops BPBD Kota Bitung. Setiap laporan akan diverifikasi dan ditindaklanjuti oleh Tim Reaksi Cepat (TRC).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
              <a
                href="tel:112"
                className="px-8 py-4 rounded-full bg-white text-[#ea580c] font-extrabold text-sm shadow-xl hover:bg-orange-50 hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Telepon Call Center 112
              </a>
              <button
                onClick={() => setReportModalOpen(true)}
                className="px-8 py-4 rounded-full bg-black/30 hover:bg-black/50 text-white font-extrabold text-sm border border-white/30 transition flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" /> Formulir Laporan Online
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer id="kontak" className="bg-[#0f172a] text-slate-300 pt-16 pb-8 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Col 1: Logo & Vision */}
            <div className="md:col-span-4 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#ea580c] p-0.5 bg-white shrink-0 shadow-md">
                  <Image
                    src="/bpbd.png"
                    alt="Logo BPBD"
                    width={60}
                    height={60}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-[#fb923c] leading-tight">
                    BPBD KOTA BITUNG
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Badan Penanggulangan Bencana Daerah</p>
                </div>
              </div>

              <p className="text-xs text-slate-300/80 leading-relaxed">
                Siap siaga menghadapi bencana demi mewujudkan masyarakat Kota Bitung yang tangguh, mandiri, dan terlindungi dari segala potensi bencana.
              </p>

              {/* Social Channels */}
              <div className="flex gap-2.5 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#ea580c] text-white flex items-center justify-center transition"
                  aria-label="Facebook BPBD"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#ea580c] text-white flex items-center justify-center transition"
                  aria-label="Instagram BPBD"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#ea580c] text-white flex items-center justify-center transition"
                  aria-label="YouTube BPBD"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>

              {/* PSE Kominfo Logo */}
              <div className="pt-2">
                <div className="relative w-36 h-12 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition">
                  <Image
                    src="/logos/psebpbd.png"
                    alt="PSE Kominfo"
                    fill
                    className="object-contain object-left"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Col 2: Menu Cepat */}
            <div className="md:col-span-2 space-y-4">
              <h5 className="font-extrabold text-sm uppercase text-white flex items-center gap-2">
                <div className="w-1 h-4 bg-[#ea580c] rounded-full" /> Tautan Cepat
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/" className="hover:text-[#fb923c] transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#ea580c]" /> Beranda
                  </Link>
                </li>
                <li>
                  <Link href="#profil" className="hover:text-[#fb923c] transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#ea580c]" /> Visi & Misi
                  </Link>
                </li>
                <li>
                  <Link href="#berita" className="hover:text-[#fb923c] transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#ea580c]" /> Berita Terbaru
                  </Link>
                </li>
                <li>
                  <Link href="#edukasi" className="hover:text-[#fb923c] transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#ea580c]" /> Perpustakaan Dokumen
                  </Link>
                </li>
                <li>
                  <Link href="#kinerja" className="hover:text-[#fb923c] transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#ea580c]" /> Layanan PPID
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Layanan Kebencanaan */}
            <div className="md:col-span-3 space-y-4">
              <h5 className="font-extrabold text-sm uppercase text-white flex items-center gap-2">
                <div className="w-1 h-4 bg-[#ea580c] rounded-full" /> Layanan Bencana
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="#layanan" className="hover:text-[#fb923c] transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#ea580c]" /> Pusdalops Siaga 24 Jam
                  </Link>
                </li>
                <li>
                  <Link href="#layanan" className="hover:text-[#fb923c] transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#ea580c]" /> Tim Reaksi Cepat (TRC)
                  </Link>
                </li>
                <li>
                  <Link href="#layanan" className="hover:text-[#fb923c] transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#ea580c]" /> Distribusi Logistik Korban
                  </Link>
                </li>
                <li>
                  <Link href="#edukasi" className="hover:text-[#fb923c] transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#ea580c]" /> Pelatihan Destana Bitung
                  </Link>
                </li>
                <li>
                  <Link href="#peta-bencana" className="hover:text-[#fb923c] transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#ea580c]" /> Peta Rawan Bencana
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Hubungi Kami & Pusdalops Hotline */}
            <div className="md:col-span-3 space-y-4">
              <h5 className="font-extrabold text-sm uppercase text-white flex items-center gap-2">
                <div className="w-1 h-4 bg-[#ea580c] rounded-full" /> Hubungi Kami
              </h5>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#fb923c] shrink-0 mt-0.5" />
                  <span>Kompleks Kantor Walikota Bitung, Jl. Sam Ratulangi No. 45, Kota Bitung, Sulawesi Utara</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#fb923c] shrink-0" />
                  <span>bpbd@bitungkota.go.id</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#fb923c] shrink-0" />
                  <span>Telepon Kantor: (0438) 31112</span>
                </div>
              </div>

              {/* Pusdalops Box */}
              <div className="mt-4 p-4 rounded-2xl bg-[#ea580c]/15 border border-[#ea580c]/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ea580c] flex items-center justify-center shrink-0 shadow-md animate-pulse-glow">
                  <Radio className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-white/60">PUSDALOPS BITUNG</span>
                  <div className="text-base font-extrabold text-[#fb923c]">Hotline: (0438) 31112</div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>© 2026 BPBD Kota Bitung • Diskominfo Kota Bitung. Hak Cipta Dilindungi.</p>
            <div className="flex gap-4">
              <Link href="#profil" className="hover:text-slate-300">Kebijakan Privasi</Link>
              <Link href="#profil" className="hover:text-slate-300">Syarat Penggunaan</Link>
              <Link href="#kinerja" className="hover:text-slate-300">Aksesibilitas</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================
          FLOATING BACK TO TOP & ACCESSIBILITY WIDGET
          ============================================ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Back to Top */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 hover:scale-110 active:scale-95 transition"
              aria-label="Kembali ke atas"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Accessibility Floating Toggle */}
        <button
          onClick={() => setA11yOpen(!a11yOpen)}
          className="w-12 h-12 rounded-2xl bg-[#172554] text-white border border-white/20 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition"
          aria-label="Menu Aksesibilitas Disabilitas"
          title="Bantuan Aksesibilitas"
        >
          <HelpCircle className="w-5 h-5 text-amber-400" />
        </button>
      </div>

      {/* Accessibility Panel Modal */}
      <AnimatePresence>
        {a11yOpen && (
          <div className="fixed bottom-24 right-6 z-50">
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 w-72 text-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#ea580c]" /> Aksesibilitas Web
                </span>
                <button onClick={() => setA11yOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {/* Text Size */}
                <button
                  onClick={() => setLargeText(!largeText)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition ${
                    largeText ? "bg-orange-50 border-orange-300 text-[#ea580c] font-bold" : "border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ZoomIn className="w-4 h-4" /> Perbesar Ukuran Teks
                  </span>
                  <span>{largeText ? "Aktif" : "Mati"}</span>
                </button>

                {/* High Contrast */}
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition ${
                    highContrast ? "bg-orange-50 border-orange-300 text-[#ea580c] font-bold" : "border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Kontras Tinggi
                  </span>
                  <span>{highContrast ? "Aktif" : "Mati"}</span>
                </button>

                {/* Reading Ruler */}
                <button
                  onClick={() => setReadingRuler(!readingRuler)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition ${
                    readingRuler ? "bg-orange-50 border-orange-300 text-[#ea580c] font-bold" : "border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-4 h-4" /> Garis Bantu Baca
                  </span>
                  <span>{readingRuler ? "Aktif" : "Mati"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Outbound Link Confirmation Modal */}
      <AnimatePresence>
        {outboundTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-100"
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-2xl">
                ⚠️
              </div>
              <h4 className="text-lg font-bold text-slate-800">Menuju Situs Eksternal</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Anda akan dialihkan ke layanan pihak ketiga <strong>{outboundTarget.name}</strong> ({outboundTarget.url}). Lanjutkan?
              </p>

              <div className="flex gap-3 justify-center mt-5">
                <a
                  href={outboundTarget.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOutboundTarget(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-600 text-white font-bold text-xs transition"
                >
                  Lanjutkan
                </a>
                <button
                  onClick={() => setOutboundTarget(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LAPOR Bencana Citizen Submission Modal */}
      <AnimatePresence>
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Formulir Laporan Bencana</h3>
                    <p className="text-[11px] text-slate-400">Pusdalops-PB BPBD Kota Bitung</p>
                  </div>
                </div>
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {reportSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">Laporan Berhasil Terkirim!</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Laporan Anda telah masuk ke sistem Pusdalops BPBD Kota Bitung dan sedang diteruskan ke Tim Reaksi Cepat (TRC).
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Nama Pelapor
                    </label>
                    <input
                      type="text"
                      required
                      value={reportForm.reporter_name}
                      onChange={(e) => setReportForm({ ...reportForm, reporter_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                      placeholder="Nama lengkap Anda..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Nomor WhatsApp / HP Aktif
                    </label>
                    <input
                      type="tel"
                      required
                      value={reportForm.reporter_phone}
                      onChange={(e) => setReportForm({ ...reportForm, reporter_phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Jenis Kejadian Bencana
                    </label>
                    <select
                      value={reportForm.disaster_type}
                      onChange={(e) => setReportForm({ ...reportForm, disaster_type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none bg-white"
                    >
                      <option value="Pohon Tumbang">Pohon Tumbang / Gangguan Jalan</option>
                      <option value="Banjir / Genangan Air">Banjir / Genangan Air Pemukiman</option>
                      <option value="Tanah Longsor">Tanah Longsor / Pergerakan Tanah</option>
                      <option value="Cuaca Ekstrem / Angin Kencang">Cuaca Ekstrem / Angin Kencang</option>
                      <option value="Gelombang Pasang / Abrasi">Gelombang Pasang / Abrasi Pantai</option>
                      <option value="Kebakaran Lahan">Kebakaran Lahan / Pemukiman</option>
                      <option value="Lainnya">Kejadian Darurat Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Lokasi Kejadian (Kecamatan / Kelurahan / Patokan)
                    </label>
                    <input
                      type="text"
                      required
                      value={reportForm.location}
                      onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                      placeholder="Contoh: Kelurahan Girian Indah, depan gereja..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Keterangan / Situasi Kedaruratan
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reportForm.description}
                      onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                      placeholder="Jelaskan kondisi di lokasi dan bantuan darurat yang dibutuhkan..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setReportModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={reportSubmitting}
                      className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-red-500/20"
                    >
                      {reportSubmitting ? "Mengirim..." : "Kirim Laporan Darurat"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
