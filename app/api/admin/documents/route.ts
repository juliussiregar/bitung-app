import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const res = await query("SELECT * FROM documents ORDER BY created_at DESC");
  return NextResponse.json({ documents: res.rows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, type, category, file_url, file_format, file_size } = body;

  const res = await query(
    `INSERT INTO documents (title, type, category, file_url, file_format, file_size)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      title,
      type || "edukasi",
      category || "Pedoman",
      file_url || "/docs/file.pdf",
      file_format || "PDF",
      file_size || "1.5 MB",
    ]
  );

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "CREATE_DOCUMENT", `Menambahkan Dokumen/Pengumuman: ${title}`]
  );

  return NextResponse.json({ document: res.rows[0], message: "Dokumen berhasil disimpan." });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, title, type, category, file_url, file_format, file_size } = body;

  await query(
    `UPDATE documents
     SET title = $1, type = $2, category = $3, file_url = $4,
         file_format = $5, file_size = $6
     WHERE id = $7`,
    [title, type, category, file_url, file_format, file_size, id]
  );

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "UPDATE_DOCUMENT", `Memperbarui Dokumen ID: ${id}`]
  );

  return NextResponse.json({ message: "Dokumen berhasil diperbarui." });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID dokumen dibutuhkan" }, { status: 400 });

  await query("DELETE FROM documents WHERE id = $1", [id]);

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "DELETE_DOCUMENT", `Menghapus Dokumen ID: ${id}`]
  );

  return NextResponse.json({ message: "Dokumen berhasil dihapus." });
}
