import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Max 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Magic byte verification for secure image validation
function detectImageExtension(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return ".jpg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
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

  // WebP: RIFF .... WEBP
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

  // GIF: GIF87a or GIF89a
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
    // 1. Authentication check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Akses ditolak. Sesi login diperlukan untuk mengunggah berkas." },
        { status: 401 }
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

    // 2. File size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Ukuran berkas melebihi batas maksimum 5 MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Magic byte signature verification (Prevents disguised executable scripts)
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

    // 4. Cryptographically randomized filename (Prevents path traversal & file overwrite)
    const randomHex = crypto.randomBytes(12).toString("hex");
    const safeFilename = `bpbd_${Date.now()}_${randomHex}${detectedExtension}`;

    // 5. Secure target path verification
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const targetFilePath = path.join(uploadsDir, safeFilename);

    // Enforce path containment
    if (!targetFilePath.startsWith(uploadsDir)) {
      return NextResponse.json(
        { message: "Deteksi anomali pada jalur penyimpanan berkas." },
        { status: 400 }
      );
    }

    // 6. Write file safely to disk
    await fs.promises.writeFile(targetFilePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;

    // 7. Audit logging
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
      url: publicUrl,
      filename: safeFilename,
      size: file.size,
      mimeType: file.type,
      message: "Berkas gambar berhasil diunggah dengan aman.",
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat memproses unggahan: " + error.message },
      { status: 500 }
    );
  }
}
