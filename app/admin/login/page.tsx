"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Shield, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal masuk");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-block relative mb-3">
              <div className="w-20 h-20 rounded-full border-2 border-[#ea580c] p-1 bg-white shadow-lg mx-auto flex items-center justify-center">
                <Image
                  src="/bpbd.png"
                  alt="Logo BPBD"
                  width={70}
                  height={70}
                  className="object-contain"
                />
              </div>
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ea580c] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Backoffice CMS Portal
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">BPBD KOTA BITUNG</h1>
            <p className="text-xs text-slate-500 mt-1">
              Sistem Manajemen Konten & Kesiapsiagaan Bencana Daerah
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-semibold animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username Operator
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#ea580c] focus:bg-white transition"
                  placeholder="Masukkan username"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-11 pr-11 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#ea580c] focus:bg-white transition"
                  placeholder="Masukkan kata sandi"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Panel Backoffice</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Default Credential Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Default Login: <strong className="text-slate-700">admin</strong> /{" "}
              <strong className="text-slate-700">admin123</strong>
            </span>
          </div>
        </div>

        <div className="text-center mt-6 text-slate-400 text-xs">
          © 2026 BPBD Kota Bitung • Protected GovNet System
        </div>
      </div>
    </div>
  );
}
