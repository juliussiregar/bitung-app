import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const res = await query("SELECT * FROM slides ORDER BY order_index ASC, id ASC");
  return NextResponse.json({ slides: res.rows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    badge,
    title,
    subtitle,
    description,
    image_url,
    primary_cta_text,
    primary_cta_link,
    secondary_cta_text,
    secondary_cta_link,
    order_index,
  } = body;

  const res = await query(
    `INSERT INTO slides (badge, title, subtitle, description, image_url, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link, order_index)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      badge,
      title,
      subtitle,
      description,
      image_url,
      primary_cta_text || "Layanan Siaga 24 Jam",
      primary_cta_link || "#berita",
      secondary_cta_text || "Peringatan Dini Cuaca",
      secondary_cta_link || "#profil",
      order_index || 0,
    ]
  );

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "CREATE_SLIDE", `Menambahkan Slide Hero: ${title}`]
  );

  return NextResponse.json({ slide: res.rows[0], message: "Slide berhasil ditambahkan." });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    id,
    badge,
    title,
    subtitle,
    description,
    image_url,
    primary_cta_text,
    primary_cta_link,
    secondary_cta_text,
    secondary_cta_link,
    order_index,
    is_active,
  } = body;

  await query(
    `UPDATE slides
     SET badge = $1, title = $2, subtitle = $3, description = $4, image_url = $5,
         primary_cta_text = $6, primary_cta_link = $7, secondary_cta_text = $8,
         secondary_cta_link = $9, order_index = $10, is_active = $11
     WHERE id = $12`,
    [
      badge,
      title,
      subtitle,
      description,
      image_url,
      primary_cta_text,
      primary_cta_link,
      secondary_cta_text,
      secondary_cta_link,
      order_index,
      is_active,
      id,
    ]
  );

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "UPDATE_SLIDE", `Memperbarui Slide Hero ID: ${id}`]
  );

  return NextResponse.json({ message: "Slide berhasil diperbarui." });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID slide dibutuhkan" }, { status: 400 });

  await query("DELETE FROM slides WHERE id = $1", [id]);

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "DELETE_SLIDE", `Menghapus Slide Hero ID: ${id}`]
  );

  return NextResponse.json({ message: "Slide berhasil dihapus." });
}
