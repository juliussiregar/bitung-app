import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const res = await query("SELECT * FROM site_settings ORDER BY id ASC LIMIT 1");
  return NextResponse.json({ settings: res.rows[0] });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    site_name,
    site_tagline,
    hero_badge,
    ticker_text,
    call_center_112,
    hotline_pusdalops,
    whatsapp_darurat,
    email,
    alamat,
    status_siaga,
    ikm_score,
    realisasi_keuangan,
    realisasi_fisik,
    instagram_url,
    facebook_url,
    youtube_url,
  } = body;

  await query(
    `UPDATE site_settings
     SET site_name = $1, site_tagline = $2, hero_badge = $3, ticker_text = $4,
         call_center_112 = $5, hotline_pusdalops = $6, whatsapp_darurat = $7,
         email = $8, alamat = $9, status_siaga = $10, ikm_score = $11,
         realisasi_keuangan = $12, realisasi_fisik = $13, instagram_url = $14,
         facebook_url = $15, youtube_url = $16, updated_at = NOW()
     WHERE id = (SELECT id FROM site_settings ORDER BY id ASC LIMIT 1)`,
    [
      site_name,
      site_tagline,
      hero_badge,
      ticker_text,
      call_center_112,
      hotline_pusdalops,
      whatsapp_darurat,
      email,
      alamat,
      status_siaga,
      ikm_score,
      realisasi_keuangan,
      realisasi_fisik,
      instagram_url,
      facebook_url,
      youtube_url,
    ]
  );

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "UPDATE_SETTINGS", "Memperbarui Pengaturan Portal & Kontak"]
  );

  return NextResponse.json({ message: "Pengaturan berhasil diperbarui." });
}
