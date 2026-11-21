import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const res = await query("SELECT * FROM gallery ORDER BY created_at DESC");
  return NextResponse.json({ gallery: res.rows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, type, media_url, caption, event_date } = body;

  const res = await query(
    `INSERT INTO gallery (title, type, media_url, caption, event_date)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, type || "foto", media_url, caption, event_date || "20 Nov 2026"]
  );

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "CREATE_GALLERY", `Menambahkan Media Galeri: ${title}`]
  );

  return NextResponse.json({ item: res.rows[0], message: "Media galeri berhasil ditambahkan." });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, title, type, media_url, caption, event_date } = body;

  await query(
    `UPDATE gallery
     SET title = $1, type = $2, media_url = $3, caption = $4, event_date = $5
     WHERE id = $6`,
    [title, type, media_url, caption, event_date, id]
  );

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "UPDATE_GALLERY", `Memperbarui Galeri ID: ${id}`]
  );

  return NextResponse.json({ message: "Galeri berhasil diperbarui." });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID media dibutuhkan" }, { status: 400 });

  await query("DELETE FROM gallery WHERE id = $1", [id]);

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "DELETE_GALLERY", `Menghapus Galeri ID: ${id}`]
  );

  return NextResponse.json({ message: "Media berhasil dihapus." });
}
