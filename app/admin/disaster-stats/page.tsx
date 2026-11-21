"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Save, CheckCircle2, RefreshCw } from "lucide-react";

export default function AdminDisasterStatsPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/disaster-stats");
      const data = await res.json();
      setStats(data.stats || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdate = async (item: any) => {
    setSavingId(item.id);
    try {
      const res = await fetch("/api/admin/disaster-stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          count: parseInt(item.count) || 0,
          trend: item.trend,
        }),
      });

      if (res.ok) {
        setMessage(`Data ${item.name} berhasil diperbarui.`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleChange = (id: number, field: string, value: any) => {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Statistik Kejadian Bencana Daerah
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ubah jumlah kumulatif kejadian bencana tahun 2026 yang langsung tampil di dasbor portal publik
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#ea580c] hover:text-[#ea580c] transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Segarkan
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Memuat data statistik...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stats.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900">{item.name}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase">
                  Tahun 2026
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Jumlah Kasus
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={item.count}
                    onChange={(e) => handleChange(item.id, "count", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xl font-extrabold text-[#ea580c] focus:border-[#ea580c] focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Keterangan Status / Peringatan
                  </label>
                  <input
                    type="text"
                    value={item.trend || ""}
                    onChange={(e) => handleChange(item.id, "trend", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#ea580c] focus:outline-none"
                    placeholder="Contoh: Waspada Musim Hujan"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleUpdate(item)}
                  disabled={savingId === item.id}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-[#ea580c] text-white text-xs font-bold transition disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingId === item.id ? "Menyimpan..." : "Simpan Perubahan"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
