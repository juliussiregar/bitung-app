"use client";

import ImageUploader from "@/components/ImageUploader";
import React, { useState, useEffect } from "react";
import { Building2, Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminProfilePage() {
  const [form, setForm] = useState({
    visi: "",
    misi: "",
    sejarah: "",
    tupoksi: "",
    kepala_pelaksana_name: "",
    kepala_pelaksana_nip: "",
    kepala_pelaksana_photo: "",
    kepala_pelaksana_sambutan: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      if (data.profile) {
        setForm(data.profile);
      }
    } catch (err: any) {
      setError("Gagal memuat profil: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan");

      setSuccess("Profil organisasi & data kepala pelaksana berhasil diperbarui!");
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
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Profil Organisasi & Pejabat
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola visi, misi, sejarah, tugas pokok fungsi, dan data Kepala Pelaksana BPBD Kota Bitung
        </p>
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
        {/* Visi dan Misi */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#ea580c]" />
            <span>Visi & Misi Organisasi</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Visi BPBD Kota Bitung
            </label>
            <textarea
              rows={3}
              value={form.visi}
              onChange={(e) => setForm({ ...form, visi: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Misi Organisasi
            </label>
            <textarea
              rows={5}
              value={form.misi}
              onChange={(e) => setForm({ ...form, misi: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none font-mono text-xs"
            />
          </div>
        </div>

        {/* Sejarah & Tugas Pokok */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Sejarah & Tugas Pokok Fungsi (Tupoksi)
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Sejarah Singkat Pembentukan BPBD
            </label>
            <textarea
              rows={3}
              value={form.sejarah}
              onChange={(e) => setForm({ ...form, sejarah: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tugas Pokok & Fungsi (Tupoksi)
            </label>
            <textarea
              rows={3}
              value={form.tupoksi}
              onChange={(e) => setForm({ ...form, tupoksi: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
            />
          </div>
        </div>

        {/* Data Kepala Pelaksana */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Data Kepala Pelaksana BPBD
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Lengkap & Gelar
              </label>
              <input
                type="text"
                value={form.kepala_pelaksana_name}
                onChange={(e) => setForm({ ...form, kepala_pelaksana_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploader
                label="Foto Resmi Kepala Pelaksana BPBD"
                value={form.kepala_pelaksana_photo}
                onChange={(url) => setForm({ ...form, kepala_pelaksana_photo: url })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                NIP Pejabat
              </label>
              <input
                type="text"
                value={form.kepala_pelaksana_nip}
                onChange={(e) => setForm({ ...form, kepala_pelaksana_nip: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Kata Sambutan Kepala Pelaksana
            </label>
            <textarea
              rows={4}
              value={form.kepala_pelaksana_sambutan}
              onChange={(e) => setForm({ ...form, kepala_pelaksana_sambutan: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#ea580c] focus:outline-none"
            />
          </div>
        </div>

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
            <span>Simpan Data Profil</span>
          </button>
        </div>
      </form>
    </div>
  );
}
