// Data simulasi lokal. Dipakai sebagai fallback otomatis ketika
// URL Endpoint Google Apps Script belum diisi di Tab Branding (Admin Panel),
// atau ketika fetch ke Google Sheets gagal (mis. offline / endpoint salah).

export const mockKaryawan = [
  { id: 'K001', nama: 'Dewi Anggraini', divisi: 'Produksi', fotoUrl: 'https://i.pravatar.cc/150?img=47', pin: '1234' },
  { id: 'K002', nama: 'Budi Santoso', divisi: 'Gudang', fotoUrl: 'https://i.pravatar.cc/150?img=12', pin: '1111' },
  { id: 'K003', nama: 'Siti Rahma', divisi: 'QC', fotoUrl: 'https://i.pravatar.cc/150?img=32', pin: '2222' },
  { id: 'K004', nama: 'Agus Wijaya', divisi: 'Produksi', fotoUrl: 'https://i.pravatar.cc/150?img=51', pin: '3333' },
  { id: 'K005', nama: 'Rina Marlina', divisi: 'Admin', fotoUrl: 'https://i.pravatar.cc/150?img=25', pin: '4444' },
  { id: 'K006', nama: 'Hendra Gunawan', divisi: 'Gudang', fotoUrl: 'https://i.pravatar.cc/150?img=15', pin: '5555' },
  { id: 'K007', nama: 'Lestari Putri', divisi: 'QC', fotoUrl: 'https://i.pravatar.cc/150?img=44', pin: '6666' },
  { id: 'K008', nama: 'Fajar Nugroho', divisi: 'Produksi', fotoUrl: 'https://i.pravatar.cc/150?img=8', pin: '7777' },
]

export const mockAktivitasIzin = [
  { id: 'A001', nama: 'Dewi Anggraini', jenisIzin: 'Ibadah', waktuMulai: Date.now() - 1000 * 60 * 3, waktuSelesai: null, durasi: null, status: 'Sedang Izin' },
  { id: 'A002', nama: 'Budi Santoso', jenisIzin: 'Makan', waktuMulai: Date.now() - 1000 * 60 * 40, waktuSelesai: Date.now() - 1000 * 60 * 20, durasi: 20, status: 'Selesai' },
  { id: 'A003', nama: 'Siti Rahma', jenisIzin: 'Toilet', waktuMulai: Date.now() - 1000 * 60 * 90, waktuSelesai: Date.now() - 1000 * 60 * 86, durasi: 4, status: 'Selesai' },
]

export const mockJadwalShift = [
  { id: 'S001', divisi: 'Produksi', namaShift: 'PAGI', jamMasuk: '07:00', jamPulang: '15:00' },
  { id: 'S002', divisi: 'Produksi', namaShift: 'SIANG', jamMasuk: '15:00', jamPulang: '23:00' },
  { id: 'S003', divisi: 'Gudang', namaShift: 'PAGI', jamMasuk: '08:00', jamPulang: '16:00' },
  { id: 'S004', divisi: 'QC', namaShift: 'MALAM', jamMasuk: '23:00', jamPulang: '07:00' },
  { id: 'S005', divisi: 'Admin', namaShift: 'PAGI', jamMasuk: '08:00', jamPulang: '17:00' },
]

export const mockPengaturanDurasi = [
  { id: 'D1', kategoriIzin: 'Istirahat 1', durasiMenit: 15, limitKuota: 2 },
  { id: 'D2', kategoriIzin: 'Merokok', durasiMenit: 15, limitKuota: 2 },
  { id: 'D3', kategoriIzin: 'Ibadah', durasiMenit: 10, limitKuota: 2 },
  { id: 'D4', kategoriIzin: 'Toilet', durasiMenit: 5, limitKuota: 2 },
  { id: 'D5', kategoriIzin: 'Makan', durasiMenit: 20, limitKuota: 2 },
]

export const mockPengajuanOff = [
  { id: 'O001', nama: 'Budi Santoso', tanggal: '2026-09-12', alasan: 'Acara keluarga', status: 'Disetujui' },
  { id: 'O002', nama: 'Siti Rahma', tanggal: '2026-09-15', alasan: 'Sakit', status: 'Pending' },
  { id: 'O003', nama: 'Fajar Nugroho', tanggal: '2026-09-20', alasan: 'Keperluan pribadi', status: 'Disetujui' },
]
