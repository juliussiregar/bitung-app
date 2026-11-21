"use client";

import ImageUploader from "@/components/ImageUploader";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Plus, Edit, Trash2, CheckCircle2, Play, X } from "lucide-react";

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [form, setForm] = useState({
    title: "",
    type: "foto",
    media_url: "",
    caption: "",
    event_date: "20 Nov 2026",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setGallery(data.gallery || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      title: "",
      type: "foto",
      media_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
      caption: "",
      event_date: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setForm(item);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus media ini dari galeri?")) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Media galeri berhasil dihapus.");
        fetchGallery();
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
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { ...form, id: editingItem.id } : form;
      const res = await fetch("/api/admin/gallery", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setModalOpen(false);
        setMessage("Media galeri berhasil disimpan.");
        fetchGallery();
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
            Galeri Foto & Video Lapangan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dokumentasi foto kegiatan reaksi cepat, pelatihan masyarakat, dan video edukasi bencana
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Media Galeri</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Memuat galeri...</div>
      ) : gallery.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
          Belum ada media galeri.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-slate-900">
                <Image
                  src={item.media_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {item.type}
                  </span>
                </div>
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#ea580c] text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">{item.event_date}</span>
                  <h4 className="text-xs font-extrabold text-slate-900 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.caption}</p>
                </div>

                <div className="flex items-center justify-end gap-1 pt-3 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingItem ? "Edit Media Galeri" : "Tambah Media Galeri"}
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
                  Judul Foto / Video
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tipe Media
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none bg-white"
                  >
                    <option value="foto">Foto Kegiatan</option>
                    <option value="video">Video Kegiatan / Edukasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="text"
                    value={form.event_date}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                    placeholder="20 Nov 2026"
                  />
                </div>
              </div>

              <ImageUploader
                label="Berkas Foto Dokumentasi / Poster Video"
                value={form.media_url}
                onChange={(url) => setForm({ ...form, media_url: url })}
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Keterangan / Caption
                </label>
                <textarea
                  rows={3}
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                />
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
                  {saving ? "Menyimpan..." : "Simpan Media"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
