"use client";

import ImageUploader from "@/components/ImageUploader";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SlidersHorizontal, Plus, Edit, Trash2, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function AdminSlidesPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);

  const [form, setForm] = useState({
    badge: "",
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    primary_cta_text: "Layanan Siaga 24 Jam",
    primary_cta_link: "#berita",
    secondary_cta_text: "Peringatan Dini Cuaca",
    secondary_cta_link: "#profil",
    order_index: 0,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/slides");
      const data = await res.json();
      setSlides(data.slides || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openAddModal = () => {
    setEditingSlide(null);
    setForm({
      badge: "Kesiapsiagaan Kebencanaan",
      title: "SELAMAT DATANG DI WEBSITE RESMI",
      subtitle: "BPBD KOTA BITUNG",
      description: "",
      image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80",
      primary_cta_text: "Layanan Siaga 24 Jam",
      primary_cta_link: "#berita",
      secondary_cta_text: "Peringatan Dini Cuaca",
      secondary_cta_link: "#profil",
      order_index: slides.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (slide: any) => {
    setEditingSlide(slide);
    setForm(slide);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus slide ini?")) return;
    try {
      const res = await fetch(`/api/admin/slides?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Slide berhasil dihapus.");
        fetchSlides();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingSlide ? "PUT" : "POST";
      const body = editingSlide ? { ...form, id: editingSlide.id } : form;
      const res = await fetch("/api/admin/slides", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setModalOpen(false);
        setMessage("Slide berhasil disimpan.");
        fetchSlides();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const data = await res.json();
        alert(data.message || "Gagal menyimpan");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Slider / Hero Carousel
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola banner slider utama yang muncul di bagian paling atas halaman portal website
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Slide Baru</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Memuat daftar slide...</div>
      ) : slides.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
          Belum ada slide terdaftar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-slate-900">
                <Image
                  src={slide.image_url}
                  alt={slide.subtitle}
                  fill
                  className="object-cover opacity-85"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    Urutan #{slide.order_index}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      slide.is_active ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
                    }`}
                  >
                    {slide.is_active ? "Aktif" : "Non-Aktif"}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#ea580c] uppercase tracking-wider block">
                    {slide.badge || "Banner"}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1 line-clamp-1">
                    {slide.title}
                  </h4>
                  <h5 className="text-base font-extrabold text-[#172554] leading-tight">
                    {slide.subtitle}
                  </h5>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {slide.description}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(slide)}
                    className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
                    title="Edit Slide"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
                    title="Hapus Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingSlide ? "Edit Slide Hero" : "Tambah Slide Hero Baru"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Badge Kategori
                </label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                  placeholder="Kesiapsiagaan Kebencanaan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Judul Kecil Atas
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                  placeholder="SELAMAT DATANG DI WEBSITE RESMI"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Judul Utama (Headline Besar)
                </label>
                <input
                  type="text"
                  required
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none font-bold"
                  placeholder="BPBD KOTA BITUNG"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Deskripsi / Penjelasan
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                />
              </div>

              <ImageUploader
                label="Gambar Latar Belakang Slide"
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Teks Tombol Utama
                  </label>
                  <input
                    type="text"
                    value={form.primary_cta_text}
                    onChange={(e) => setForm({ ...form, primary_cta_text: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Link Tombol Utama
                  </label>
                  <input
                    type="text"
                    value={form.primary_cta_link}
                    onChange={(e) => setForm({ ...form, primary_cta_link: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nomor Urut
                  </label>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={(e) =>
                      setForm({ ...form, order_index: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="w-4 h-4 text-[#ea580c] rounded"
                    />
                    <span>Tampilkan di Portal</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#ea580c] hover:bg-orange-600 text-white font-bold text-xs transition"
                >
                  {saving ? "Menyimpan..." : "Simpan Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
