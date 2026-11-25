import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import crypto from "crypto";

// Max 5 MB (also under Vercel serverless body limit ~4.5 MB for safer margin use 4 MB client-side if needed)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function detectImageExtension(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return ".jpg";
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return ".png";
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return ".webp";
  }

  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return ".gif";
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Akses ditolak. Sesi login diperlukan untuk mengunggah berkas." },
        { status: 401 }
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
      return NextResponse.json(
        {
          message:
            "Penyimpanan Blob belum dikonfigurasi. Hubungkan Vercel Blob dan set BLOB_READ_WRITE_TOKEN (atau BLOB_STORE_ID + OIDC) di environment.",
        },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Tidak ada berkas yang dipilih." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Ukuran berkas melebihi batas maksimum 5 MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const detectedExtension = detectImageExtension(buffer);
    if (!detectedExtension) {
      return NextResponse.json(
        {
          message:
            "Format berkas tidak valid atau berbahaya. Hanya berkas gambar asli (JPG, PNG, WEBP, GIF) yang diizinkan.",
        },
        { status: 400 }
      );
    }

    const randomHex = crypto.randomBytes(12).toString("hex");
    const safeFilename = `bpbd_${Date.now()}_${randomHex}${detectedExtension}`;
    const pathname = `uploads/${safeFilename}`;

    const blob = await put(pathname, buffer, {
      access: "public",
      contentType:
        detectedExtension === ".jpg"
          ? "image/jpeg"
          : detectedExtension === ".png"
            ? "image/png"
            : detectedExtension === ".webp"
              ? "image/webp"
              : "image/gif",
      addRandomSuffix: false,
    });

    await query(
      "INSERT INTO audit_logs (user_name, action, details) VALUES ($1, $2, $3)",
      [
        user.name,
        "UPLOAD_IMAGE",
        `Mengunggah gambar: ${safeFilename} (${(file.size / 1024).toFixed(1)} KB)`,
      ]
    );

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: safeFilename,
      size: file.size,
      mimeType: file.type,
      message: "Berkas gambar berhasil diunggah dengan aman.",
    });
  } catch (error: unknown) {
    console.error("Upload API Error:", error);
    const message =
      error instanceof Error ? error.message : "Kesalahan tidak diketahui";
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat memproses unggahan: " + message },
      { status: 500 }
    );
  }
}
