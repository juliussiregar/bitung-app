import { NextResponse } from "next/server";
import { query } from "@/lib/db";


export async function GET() {
  try {
    const settingsRes = await query("SELECT * FROM site_settings ORDER BY id ASC LIMIT 1");
    const profileRes = await query("SELECT * FROM profile ORDER BY id ASC LIMIT 1");
    const slidesRes = await query("SELECT * FROM slides WHERE is_active = true ORDER BY order_index ASC, id ASC");
    const statsRes = await query("SELECT * FROM disaster_stats ORDER BY order_index ASC, id ASC");
    const newsRes = await query("SELECT * FROM news WHERE status = 'published' ORDER BY created_at DESC LIMIT 10");
    const docsRes = await query("SELECT * FROM documents ORDER BY created_at DESC");
    const galleryRes = await query("SELECT * FROM gallery ORDER BY created_at DESC");

    return NextResponse.json({
      settings: settingsRes.rows[0] || null,
      profile: profileRes.rows[0] || null,
      slides: slidesRes.rows,
      disasterStats: statsRes.rows,
      news: newsRes.rows,
      documents: docsRes.rows,
      gallery: galleryRes.rows,
    });
  } catch (error: any) {
    console.error("Public Content API Error:", error);
    return NextResponse.json(
      { message: "Gagal memuat konten dari database", error: error.message },
      { status: 500 }
    );
  }
}
