"use client";

import React, { useState, useEffect } from "react";
import { MessageSquareWarning, CheckCircle2, Phone, MapPin, Calendar, Clock, RefreshCw } from "lucide-react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setMessage(`Status laporan ID ${id} diubah menjadi "${newStatus}".`);
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = reports.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Laporan Kedaruratan Warga (LAPOR Bencana)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau dan tindaklanjuti laporan bencana yang masuk dari formulir pengaduan online masyarakat
          </p>
        </div>

        <button
          onClick={fetchReports}
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-400 px-2 uppercase">Filter Status:</span>
        {["all", "menunggu", "diproses", "selesai"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
              filterStatus === st
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {st === "all" ? "Semua Status" : st}
          </button>
        ))}
      </div>

      {/* Report Cards Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Memuat laporan...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
            Tidak ada laporan dalam kategori ini.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-orange-500/30 transition"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-[#ea580c] font-extrabold text-[11px] uppercase">
                    {item.disaster_type}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">{item.reporter_name}</span>
                  <a
                    href={`tel:${item.reporter_phone}`}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
                  >
                    <Phone className="w-3 h-3" /> {item.reporter_phone}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <MapPin className="w-4 h-4 text-[#ea580c] shrink-0" />
                  <span>{item.location}</span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  "{item.description}"
                </p>

                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>
                    Masuk pada:{" "}
                    {new Date(item.created_at).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ubah Status Laporan:</span>
                <select
                  disabled={updatingId === item.id}
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold focus:outline-none border shadow-xs ${
                    item.status === "Selesai"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                      : item.status === "Diproses"
                      ? "bg-amber-50 border-amber-300 text-amber-700"
                      : "bg-red-50 border-red-300 text-red-700"
                  }`}
                >
                  <option value="Menunggu">Menunggu</option>
                  <option value="Diproses">Diproses Tim TRC</option>
                  <option value="Selesai">Selesai Ditangani</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
