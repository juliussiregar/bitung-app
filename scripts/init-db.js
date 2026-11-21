const { Client } = require("pg");
const bcrypt = require("bcryptjs");

const connectionString = "postgresql://sakata_user:sakata_pass@127.0.0.1:64543/bpbd_bitung";

async function initializeDatabase() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log("Connected to PostgreSQL on port 64543.");

  // Create Users Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create Site Settings Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY,
      site_name VARCHAR(255) DEFAULT 'BPBD KOTA BITUNG',
      site_tagline VARCHAR(255) DEFAULT 'Badan Penanggulangan Bencana Daerah',
      hero_badge VARCHAR(255) DEFAULT 'Kesiapsiagaan Kebencanaan',
      ticker_text TEXT DEFAULT 'Status Siaga Darurat Bencana Hidrometeorologi Kota Bitung aktif • Waspadai gelombang tinggi 1.5 - 2.5m di perairan Selat Lembeh • Hubungi Call Center 112 atau Pusdalops (0438) 31112 jika mengalami situasi darurat.',
      call_center_112 VARCHAR(50) DEFAULT '112',
      hotline_pusdalops VARCHAR(100) DEFAULT '(0438) 31112',
      whatsapp_darurat VARCHAR(50) DEFAULT '+62 811-4321-112',
      email VARCHAR(100) DEFAULT 'bpbd@bitungkota.go.id',
      alamat TEXT DEFAULT 'Kompleks Kantor Walikota Bitung, Jl. Sam Ratulangi No. 45, Kota Bitung, Sulawesi Utara',
      status_siaga VARCHAR(100) DEFAULT 'SIAGA DARURAT 24/7',
      ikm_score NUMERIC(4, 1) DEFAULT 94.8,
      realisasi_keuangan NUMERIC(5, 2) DEFAULT 94.76,
      realisasi_fisik NUMERIC(5, 2) DEFAULT 98.33,
      instagram_url VARCHAR(255) DEFAULT 'https://instagram.com/bpbdkotabitung',
      facebook_url VARCHAR(255) DEFAULT 'https://facebook.com/bpbdkotabitung',
      youtube_url VARCHAR(255) DEFAULT 'https://youtube.com/@bpbdkotabitung',
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create Profile Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS profile (
      id SERIAL PRIMARY KEY,
      visi TEXT,
      misi TEXT,
      sejarah TEXT,
      tupoksi TEXT,
      struktur_organisasi_url TEXT,
      kepala_pelaksana_name VARCHAR(150),
      kepala_pelaksana_nip VARCHAR(50),
      kepala_pelaksana_photo TEXT,
      kepala_pelaksana_sambutan TEXT,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create Slides Table (Hero Carousel)
  await client.query(`
    CREATE TABLE IF NOT EXISTS slides (
      id SERIAL PRIMARY KEY,
      badge VARCHAR(100),
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      primary_cta_text VARCHAR(100) DEFAULT 'Layanan Siaga 24 Jam',
      primary_cta_link VARCHAR(255) DEFAULT '#berita',
      secondary_cta_text VARCHAR(100) DEFAULT 'Peringatan Dini Cuaca',
      secondary_cta_link VARCHAR(255) DEFAULT '#profil',
      order_index INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create News Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS news (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      category VARCHAR(100) NOT NULL,
      excerpt TEXT,
      content TEXT,
      image_url TEXT,
      author VARCHAR(100) DEFAULT 'Humas BPBD Bitung',
      views INT DEFAULT 0,
      is_featured BOOLEAN DEFAULT FALSE,
      status VARCHAR(20) DEFAULT 'published',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create Disaster Stats Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS disaster_stats (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      count INT DEFAULT 0,
      trend VARCHAR(100),
      icon_name VARCHAR(50),
      color_gradient VARCHAR(100),
      order_index INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create Documents Table (Edukasi, Pengumuman, Renstra, SOP)
  await client.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL, -- 'edukasi', 'pengumuman', 'renstra', 'sop', 'ppid'
      category VARCHAR(100),
      file_url TEXT,
      file_format VARCHAR(20) DEFAULT 'PDF',
      file_size VARCHAR(50) DEFAULT '1.2 MB',
      publish_date DATE DEFAULT CURRENT_DATE,
      downloads INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create Gallery Table (Foto & Video)
  await client.query(`
    CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      type VARCHAR(20) NOT NULL, -- 'foto', 'video'
      media_url TEXT NOT NULL,
      caption TEXT,
      event_date VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create Reports Table (Aduan Masyarakat / LAPOR Bencana)
  await client.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id SERIAL PRIMARY KEY,
      reporter_name VARCHAR(100) NOT NULL,
      reporter_phone VARCHAR(50) NOT NULL,
      disaster_type VARCHAR(100) NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(30) DEFAULT 'Menunggu', -- 'Menunggu', 'Diproses', 'Selesai'
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create Audit Logs Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      user_name VARCHAR(100),
      action VARCHAR(100) NOT NULL,
      details TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("✅ All tables created successfully.");

  // Check if admin user exists, else create default
  const userCheck = await client.query("SELECT * FROM users WHERE username = 'admin'");
  if (userCheck.rows.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("admin123", salt);
    await client.query(
      "INSERT INTO users (username, password_hash, name, role) VALUES ($1, $2, $3, $4)",
      ["admin", hash, "Administrator BPBD", "admin"]
    );
    console.log("✅ Created default admin user: admin / admin123");
  }

  // Seed Site Settings
  const settingsCheck = await client.query("SELECT * FROM site_settings");
  if (settingsCheck.rows.length === 0) {
    await client.query(`
      INSERT INTO site_settings (site_name, site_tagline, hero_badge, call_center_112, hotline_pusdalops, email, alamat)
      VALUES (
        'BPBD KOTA BITUNG',
        'Badan Penanggulangan Bencana Daerah',
        'Kesiapsiagaan Kebencanaan',
        '112',
        '(0438) 31112',
        'bpbd@bitungkota.go.id',
        'Kompleks Kantor Walikota Bitung, Jl. Sam Ratulangi No. 45, Kota Bitung, Sulawesi Utara'
      )
    `);
    console.log("✅ Seeded initial site settings.");
  }

  // Seed Profile
  const profileCheck = await client.query("SELECT * FROM profile");
  if (profileCheck.rows.length === 0) {
    await client.query(`
      INSERT INTO profile (visi, misi, sejarah, tupoksi, kepala_pelaksana_name, kepala_pelaksana_nip, kepala_pelaksana_sambutan)
      VALUES (
        'Terwujudnya Kota Bitung yang Tangguh, Siap Siaga, dan Adaptif Menghadapi Ancaman Bencana Menuju Kesejahteraan Masyarakat yang Berkelanjutan.',
        '1. Meningkatkan kapasitas dan kesiapsiagaan aparatur serta masyarakat dalam menghadapi bencana.\n2. Mengembangkan sistem peringatan dini terintegrasi berbasis teknologi maritim dan daratan.\n3. Mempercepat respons tanggap darurat dan pemulihan pasca bencana secara terkoordinasi dan transparan.\n4. Menjalin kemitraan kolaboratif pentahelix dengan TNI/Polri, dunia usaha, akademisi, media, dan relawan.',
        'BPBD Kota Bitung dibentuk berdasarkan Peraturan Daerah Kota Bitung sebagai wujud komitmen pemerintah dalam memberikan perlindungan maksimal bagi seluruh warga kota dari ancaman bencana alam, non-alam, dan sosial.',
        'Melaksanakan tugas penanggulangan bencana daerah secara terencana, terpadu, terkoordinasi, dan menyeluruh meliputi tahap pra-bencana, saat tanggap darurat, dan pasca bencana.',
        'Drs. Fivi K. Sumampouw, M.Si',
        '19720815 199303 1 004',
        'Salam Tangguh! Keselamatan warga adalah hukum tertinggi. Kami berkomitmen memberikan pelayanan siaga bencana 24 jam nonstop bagi seluruh masyarakat Kota Bitung.'
      )
    `);
    console.log("✅ Seeded initial profile data.");
  }

  // Seed Slides
  const slidesCheck = await client.query("SELECT * FROM slides");
  if (slidesCheck.rows.length === 0) {
    await client.query(`
      INSERT INTO slides (badge, title, subtitle, description, image_url, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link, order_index)
      VALUES
      (
        'Kesiapsiagaan Kebencanaan',
        'SELAMAT DATANG DI WEBSITE RESMI',
        'BPBD KOTA BITUNG',
        'Garda Terdepan Penanggulangan Bencana Kota Bitung: Cepat, Tanggap, Terpadu, dan Berkeadilan Demi Keselamatan Masyarakat.',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80',
        'Layanan Siaga 24 Jam', '#berita', 'Peringatan Dini Cuaca', '#profil', 1
      ),
      (
        'Mitigasi & Edukasi',
        'BANGUN KOTA TANGGUH BENCANA',
        'DESTANA & KATANA BITUNG',
        'Mewujudkan Kelurahan Tangguh Bencana dan Edukasi Keluarga Tanggap Darurat di seluruh wilayah pesisir dan perbukitan Kota Bitung.',
        'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1920&q=80',
        'Modul Edukasi', '#edukasi', 'Profil Relawan', '#profil', 2
      ),
      (
        'Peringatan Dini & Posko',
        'PUSAT PENGENDALIAN OPERASI',
        'PUSDALOPS-PB BITUNG',
        'Pemantauan cuaca maritim Selat Lembeh, peringatan dini gelombang pasang, pergerakan tanah, dan pos komando reaksi cepat 24/7.',
        'https://images.unsplash.com/photo-1599384852952-64126ea0290e?auto=format&fit=crop&w=1920&q=80',
        'Call Center 112', 'tel:112', 'Pantauan Bencana', '#peta-bencana', 3
      )
    `);
    console.log("✅ Seeded initial hero slides.");
  }

  // Seed Disaster Stats
  const statsCheck = await client.query("SELECT * FROM disaster_stats");
  if (statsCheck.rows.length === 0) {
    await client.query(`
      INSERT INTO disaster_stats (name, count, trend, icon_name, color_gradient, order_index)
      VALUES
      ('Banjir & Genangan', 4, 'Waspada Musim Hujan', 'CloudRain', 'from-blue-500 to-cyan-500', 1),
      ('Cuaca Ekstrem / Angin', 18, 'Peringatan BMKG Aktif', 'Wind', 'from-amber-500 to-orange-500', 2),
      ('Tanah Longsor', 2, 'Wilayah Tebing Curam', 'AlertTriangle', 'from-emerald-500 to-teal-500', 3),
      ('Gelombang Pasang', 1, 'Pesisir Lembeh & Aertembaga', 'Waves', 'from-indigo-500 to-blue-600', 4),
      ('Kebakaran Lahan', 0, 'Status Terkendali', 'Flame', 'from-rose-500 to-red-600', 5),
      ('Gempa Bumi Terasa', 3, 'Monitoring BMKG Bitung', 'Activity', 'from-purple-500 to-violet-600', 6)
    `);
    console.log("✅ Seeded disaster statistics.");
  }

  // Seed News
  const newsCheck = await client.query("SELECT * FROM news");
  if (newsCheck.rows.length === 0) {
    await client.query(`
      INSERT INTO news (title, slug, category, excerpt, content, image_url, is_featured, status)
      VALUES
      (
        'BPBD Bitung Tetapkan Status Siaga Darurat Bencana Hidrometeorologi Selama 60 Hari',
        'bpbd-bitung-tetapkan-status-siaga-darurat-hidrometeorologi',
        'Berita Utama',
        'Pemerintah Kota Bitung melalui BPBD menetapkan status siaga darurat cuaca ekstrem menyusul peningkatan curah hujan lebat dan angin kencang di perairan Selat Lembeh.',
        '<p>Pemerintah Kota Bitung secara resmi memberlakukan status Siaga Darurat Bencana Hidrometeorologi selama 60 hari ke depan. Hal ini didasarkan pada prakiraan cuaca dari BMKG Stasiun Maritim Bitung mengenai potensi peningkatan intensitas hujan lebat yang disertai petir dan angin kencang.</p><p>Kepala Pelaksana BPBD mengimbau masyarakat, khususnya nelayan di Pulau Lembeh dan warga yang bermukim di lereng perbukitan, agar meningkatkan kewaspadaan ekstra terhadap ancaman banjir limpasan dan pergerakan tanah.</p>',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
        TRUE, 'published'
      ),
      (
        'Gelar Apel Kesiapsiagaan Pasukan Reaksi Cepat Menghadapi Cuaca Ekstrem Akhir Tahun',
        'gelar-apel-kesiapsiagaan-pasukan-reaksi-cepat',
        'Kesiapsiagaan',
        'Ratusan personel gabungan BPBD, Basarnas, TNI/Polri dan relawan kebencanaan disiagakan di seluruh pos komando kecamatan.',
        '<p>Apel kesiapsiagaan digelar di Lapangan Kantor Walikota Bitung yang dipimpin langsung oleh jajaran Forkopimda. Peralatan evakuasi perahu karet, tenda darurat, genset, dan logistik bahan pangan telah disiapkan secara optimal.</p>',
        'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80',
        FALSE, 'published'
      ),
      (
        'Edukasi & Simulasi Mandiri Evakuasi Gempa Bumi di Kawasan Pesisir Lembeh Selatan',
        'edukasi-simulasi-mandiri-evakuasi-gempa-bumi-lembeh',
        'Edukasi',
        'Warga masyarakat dan sekolah-sekolah di pesisir Lembeh antusias mengikuti pelatihan jalur evakuasi dan mitigasi tsunami berbasis kearifan lokal.',
        '<p>Pelatihan dan simulasi evakuasi mandiri diadakan bersama para pelajar dan kelompok masyarakat desa tangguh bencana guna memperkuat kesiapsiagaan menghadapi potensi bencana tektonik dan tsunami.</p>',
        'https://images.unsplash.com/photo-1599384852952-64126ea0290e?auto=format&fit=crop&w=600&q=80',
        FALSE, 'published'
      ),
      (
        'Tim TRC BPBD Gerak Cepat Evakuasi Pohon Tumbang di Ruas Jalan Protokol Girian',
        'tim-trc-bpbd-gerak-cepat-evakuasi-pohon-tumbang-girian',
        'Tanggap Darurat',
        'Pembersihan material kayu dan pengamanan jaringan kabel listrik diselesaikan dalam waktu kurang dari 45 menit tanpa korban jiwa.',
        '<p>Angin kencang yang melanda wilayah Girian menyebabkan sebuah pohon besar tumbang menghalangi jalan utama. Personel TRC BPBD Bitung bertindak cepat dengan chainsaw untuk mengevakuasi batang pohon dan melancarkan kembali arus lalu lintas.</p>',
        'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
        FALSE, 'published'
      )
    `);
    console.log("✅ Seeded initial news data.");
  }

  // Seed Documents
  const docsCheck = await client.query("SELECT * FROM documents");
  if (docsCheck.rows.length === 0) {
    await client.query(`
      INSERT INTO documents (title, type, category, file_url, file_format, file_size)
      VALUES
      ('Buku Saku Tanggap Bencana Gempa Bumi dan Tsunami Kota Bitung', 'edukasi', 'Pedoman Mitigasi', '/docs/buku-saku-gempa-tsunami.pdf', 'PDF', '4.8 MB'),
      ('Panduan Jalur Evakuasi dan Titik Kumpul Darurat Pesisir Lembeh', 'edukasi', 'Peta Jalur', '/docs/panduan-jalur-evakuasi.pdf', 'PDF', '8.2 MB'),
      ('SOP Penanganan Bencana Tanah Longsor & Pergerakan Tanah', 'edukasi', 'Standar Operasional', '/docs/sop-longsor.pdf', 'PDF', '2.1 MB'),
      ('Brosur Kesiapsiagaan Keluarga Hadapi Cuaca Ekstrem', 'edukasi', 'Edukasi Keluarga', '/docs/brosur-cuaca-ekstrem.pdf', 'PDF', '1.5 MB'),
      ('Surat Keputusan Walikota Bitung tentang Status Siaga Darurat Hidrometeorologi', 'pengumuman', 'SK Walikota', '/docs/sk-siaga-darurat.pdf', 'PDF', '1.2 MB'),
      ('Peringatan Dini Cuaca Maritim & Gelombang Tinggi Selat Lembeh', 'pengumuman', 'Edaran BMKG', '/docs/peringatan-dini-maritim.pdf', 'PDF', '850 KB'),
      ('Jadwal Pelatihan Relawan Kelurahan Tangguh Bencana Angkatan IV', 'pengumuman', 'Pengumuman Resmi', '/docs/jadwal-destana-iv.pdf', 'PDF', '620 KB'),
      ('Laporan Realisasi Bantuan Logistik Pasca Bencana Gelombang Pasang Triwulan III', 'pengumuman', 'Laporan Kinerja', '/docs/laporan-logistik-tw3.pdf', 'PDF', '2.4 MB')
    `);
    console.log("✅ Seeded initial documents.");
  }

  // Seed Gallery
  const galleryCheck = await client.query("SELECT * FROM gallery");
  if (galleryCheck.rows.length === 0) {
    await client.query(`
      INSERT INTO gallery (title, type, media_url, caption, event_date)
      VALUES
      (
        'Apel Gelar Pasukan Kesiapsiagaan Bencana di Lapangan Kantor Walikota Bitung',
        'foto',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
        'Pengecekan kesiapan armada perahu karet, mobil rescue, chainsaw, dan tenda darurat.',
        '18 Nov 2026'
      ),
      (
        'Pemasangan Rambu Jalur Evakuasi dan Warning Sirine Tsunami di Pantai Pasir Putih',
        'foto',
        'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
        'Optimalisasi early warning system untuk kawasan padat penduduk tepi pantai.',
        '14 Nov 2026'
      ),
      (
        'Video Simulasi Tanggap Darurat Gempa dan Tsunami Bersama Pelajar Bitung',
        'video',
        'https://images.unsplash.com/photo-1599384852952-64126ea0290e?auto=format&fit=crop&w=800&q=80',
        'Latihan "Drop, Cover, Hold On" serta evakuasi teratur menuju titik kumpul zona aman.',
        '11 Nov 2026'
      ),
      (
        'Distribusi Bantuan Logistik dan Tenda Pengungsi untuk Wilayah Terdampak Angin Kencang',
        'foto',
        'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
        'Penyaluran selimut, matras, sembako, dan kit higienis kepada warga terdampak.',
        '08 Nov 2026'
      )
    `);
    console.log("✅ Seeded initial gallery.");
  }

  // Seed sample incoming reports
  const reportsCheck = await client.query("SELECT * FROM reports");
  if (reportsCheck.rows.length === 0) {
    await client.query(`
      INSERT INTO reports (reporter_name, reporter_phone, disaster_type, location, description, status)
      VALUES
      ('Budi Santoso', '081234567890', 'Pohon Tumbang', 'Jl. Sam Ratulangi No. 12, Girian', 'Pohon peneduh jalan patah dan menimpa kabel penerangan jalan.', 'Selesai'),
      ('Maria Lumempouw', '085298765432', 'Genangan Air / Banjir', 'Kelurahan Aertembaga Lingkungan 3', 'Saluran air tersumbat material sampah menyebabkan air meluap ke pekarangan.', 'Diproses'),
      ('Hendrik Wenas', '082187654321', 'Tanah Longsor', 'Jalur Tebing Pintu Kota, Lembeh Selatan', 'Tebing setinggi 3 meter mengalami guguran tanah tipis saat hujan deras.', 'Menunggu')
    `);
    console.log("✅ Seeded sample citizen reports.");
  }

  await client.end();
  console.log("🚀 Database initialization & seeding completed successfully!");
}

initializeDatabase().catch((err) => {
  console.error("❌ Database initialization error:", err);
  process.exit(1);
});
