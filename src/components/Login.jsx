import React, { useState } from 'react'
import { Lock, LogIn, LogOut, X, UserCheck } from 'lucide-react'
import { createRow } from '../services/api.js'

export default function Login({ karyawan, loading, onLogin }) {
  const [selectedUser, setSelectedUser] = useState(null)
  const [pinInput, setPinInput] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSelectUser = (userItem) => {
    setSelectedUser(userItem)
    setPinInput('')
    setErrorMsg('')
  }

  const handleAction = async (actionType) => {
    // Verifikasi PIN
    const correctPin = selectedUser.pin || '1234' // Default 1234 jika PIN belum diisi di Sheet
    if (pinInput !== String(correctPin)) {
      setErrorMsg('PIN salah! Silakan coba lagi.')
      return
    }

    setBusy(true)
    setErrorMsg('')

    const nowIso = new Date().toISOString()
    const tipeAksi = actionType === 'MASUK' ? 'Absen Masuk' : 'Absen Pulang'

    try {
      // Catat riwayat absensi ke Google Sheets
      await createRow('AktivitasIzin', {
        nama: selectedUser.nama,
        tipe: tipeAksi,
        waktu: nowIso,
      })

      if (actionType === 'MASUK') {
        // Masuk ke dashboard utama
        onLogin(selectedUser)
      } else {
        // Absen Pulang: Beri notifikasi lalu bersihkan modal
        alert(`Terima kasih ${selectedUser.nama}, Absen Pulang berhasil dicatat!`)
        setSelectedUser(null)
        setPinInput('')
      }
    } catch (err) {
      setErrorMsg('Gagal menyimpan absensi. Coba lagi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md glass p-6 rounded-2xl flex flex-col gap-5">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Sistem Absensi JL Group</h1>
          <p className="text-xs text-muted mt-1">Pilih nama Anda untuk melanjutkan</p>
        </div>

        {loading ? (
          <p className="text-center text-xs text-muted py-8">Memuat data karyawan...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
            {karyawan.map((k) => (
              <button
                key={k.id || k.nama}
                onClick={() => handleSelectUser(k)}
                className="glass p-3 rounded-xl flex items-center gap-3 hover:border-amber-400/50 transition text-left"
              >
                <img
                  src={k.fotoUrl || '/default-avatar.png'}
                  alt={k.nama}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">{k.nama}</p>
                  <p className="text-[10px] text-muted truncate">{k.divisi || 'Staf'}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal Prompt PIN & Opsi Absen */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-sm relative flex flex-col gap-4">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={selectedUser.fotoUrl || '/default-avatar.png'}
                alt={selectedUser.nama}
                className="w-12 h-12 rounded-full object-cover border border-amber-400"
              />
              <div>
                <h3 className="text-sm font-bold text-white">{selectedUser.nama}</h3>
                <p className="text-xs text-muted">Masukkan 4 Digit PIN</p>
              </div>
            </div>

            <div>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="****"
                className="w-full text-center text-2xl font-mono tracking-widest bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 text-white focus:outline-none focus:border-amber-400"
                autoFocus
              />
              {errorMsg && <p className="text-[11px] text-rose-400 mt-1.5 text-center">{errorMsg}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-2">
              <button
                disabled={busy || pinInput.length < 4}
                onClick={() => handleAction('MASUK')}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition disabled:opacity-40"
              >
                <LogIn className="w-4 h-4" /> Absen Masuk
              </button>

              <button
                disabled={busy || pinInput.length < 4}
                onClick={() => handleAction('PULANG')}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition disabled:opacity-40"
              >
                <LogOut className="w-4 h-4" /> Absen Pulang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}