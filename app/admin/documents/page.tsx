"use client";

import React, { useState, useEffect } from "react";
import { FolderDown, Plus, Edit, Trash2, CheckCircle2, Search, X, FileText } from "lucide-react";

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any | null>(null);

  const [form, setForm] = useState({
    title: "",
    type: "edukasi",
    category: "Pedoman Mitigasi",
    file_url: "/docs/dokumen.pdf",
    file_format: "PDF",
    file_size: "2.4 MB",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/documents");
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const openAddModal = () => {
    setEditingDoc(null);
    setForm({
      title: "",
      type: "edukasi",
      category: "Pedoman Mitigasi",
      file_url: "/docs/dokumen.pdf",
      file_format: "PDF",
      file_size: "1.5 MB",
    });
    setModalOpen(true);
  };

  const openEditModal = (doc: any) => {
    setEditingDoc(doc);
    setForm(doc);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus dokumen ini?")) return;
    try {
      const res = await fetch(`/api/admin/documents?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Dokumen berhasil dihapus.");
        fetchDocs();
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
      const method = editingDoc ? "PUT" : "POST";
      const body = editingDoc ? { ...form, id: editingDoc.id } : form;
      const res = await fetch("/api/admin/documents", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setModalOpen(false);
        setMessage("Dokumen berhasil disimpan.");
        fetchDocs();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = documents.filter((doc) => {
    const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = activeType === "all" || doc.type === activeType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Perpustakaan Digital & Pengumuman
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola arsip Buku Saku, Dokumen Kajian Risiko Bencana (KRB), Renstra, SOP, dan Surat Pengumuman Resmi
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumen Baru</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["all", "edukasi", "pengumuman"].map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                activeType === type
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type === "all" ? "Semua Tipe" : type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul dokumen..."
            className="w-full px-4 py-2 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#ea580c]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama Dokumen</th>
                <th className="px-6 py-4">Tipe & Kategori</th>
                <th className="px-6 py-4">Ukuran & Format</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    Memuat dokumen...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    Tidak ada dokumen ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="font-extrabold text-slate-900 max-w-md line-clamp-1">
                          {doc.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                          {doc.type}
                        </span>
                        <div className="text-[11px] text-slate-400">{doc.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <span className="font-bold">{doc.file_format}</span> • {doc.file_size}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(doc)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingDoc ? "Edit Dokumen" : "Tambah Dokumen / Pengumuman"}
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
                  Judul Dokumen
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
                    Tipe Publikasi
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none bg-white"
                  >
                    <option value="edukasi">Edukasi / Modul Mitigasi</option>
                    <option value="pengumuman">Pengumuman Resmi</option>
                    <option value="renstra">Renstra / Rencana Aksi</option>
                    <option value="sop">Standar Operasional (SOP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kategori Dokumen
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                    placeholder="Pedoman Mitigasi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Format Berkas
                  </label>
                  <input
                    type="text"
                    value={form.file_format}
                    onChange={(e) => setForm({ ...form, file_format: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                    placeholder="PDF"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Ukuran Berkas
                  </label>
                  <input
                    type="text"
                    value={form.file_size}
                    onChange={(e) => setForm({ ...form, file_size: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none"
                    placeholder="2.4 MB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  URL Unduhan / File Path
                </label>
                <input
                  type="text"
                  required
                  value={form.file_url}
                  onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#ea580c] focus:outline-none font-mono text-[11px]"
                  placeholder="/docs/panduan.pdf"
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
                  {saving ? "Menyimpan..." : "Simpan Dokumen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
