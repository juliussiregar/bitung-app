import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (user) {
      await query(
        "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
        [user.name, "LOGOUT", "Logout dari backoffice"]
      );
    }

    const cookieStore = await cookies();
    cookieStore.delete("bpbd_admin_session");

    return NextResponse.json({ message: "Logout berhasil" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
