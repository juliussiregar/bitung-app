import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const res = await query("SELECT * FROM profile ORDER BY id ASC LIMIT 1");
  return NextResponse.json({ profile: res.rows[0] });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    visi,
    misi,
    sejarah,
    tupoksi,
    struktur_organisasi_url,
    kepala_pelaksana_name,
    kepala_pelaksana_nip,
    kepala_pelaksana_photo,
    kepala_pelaksana_sambutan,
  } = body;

  await query(
    `UPDATE profile
     SET visi = $1, misi = $2, sejarah = $3, tupoksi = $4,
         struktur_organisasi_url = $5, kepala_pelaksana_name = $6,
         kepala_pelaksana_nip = $7, kepala_pelaksana_photo = $8,
         kepala_pelaksana_sambutan = $9, updated_at = NOW()
     WHERE id = (SELECT id FROM profile ORDER BY id ASC LIMIT 1)`,
    [
      visi,
      misi,
      sejarah,
      tupoksi,
      struktur_organisasi_url,
      kepala_pelaksana_name,
      kepala_pelaksana_nip,
      kepala_pelaksana_photo,
      kepala_pelaksana_sambutan,
    ]
  );

  await query(
    "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
    [user.name, "UPDATE_PROFILE", "Memperbarui Profil Lembaga & Pejabat"]
  );

  return NextResponse.json({ message: "Profil berhasil diperbarui." });
}
