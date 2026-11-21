"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    site_name: "",
    site_tagline: "",
    hero_badge: "",
    ticker_text: "",
    call_center_112: "",
    hotline_pusdalops: "",
    whatsapp_darurat: "",
    email: "",
    alamat: "",
    status_siaga: "",
    ikm_score: 94.8,
    realisasi_keuangan: 94.76,
    realisasi_fisik: 98.33,
    instagram_url: "",
    facebook_url: "",
    youtube_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setForm(data.settings);
      }
    } catch (err: any) {
      setError("Gagal memuat pengaturan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan");

      setSuccess("Pengaturan portal berhasil diperbarui dan tersimpan ke PostgreSQL!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <div className="w-8 h-8 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Pengaturan Umum & Kontak Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ubah identitas portal, teks berjalan (ticker), nomor call center, data IKM, dan tautan sosial media
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Identitas Situs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#ea580c]" />
            <span>Identitas & Informasi Utama</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Portal Website
              </label>
              <input
                type="text"
                value={form.site_name}
                onChange={(e) => setForm({ ...form, site_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tagline Instansi
              </label>
              <input
                type="text"
                value={form.site_tagline}
                onChange={(e) => setForm({ ...form, site_tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Teks Berjalan Peringatan Dini (Running Ticker)
            </label>
            <textarea
              rows={3}
              value={form.ticker_text}
              onChange={(e) => setForm({ ...form, ticker_text: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Teks ini ditampilkan di bilah darurat paling atas website publik.
            </p>
          </div>
        </div>

        {/* Kontak & Hotline Darurat */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Kontak Resmi & Hotline Darurat
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Call Center Darurat
              </label>
              <input
                type="text"
                value={form.call_center_112}
                onChange={(e) => setForm({ ...form, call_center_112: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none font-bold text-[#ea580c]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Telepon Kantor Pusdalops
              </label>
              <input
                type="text"
                value={form.hotline_pusdalops}
                onChange={(e) => setForm({ ...form, hotline_pusdalops: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                WhatsApp Pengaduan TRC
              </label>
              <input
                type="text"
                value={form.whatsapp_darurat}
                onChange={(e) => setForm({ ...form, whatsapp_darurat: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Kedinasan
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Alamat Kantor Sekretariat
              </label>
              <input
                type="text"
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Akuntabilitas & Kinerja */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Indikator Transparansi & Kinerja (IKM & Anggaran)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Skor IKM (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.ikm_score}
                onChange={(e) => setForm({ ...form, ikm_score: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Realisasi Keuangan (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.realisasi_keuangan}
                onChange={(e) =>
                  setForm({ ...form, realisasi_keuangan: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none font-bold text-[#ea580c]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Realisasi Fisik (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.realisasi_fisik}
                onChange={(e) =>
                  setForm({ ...form, realisasi_fisik: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none font-bold text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Saluran Media Sosial */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Tautan Media Sosial Resmi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={form.instagram_url}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                value={form.facebook_url}
                onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                YouTube Channel URL
              </label>
              <input
                type="text"
                value={form.youtube_url}
                onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-extrabold text-sm shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Simpan Perubahan Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
