import React, { useEffect, useMemo, useState } from 'react'
import { Coffee, Cigarette, HandHeart, Bath, Utensils, ChevronDown, Square } from 'lucide-react'
import { createRow, updateRow } from '../services/api.js'

const ICONS = {
  'Istirahat 1': Coffee,
  Merokok: Cigarette,
  Ibadah: HandHeart,
  Toilet: Bath,
  Makan: Utensils,
}

const DEFAULT_CATEGORIES = [
  { kategoriIzin: 'Istirahat 1', durasiMenit: 15, limitKuota: 2 },
  { kategoriIzin: 'Merokok', durasiMenit: 15, limitKuota: 2 },
  { kategoriIzin: 'Ibadah', durasiMenit: 10, limitKuota: 2 },
  { kategoriIzin: 'Toilet', durasiMenit: 5, limitKuota: 2 },
  { kategoriIzin: 'Makan', durasiMenit: 20, limitKuota: 2 },
]

function useTick(ms = 1000) {
  const [, setT] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), ms)
    return () => clearInterval(id)
  }, [ms])
}

function isToday(ts) {
  const d = new Date(ts)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

function formatMMSS(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const m = String(Math.floor(totalSec / 60)).padStart(2, '0')
  const s = String(totalSec % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function IzinSementara({ user, durasi, aktivitas, onRefresh }) {
  useTick(1000)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const categories = durasi && durasi.length > 0 ? durasi : DEFAULT_CATEGORIES

  const myActivities = useMemo(
    () => aktivitas.filter((a) => a.nama === user.nama),
    [aktivitas, user.nama]
  )

  const activeIzin = myActivities.find((a) => a.status === 'Sedang Izin')

  const quotaUsed = (kategori) =>
    myActivities.filter((a) => a.jenisIzin === kategori && isToday(a.waktuMulai)).length

  const startIzin = async (cat) => {
    if (busy || activeIzin) return
    if (quotaUsed(cat.kategoriIzin) >= cat.limitKuota) return
    setBusy(true)
    await createRow('AktivitasIzin', {
      nama: user.nama,
      jenisIzin: cat.kategoriIzin,
      waktuMulai: Date.now(),
      waktuSelesai: null,
      durasi: null,
      status: 'Sedang Izin',
    })
    await onRefresh()
    setBusy(false)
  }

  const finishIzin = async () => {
    if (!activeIzin || busy) return
    setBusy(true)
    const durasiMenit = Math.round((Date.now() - activeIzin.waktuMulai) / 60000)
    await updateRow('AktivitasIzin', {
      id: activeIzin.id,
      waktuSelesai: Date.now(),
      durasi: Math.max(durasiMenit, 1),
      status: 'Selesai',
    })
    await onRefresh()
    setBusy(false)
  }

  const riwayat = myActivities.filter((a) => a.status === 'Selesai').sort((a, b) => b.waktuMulai - a.waktuMulai)

  return (
    <div className="flex flex-col gap-6">
      {activeIzin && (
        <div className="glass rounded-2xl p-5 border-accent-cyan/40 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-muted mb-1">Sedang berlangsung</p>
            <p className="text-lg text-white font-semibold">{activeIzin.jenisIzin}</p>
          </div>
          <div className="text-3xl font-mono text-accent-cyan tabular-nums">
            {formatMMSS(Date.now() - activeIzin.waktuMulai)}
          </div>
          <button
            onClick={finishIzin}
            disabled={busy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25 transition disabled:opacity-50"
          >
            <Square className="w-4 h-4" /> Selesai
          </button>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Ajukan Izin Sementara</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = ICONS[cat.kategoriIzin] || Coffee
            const used = quotaUsed(cat.kategoriIzin)
            const full = used >= cat.limitKuota
            const disabled = full || !!activeIzin || busy
            return (
              <button
                key={cat.kategoriIzin}
                onClick={() => startIzin(cat)}
                disabled={disabled}
                className={`glass rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${
                  disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-accent-cyan/60 hover:shadow-glow'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent-cyan" />
                </div>
                <p className="text-sm text-white font-medium">{cat.kategoriIzin}</p>
                <p className="text-xs text-muted">
                  {cat.durasiMenit}m &middot; {used}/{cat.limitKuota}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <button
          onClick={() => setHistoryOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4"
        >
          <span className="text-sm font-semibold text-white">Riwayat Izin</span>
          <ChevronDown className={`w-4 h-4 text-muted transition-transform ${historyOpen ? 'rotate-180' : ''}`} />
        </button>
        {historyOpen && (
          <div className="px-5 pb-5 flex flex-col gap-2 max-h-72 overflow-y-auto">
            {riwayat.length === 0 && <p className="text-muted text-sm">Belum ada riwayat izin.</p>}
            {riwayat.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-slate-800/40 border border-slate-700/40 rounded-xl px-3.5 py-2.5">
                <div>
                  <p className="text-sm text-white">{r.jenisIzin}</p>
                  <p className="text-xs text-muted">{new Date(r.waktuMulai).toLocaleString('id-ID')}</p>
                </div>
                <span className="text-xs text-accent-cyan font-medium">{r.durasi} menit</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
