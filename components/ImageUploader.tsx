"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, CheckCircle2, AlertCircle, Trash2, ShieldCheck, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  recommendedSize?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Unggah Gambar",
  recommendedSize = "Maks. 5 MB (JPG, PNG, WEBP, GIF)",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");

    // Client-side quick check
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran berkas melebihi batas 5 MB.");
      return;
    }

    const allowedMime = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedMime.includes(file.type)) {
      setError("Format berkas harus berupa gambar JPG, PNG, WEBP, atau GIF.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal mengunggah berkas");
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase">
          {label}
        </label>
        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Verifikasi Signature Aman
        </span>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {value ? (
        /* Image Preview State */
        <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
            <Image src={value} alt="Preview" fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-extrabold text-slate-800 truncate block">
              {value.split("/").pop()}
            </span>
            <span className="text-[11px] text-slate-400 font-mono truncate block">
              {value}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#ea580c] hover:text-[#ea580c] text-xs font-bold transition shadow-xs"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition"
              title="Hapus Gambar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            dragOver
              ? "border-[#ea580c] bg-orange-50/50"
              : "border-slate-300 hover:border-[#ea580c] hover:bg-slate-50"
          }`}
        >
          {uploading ? (
            <div className="py-4 flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-[#ea580c] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-600">
                Memvalidasi & mengunggah berkas...
              </span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#ea580c] flex items-center justify-center shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Klik untuk unggah atau seret berkas ke sini
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {recommendedSize}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Alternative URL Input */}
      <div className="pt-1">
        <details className="text-[11px] text-slate-500">
          <summary className="cursor-pointer hover:text-slate-800 font-semibold select-none">
            Atau gunakan URL gambar eksternal
          </summary>
          <div className="mt-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:border-[#ea580c] focus:outline-none"
            />
          </div>
        </details>
      </div>
    </div>
  );
}
