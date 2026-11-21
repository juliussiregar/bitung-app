import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const res = await query("SELECT * FROM reports ORDER BY created_at DESC");
  return NextResponse.json({ reports: res.rows });
}

// Public endpoint for submitting disaster report from frontend
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reporter_name, reporter_phone, disaster_type, location, description } = body;

    if (!reporter_name || !reporter_phone || !location || !description) {
      return NextResponse.json(
        { message: "Semua kolom laporan wajib diisi." },
        { status: 400 }
      );
    }

    const res = await query(
      `INSERT INTO reports (reporter_name, reporter_phone, disaster_type, location, description, status)
       VALUES ($1, $2, $3, $4, $5, 'Menunggu') RETURNING *`,
      [reporter_name, reporter_phone, disaster_type || "Bencana Alam", location, description]
    );

    return NextResponse.json({
      message: "Laporan berhasil dikirim ke Pusdalops BPBD.",
      reportId: res.rows[0].id,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// Admin status update
export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, status } = body;

  await query("UPDATE reports SET status = $1 WHERE id = $2", [status, id]);

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "UPDATE_REPORT", `Mengubah status laporan ID ${id} menjadi ${status}`]
  );

  return NextResponse.json({ message: "Status laporan berhasil diperbarui." });
}
