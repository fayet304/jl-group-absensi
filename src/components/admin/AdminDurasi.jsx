import React, { useEffect, useState } from 'react'
import { Save, Check } from 'lucide-react'
import { updateRow } from '../../services/api.js'

export default function AdminDurasi({ durasi, onRefresh }) {
  const [rows, setRows] = useState(durasi)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => setRows(durasi), [durasi])

  const change = (id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: Number(value) || 0 } : r)))
    setSaved(false)
  }

  const simpan = async () => {
    setBusy(true)
    await Promise.all(rows.map((r) => updateRow('PengaturanDurasi', r)))
    await onRefresh()
    setBusy(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="glass rounded-2xl p-5 max-w-2xl">
      <h3 className="text-sm font-semibold text-white mb-4">Batas Durasi & Kuota Izin</h3>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-3 gap-3 items-center bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3">
            <p className="text-sm text-white">{r.kategoriIzin}</p>
            <div>
              <label className="text-[11px] text-muted block mb-1">Durasi (menit)</label>
              <input
                type="number"
                min={1}
                value={r.durasiMenit}
                onChange={(e) => change(r.id, 'durasiMenit', e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-600 rounded-lg py-1.5 px-2.5 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted block mb-1">Limit Kuota</label>
              <input
                type="number"
                min={1}
                value={r.limitKuota}
                onChange={(e) => change(r.id, 'limitKuota', e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-600 rounded-lg py-1.5 px-2.5 text-white text-sm"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={simpan}
        disabled={busy}
        className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-lg btn-glow text-slate-950 font-medium text-sm hover:brightness-110 transition disabled:opacity-50"
      >
        {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saved ? 'Tersimpan' : 'Simpan Durasi'}
      </button>
    </div>
  )
}
