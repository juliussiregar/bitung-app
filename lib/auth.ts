import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "bpbd_bitung_super_secret_jwt_key_2026_sakata"
);

export async function createSessionToken(payload: {
  userId: number;
  username: string;
  name: string;
  role: string;
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as {
      userId: number;
      username: string;
      name: string;
      role: string;
    };
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bpbd_admin_session")?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}
