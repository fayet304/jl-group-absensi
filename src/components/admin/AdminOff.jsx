import React, { useState, useEffect } from 'react'
import { Check, X, Clock } from 'lucide-react'
import { fetchSheet, updateRow } from '../../services/api.js'

export default function AdminOff({ onRefresh }) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const data = await fetchSheet('PengajuanOff')
    setList(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatus = async (item, newStatus) => {
    // Ambil format YYYY-MM-DD jika tanggal berupa ISO string
    const cleanDate = item.tanggal ? item.tanggal.split('T')[0] : item.tanggal

    await updateRow('PengajuanOff', {
      ...item,
      tanggal: cleanDate,
      status: newStatus,
    })

    await loadData()
    if (onRefresh) await onRefresh()
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-white">Persetujuan Pengajuan Off / Libur</h3>

      {loading ? (
        <p className="text-xs text-muted">Memuat data pengajuan...</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {list.length === 0 && (
            <p className="text-xs text-muted italic">Belum ada data pengajuan off.</p>
          )}

          {list.map((item) => {
            // Bersihkan tanggal untuk tampilan
            const displayDate = item.tanggal ? item.tanggal.split('T')[0] : '-'

            return (
              <div
                key={item.id}
                className="glass p-4 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-white">{item.nama}</p>
                  <p className="text-xs text-muted">
                    Tanggal: <span className="text-slate-200">{displayDate}</span> | Alasan:{' '}
                    <span className="text-slate-200">{item.alasan || '-'}</span>
                  </p>
                  <div>
                    <span
                      className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        item.status === 'Disetujui'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'Ditolak'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {item.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(item, 'Disetujui')}
                      title="Setujui"
                      className="p-2 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded-lg transition"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatus(item, 'Ditolak')}
                      title="Tolak"
                      className="p-2 bg-rose-600/80 hover:bg-rose-500 text-white rounded-lg transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}