import React, { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createRow } from '../services/api.js'

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export default function OffMatrix({ user, karyawan, offRequests, onRefresh }) {
  const now = new Date()
  const [year] = useState(now.getFullYear())
  const [month] = useState(now.getMonth())
  const totalDays = daysInMonth(year, month)
  const days = Array.from({ length: totalDays }, (_, i) => i + 1)

  const [modalOpen, setModalOpen] = useState(false)
  const [tanggal, setTanggal] = useState('')
  const [alasan, setAlasan] = useState('')
  const [busy, setBusy] = useState(false)

  const findStatus = (nama, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const req = offRequests.find((o) => o.nama === nama && o.tanggal === dateStr)
    return req ? req.status : null
  }

  const submit = async () => {
    if (!tanggal || !alasan.trim() || busy) return
    setBusy(true)
    await createRow('PengajuanOff', {
      nama: user.nama,
      tanggal,
      alasan: alasan.trim(),
      status: 'Pending',
    })
    await onRefresh()
    setBusy(false)
    setModalOpen(false)
    setTanggal('')
    setAlasan('')
  }

  const monthLabel = new Date(year, month, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-sm font-semibold text-white">Matriks Off &amp; Libur &mdash; {monthLabel}</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg btn-glow text-slate-950 font-medium text-sm hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4" /> Pengajuan Off
        </button>
      </div>

      <div className="glass rounded-2xl overflow-x-auto">
        <table className="text-sm border-collapse min-w-max">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-slate-900/90 text-left text-muted font-normal px-4 py-3 border-b border-slate-700/50">
                Nama
              </th>
              {days.map((d) => (
                <th key={d} className="text-muted font-normal px-2.5 py-3 border-b border-slate-700/50 text-center min-w-[40px]">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {karyawan.map((k) => (
              <tr key={k.id} className="border-b border-slate-800/60">
                <td className="sticky left-0 z-10 bg-slate-900/90 px-4 py-2.5 text-white whitespace-nowrap">{k.nama}</td>
                {days.map((d) => {
                  const status = findStatus(k.nama, d)
                  return (
                    <td key={d} className="text-center px-1 py-2.5">
                      {status === 'Disetujui' && (
                        <span className="inline-block px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-400 text-[10px] font-semibold">
                          OFF
                        </span>
                      )}
                      {status === 'Pending' && (
                        <span className="inline-block px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-semibold">
                          PENDING
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-sm relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-white mb-4">Pengajuan Off</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-muted mb-1 block">Tanggal</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-lg py-2 px-3 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Alasan</label>
                <textarea
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-lg py-2 px-3 text-white resize-none"
                  placeholder="Contoh: Acara keluarga"
                />
              </div>
              <button
                onClick={submit}
                disabled={busy}
                className="mt-2 py-2.5 rounded-lg btn-glow text-slate-950 font-medium hover:brightness-110 transition disabled:opacity-50"
              >
                Kirim Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
