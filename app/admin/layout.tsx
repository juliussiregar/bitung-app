"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Building2,
  SlidersHorizontal,
  Newspaper,
  AlertTriangle,
  FolderDown,
  Image as ImageIcon,
  MessageSquareWarning,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; username: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            Memuat Sistem Backoffice...
          </span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Pengaturan Portal", href: "/admin/settings", icon: Settings },
    { name: "Profil Organisasi & Visi", href: "/admin/profile", icon: Building2 },
    { name: "Slider / Hero Carousel", href: "/admin/slides", icon: SlidersHorizontal },
    { name: "Berita & Publikasi", href: "/admin/news", icon: Newspaper },
    { name: "Statistik Bencana", href: "/admin/disaster-stats", icon: AlertTriangle },
    { name: "Dokumen & Pengumuman", href: "/admin/documents", icon: FolderDown },
    { name: "Galeri Foto & Video", href: "/admin/gallery", icon: ImageIcon },
    { name: "Laporan Warga (LAPOR)", href: "/admin/reports", icon: MessageSquareWarning },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row antialiased font-sans text-slate-800">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0f172a] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 border-[#ea580c] p-0.5 bg-white shadow-md flex items-center justify-center shrink-0">
                <Image
                  src="/bpbd.png"
                  alt="Logo"
                  width={38}
                  height={38}
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#ea580c] tracking-widest block">
                  Panel Backoffice
                </span>
                <span className="text-sm font-extrabold text-white truncate block">
                  BPBD KOTA BITUNG
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Modul Manajemen Konten
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#ea580c] text-white shadow-lg shadow-orange-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Bottom */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name[0] : "A"}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Online ({user?.role})
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Portal
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[11px] font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
              Sistem Manajemen Konten Terintegrasi • PostgreSQL Database
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DB Connected</span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#ea580c] hover:text-[#ea580c] transition"
            >
              <span>Lihat Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
