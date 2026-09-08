# JL GROUP — Sistem Absensi & Manajemen Karyawan

Aplikasi web React + Tailwind CSS bertema **Modern Glassmorphism** (Deep Black / Midnight Blue / Cyan)
untuk manajemen izin sementara, jadwal shift, off/libur, dan admin karyawan. Bisa langsung
di-hosting gratis di **GitHub Pages**, dengan **Google Sheets** sebagai database utama melalui
**Google Apps Script Web App**.

Aplikasi tetap berjalan penuh **tanpa backend** berkat mode simulasi (mock data + localStorage) —
cocok untuk demo dulu sebelum menyambungkan Google Sheets.

---

## 1. Menjalankan di komputer (lokal)

Butuh [Node.js](https://nodejs.org) versi 18 ke atas.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Semua fitur berjalan dengan data simulasi (tersimpan di
localStorage browser) sampai Anda menghubungkan Google Sheets di langkah 2.

---

## 2. Menghubungkan ke Google Sheets (Database Utama)

### 2.1 Siapkan Spreadsheet
1. Buat **Google Sheets baru**.
2. Buat 5 sheet (tab) dengan **nama dan urutan kolom persis** seperti berikut (baris 1 = header):

| Sheet | Kolom |
|---|---|
| `Karyawan` | `id`, `nama`, `divisi`, `fotoUrl`, `pin` |
| `AktivitasIzin` | `id`, `nama`, `jenisIzin`, `waktuMulai`, `waktuSelesai`, `durasi`, `status` |
| `JadwalShift` | `id`, `divisi`, `namaShift`, `jamMasuk`, `jamPulang` |
| `PengaturanDurasi` | `id`, `kategoriIzin`, `durasiMenit`, `limitKuota` |
| `PengajuanOff` | `id`, `nama`, `tanggal`, `alasan`, `status` |

Anda boleh mengisi beberapa baris data awal (misalnya daftar karyawan), atau membiarkannya
kosong dan menambahkan data lewat Admin Panel setelah aplikasi berjalan.

### 2.2 Pasang Google Apps Script sebagai API
1. Di spreadsheet tadi, buka menu **Extensions > Apps Script**.
2. Hapus isi `Code.gs` bawaan, lalu salin-tempel seluruh isi file
   [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) dari folder ini.
3. Klik **Deploy > New deployment**.
   - Pilih jenis: **Web app**.
   - **Execute as**: Me.
   - **Who has access**: Anyone.
4. Klik **Deploy**, lalu salin URL yang dihasilkan (diakhiri `/exec`).

### 2.3 Sambungkan ke aplikasi
1. Buka aplikasi React (login dengan salah satu akun karyawan yang ada di data simulasi).
2. Masuk ke **Admin > Branding**.
3. Tempel URL Web App tadi ke kolom **Koneksi Google Sheets**, lalu klik **Simpan Pengaturan**.
4. Status akan berubah menjadi **"Terhubung ke Google Sheets"** dan seluruh data
   (karyawan, izin, shift, durasi, pengajuan off) mulai dibaca/ditulis langsung ke spreadsheet.

> Jika endpoint kosong atau gagal diakses, aplikasi otomatis kembali ke mode simulasi
> lokal — tidak akan error atau blank.

---

## 3. Deploy ke GitHub Pages

### Opsi A — Otomatis dengan GitHub Actions (disarankan)
1. Buat repository baru di GitHub, misalnya `jl-group-absensi`.
2. Push seluruh isi folder ini ke repository tersebut:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - JL GROUP Attendance App"
   git branch -M main
   git remote add origin https://github.com/USERNAME/jl-group-absensi.git
   git push -u origin main
   ```
3. Buka file `vite.config.js`, ubah baris `base` menjadi nama repo Anda, contoh:
   ```js
   base: '/jl-group-absensi/',
   ```
   commit & push lagi perubahan ini.
4. Di GitHub, buka **Settings > Pages**, pada **Build and deployment > Source** pilih
   **GitHub Actions**. Workflow `.github/workflows/deploy.yml` yang sudah disertakan akan
   otomatis build & publish setiap kali Anda push ke branch `main`.
5. Setelah selesai (cek tab **Actions**), situs Anda akan aktif di:
   `https://USERNAME.github.io/jl-group-absensi/`

### Opsi B — Manual dengan paket `gh-pages`
```bash
npm install
npm run deploy
```
Perintah ini akan build aplikasi lalu mem-publish folder `dist` ke branch `gh-pages`.
Lalu di **Settings > Pages**, pilih source branch `gh-pages` folder `/ (root)`.

---

## 4. Struktur Proyek

```
src/
  components/
    Login.jsx           # Halaman login grid karyawan + modal PIN
    Shell.jsx            # Topbar (jam, running text) + navigasi pill
    Dashboard.jsx         # Ringkasan, live activity log, leaderboard, shift
    IzinSementara.jsx    # Ajukan izin, timer live, kuota, riwayat
    OffMatrix.jsx        # Matriks kalender off/libur + pengajuan
    AdminPanel.jsx        # Wrapper 4 sub-tab admin
    admin/
      AdminKaryawan.jsx  # CRUD karyawan
      AdminShift.jsx     # CRUD jadwal shift
      AdminDurasi.jsx    # Pengaturan durasi & kuota izin
      AdminBranding.jsx  # Identitas app + endpoint Google Sheets
  data/mockData.js       # Data simulasi (fallback)
  services/api.js        # Layer komunikasi ke Google Apps Script + fallback lokal
google-apps-script/
  Code.gs                # Backend Apps Script (REST API di atas Google Sheets)
```

---

## 5. Akun demo (mode simulasi)

PIN default untuk mencoba login (bisa diubah lewat Admin > Karyawan):

| Nama | PIN |
|---|---|
| Dewi Anggraini | 1234 |
| Budi Santoso | 1111 |
| Siti Rahma | 2222 |
| Agus Wijaya | 3333 |
| Rina Marlina | 4444 |

---

## 6. Catatan Teknis

- **Real-time**: aplikasi melakukan polling (refresh data) setiap 5 detik ke Google Sheets
  agar aktivitas izin karyawan lain terlihat hampir real-time tanpa perlu WebSocket.
- **Keamanan PIN**: PIN disimpan polos di kolom `pin` pada sheet `Karyawan`. Untuk skala
  produksi yang lebih aman, pertimbangkan hashing PIN di sisi Apps Script.
- **Kuota harian** pada modul Izin Sementara dihitung ulang tiap hari berdasarkan tanggal
  `waktuMulai` masing-masing entri di sheet `AktivitasIzin`.
