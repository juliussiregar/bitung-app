import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const res = await query("SELECT * FROM news ORDER BY created_at DESC");
  return NextResponse.json({ news: res.rows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, category, excerpt, content, image_url, is_featured, status } = body;

  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const res = await query(
    `INSERT INTO news (title, slug, category, excerpt, content, image_url, is_featured, status, author)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      title,
      slug,
      category || "Berita Utama",
      excerpt,
      content,
      image_url,
      is_featured || false,
      status || "published",
      user.name,
    ]
  );

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "CREATE_NEWS", `Membuat Berita: ${title}`]
  );

  return NextResponse.json({ news: res.rows[0], message: "Berita berhasil dipublikasikan." });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, title, category, excerpt, content, image_url, is_featured, status } = body;

  await query(
    `UPDATE news
     SET title = $1, category = $2, excerpt = $3, content = $4,
         image_url = $5, is_featured = $6, status = $7, updated_at = NOW()
     WHERE id = $8`,
    [title, category, excerpt, content, image_url, is_featured, status, id]
  );

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "UPDATE_NEWS", `Memperbarui Berita ID: ${id}`]
  );

  return NextResponse.json({ message: "Berita berhasil diperbarui." });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID berita dibutuhkan" }, { status: 400 });

  await query("DELETE FROM news WHERE id = $1", [id]);

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "DELETE_NEWS", `Menghapus Berita ID: ${id}`]
  );

  return NextResponse.json({ message: "Berita berhasil dihapus." });
}
