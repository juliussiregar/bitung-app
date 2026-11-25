import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getSecretKey() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET is not set. Add a strong random secret to your environment before starting the app."
    );
  }
  return new TextEncoder().encode(jwtSecret);
}

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
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as {
      userId: number;
      username: string;
      name: string;
      role: string;
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bpbd_admin_session")?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}
