# Nyekrip

Platform pembelajaran pemrograman interaktif berbasis web yang menggabungkan penyampaian teori terstruktur, visualisasi konsep, latihan logika berbasis drag-and-drop, dan lingkungan eksekusi kode otomatis (*auto-judge*) secara real-time.

---

## Ringkasan Proyek

Nyekrip dirancang untuk menghadirkan alur belajar pemrograman yang komprehensif tanpa fragmentasi antarmuka. Pengguna dapat membaca teori, mengeksplorasi kode melalui editor Monaco, menyelesaikan tantangan sintaksis dengan teka-teki logika, serta mengevaluasi program langsung terhadap test cases yang telah ditentukan.

## Fitur Utama

- **Interactive Theory Viewer**: Modul materi terstruktur dilengkapi komponen visualisasi konsep dan markdown rendering adaptif.
- **Puzzle & Drag-and-Drop Exercises**: Evaluasi pemahaman logika pemrograman dan rekonstruksi sintaksis tanpa mengetik manual.
- **Auto-Judge Coding Workspace**: Editor berbasis Monaco dengan eksekusi kode dan validasi terhadap serangkaian test case standar (Judge0).
- **Gamified Progression Engine**: Pelacakan kemajuan belajar, akumulasi XP, dan sistem level adaptif.
- **Responsive Interface & Smooth Scrolling**: Desain modern berbasis Tailwind CSS dengan animasi antarmuka teroptimasi.

## Spesifikasi Teknologi

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| Framework | Next.js (App Router, Turbopack) | Fondasi aplikasi fullstack berbasis React 19 |
| Bahasa | TypeScript | Type safety dan validasi statis kode |
| Styling | Tailwind CSS v4 | Utilitas styling modular dan desain responsif |
| Animasi | Motion & Lenis | Transisi visual dan *smooth scroll provider* |
| Database & Auth | Neon (Postgres & Neon Auth) | Penyimpanan data relasional Postgres dan sistem autentikasi (Google OAuth) |
| Code Editor | Monaco Editor (`@monaco-editor/react`) | Engine editor kode interaktif di sisi klien |
| Code Execution | Judge0 API | Sandbox eksekusi kode backend dan evaluasi output |

## Struktur Direktori

```text
├── app/                  # Route handlers, pages, dan layout aplikasi (Next.js App Router)
│   ├── api/              # API endpoints (exercises, judge runner, progress, lesson data)
│   ├── course/           # Halaman alur modul, latihan interaktif, dan auto-judge
│   ├── dashboard/        # Dashboard profil dan pencapaian pengguna
│   └── java/             # Rute spesifik modul kurikulum pemrograman Java
├── components/           # Komponen UI modular dan reusable
│   ├── auth/             # Komponen modal otentikasi
│   ├── exercise/         # Komponen runner latihan, Monaco editor, dan puzzle drag-drop
│   ├── layout/           # Navbar, footer, dan notifikasi progres
│   ├── lesson/           # Penampil materi teori dan playground
│   └── ui/               # Elemen UI primitif (logo, splash screen, markdown renderer)
├── lib/                  # Utilitas logika bisnis, klien API, dan konfigurasi database
│   ├── data/             # Definisi dataset kurikulum dan silabus modul
│   ├── judge/            # Klien integrasi Judge0 execution engine
│   └── neon/             # Klien koneksi database serverless Neon & helper auth
├── public/               # Aset statis aplikasi
└── scripts/              # Skrip basis data dan seed content kurikulum
```

## Persyaratan Sistem

- Node.js versi 22.x atau lebih baru
- npm versi 10.x atau lebih baru

## Instalasi dan Setup Lokal

### 1. Kloning Repositori

```bash
git clone https://github.com/Umam07/Nyekrip.git
cd Nyekrip
```

### 2. Instalasi Dependensi

Pastikan dependensi terpasang sesuai dengan lockfile:

```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan

Salin berkas template lingkungan ke `.env.local`:

```bash
cp .env.example .env.local
```

Sesuaikan nilai variabel berikut pada berkas `.env.local`:

```env
# Neon Database & Auth Configuration
DATABASE_URL=postgresql://neondb_owner:your_password@your_endpoint.neon.tech/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:your_password@your_endpoint.neon.tech/neondb?sslmode=require
NEON_BRANCH=production
NEON_AUTH_BASE_URL=https://your-auth-domain.neon.tech
NEON_AUTH_JWKS_URL=https://your-auth-domain.neon.tech/.well-known/jwks.json

# Judge0 Execution Engine (Opsional / Mock fallback tersedia)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-rapidapi-key
```

### 4. Menjalankan Server Pengembangan

```bash
npm run dev
```

Aplikasi dapat diakses melalui browser pada tautan `http://localhost:3000`.

## Skrip NPM yang Tersedia

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan Next.js dengan Turbopack |
| `npm run build` | Melakukan kompilasi aset produksi dan optimasi static routes |
| `npm run start` | Menjalankan server aplikasi Next.js dalam mode produksi |
| `npm run typecheck` | Menjalankan pemeriksaan statis tipe data melalui `tsc --noEmit` |
| `npm run seed` | Mengeksekusi seeding data kurikulum dan modul awal ke database |

## Quality Assurance & CI/CD

Repository ini dikonfigurasi dengan GitHub Actions (`.github/workflows/ci.yml`) yang melakukan validasi otomatis pada setiap pull request dan push ke branch `main`:

1. **TypeScript Verification**: Memvalidasi integritas `package-lock.json` melalui `npm ci` dan menjalankan `npm run typecheck`.
2. **Production Build & Route Generation**: Memvalidasi keberhasilan kompilasi Next.js sebelum dilakukan deployment.

## Lisensi

Proyek ini dirilis di bawah lisensi MIT.
