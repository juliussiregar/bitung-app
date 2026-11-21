"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Newspaper,
  FolderDown,
  Image as ImageIcon,
  MessageSquareWarning,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Radio,
  CheckCircle2,
  Phone,
  Shield,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    settings: any;
    newsCount: number;
    docsCount: number;
    galleryCount: number;
    reportsCount: number;
    recentNews: any[];
    recentReports: any[];
    logs: any[];
  }>({
    settings: {},
    newsCount: 0,
    docsCount: 0,
    galleryCount: 0,
    reportsCount: 0,
    recentNews: [],
    recentReports: [],
    logs: [],
  });

  const [savingStatus, setSavingStatus] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, newsRes, docsRes, galleryRes, reportsRes, logsRes] = await Promise.all([
        fetch("/api/admin/settings").then((r) => r.json()),
        fetch("/api/admin/news").then((r) => r.json()),
        fetch("/api/admin/documents").then((r) => r.json()),
        fetch("/api/admin/gallery").then((r) => r.json()),
        fetch("/api/admin/reports").then((r) => r.json()),
        fetch("/api/admin/audit-logs").then((r) => r.json()),
      ]);

      setData({
        settings: settingsRes.settings || {},
        newsCount: newsRes.news?.length || 0,
        docsCount: docsRes.documents?.length || 0,
        galleryCount: galleryRes.gallery?.length || 0,
        reportsCount: reportsRes.reports?.length || 0,
        recentNews: newsRes.news?.slice(0, 4) || [],
        recentReports: reportsRes.reports?.slice(0, 5) || [],
        logs: logsRes.logs?.slice(0, 6) || [],
      });
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    setSavingStatus(true);
    try {
      const updated = { ...data.settings, status_siaga: newStatus };
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setData((prev) => ({ ...prev, settings: updated }));
    } catch (err) {
      alert("Gagal memperbarui status: " + err);
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Memuat Ringkasan Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Utama Backoffice
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pusat kendali konten informasi dan kesiapsiagaan BPBD Kota Bitung
          </p>
        </div>

        <button
          onClick={fetchData}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#ea580c] hover:text-[#ea580c] shadow-xs transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* Emergency Status Control Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#0f172a] text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-extrabold text-[#fb923c] uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-spin" />
            <span>Kendali Status Siaga Darurat Daerah</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Status Aktif Saat Ini:{" "}
            <span className="text-amber-300 underline underline-offset-4">
              {data.settings.status_siaga || "SIAGA DARURAT 24/7"}
            </span>
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Perubahan status siaga akan secara otomatis ditampilkan pada banner darurat dan running ticker portal website publik.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            disabled={savingStatus}
            onClick={() => handleStatusChange("SIAGA DARURAT 24/7")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-sm ${
              data.settings.status_siaga === "SIAGA DARURAT 24/7"
                ? "bg-[#ea580c] text-white ring-2 ring-orange-300"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            Siaga Darurat
          </button>
          <button
            disabled={savingStatus}
            onClick={() => handleStatusChange("WASPADA")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-sm ${
              data.settings.status_siaga === "WASPADA"
                ? "bg-amber-500 text-white ring-2 ring-amber-300"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            Waspada
          </button>
          <button
            disabled={savingStatus}
            onClick={() => handleStatusChange("NORMAL / AMAN")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-sm ${
              data.settings.status_siaga === "NORMAL / AMAN"
                ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            Normal / Aman
          </button>
        </div>
      </div>

      {/* 4 Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Berita */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Berita
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{data.newsCount}</div>
            <Link
              href="/admin/news"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#ea580c] hover:underline mt-2"
            >
              Kelola Berita <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#ea580c] flex items-center justify-center">
            <Newspaper className="w-7 h-7" />
          </div>
        </div>

        {/* Dokumen */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Dokumen & SOP
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{data.docsCount}</div>
            <Link
              href="/admin/documents"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline mt-2"
            >
              Kelola Dokumen <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FolderDown className="w-7 h-7" />
          </div>
        </div>

        {/* Galeri */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Media Galeri
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{data.galleryCount}</div>
            <Link
              href="/admin/gallery"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline mt-2"
            >
              Kelola Galeri <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <ImageIcon className="w-7 h-7" />
          </div>
        </div>

        {/* Laporan Warga */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Laporan Warga
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{data.reportsCount}</div>
            <Link
              href="/admin/reports"
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline mt-2"
            >
              Lihat Laporan <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <MessageSquareWarning className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Reports & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Recent Reports */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Laporan Kejadian Bencana Terbaru dari Warga
                </h4>
              </div>
              <Link
                href="/admin/reports"
                className="text-xs font-bold text-[#ea580c] hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3">
              {data.recentReports.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Belum ada laporan bencana masuk.
                </div>
              ) : (
                data.recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">
                          {report.reporter_name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          ({report.reporter_phone})
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {report.disaster_type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 font-medium">
                        📍 {report.location}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        "{report.description}"
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                          report.status === "Selesai"
                            ? "bg-emerald-100 text-emerald-700"
                            : report.status === "Diproses"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent News */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center">
                  <Newspaper className="w-4 h-4" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900">Berita Terakhir Dipublikasi</h4>
              </div>
              <Link href="/admin/news" className="text-xs font-bold text-[#ea580c] hover:underline">
                Kelola Semua
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {data.recentNews.map((news) => (
                <div key={news.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#ea580c] uppercase">
                      {news.category}
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {news.title}
                    </h5>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                    {new Date(news.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Links & Activity Log */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Shortcuts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
              Aksi Cepat Admin
            </h4>

            <div className="space-y-2">
              <Link
                href="/admin/news"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-orange-50/70 hover:bg-orange-100/70 text-[#ea580c] font-bold text-xs transition"
              >
                <span>+ Buat Berita Baru</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/disaster-stats"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-100/70 text-blue-600 font-bold text-xs transition"
              >
                <span>Update Kejadian Bencana</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/settings"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                <span>Ubah Ticker & Hotline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/profile"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                <span>Edit Visi, Misi & Pejabat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> Log Aktivitas Sistem
            </h4>

            <div className="space-y-3">
              {data.logs.map((log) => (
                <div key={log.id} className="text-xs pb-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{log.user_name || "Admin"}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#ea580c] font-semibold mt-0.5">{log.action}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
