import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const res = await query("SELECT * FROM disaster_stats ORDER BY order_index ASC, id ASC");
  return NextResponse.json({ stats: res.rows });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, count, trend } = body;

  await query(
    `UPDATE disaster_stats
     SET count = $1, trend = $2, updated_at = NOW()
     WHERE id = $3`,
    [count, trend, id]
  );

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "UPDATE_DISASTER_STAT", `Memperbarui Jumlah Kejadian Bencana ID: ${id} menjadi ${count}`]
  );

  return NextResponse.json({ message: "Statistik bencana berhasil diperbarui." });
}
