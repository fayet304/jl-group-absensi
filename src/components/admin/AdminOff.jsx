import React, { useState, useEffect } from 'react'
import { Check, X, Clock } from 'lucide-react'
import { fetchSheet, updateRow } from '../../services/api.js'

export default function AdminOff() {
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
    await updateRow('PengajuanOff', { ...item, status: newStatus })
    loadData()
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Persetujuan Pengajuan Off / Libur</h3>

      {loading ? (
        <p className="text-muted text-sm">Memuat data...</p>
      ) : (
        <div className="space-y-2">
          {list.length === 0 && <p className="text-xs text-muted">Belum ada pengajuan off.</p>}
          {list.map((item) => (
            <div key={item.id} className="glass p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{item.nama}</p>
                <p className="text-xs text-muted">Tanggal: {item.tanggal} | Alasan: {item.alasan}</p>
                <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${
                  item.status === 'Disetujui' ? 'bg-emerald-500/20 text-emerald-400' :
                  item.status === 'Ditolak' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {item.status || 'Pending'}
                </span>
              </div>

              {item.status === 'Pending' && (
                <div className="flex gap-2">
                  <button onClick={() => handleStatus(item, 'Disetujui')} className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleStatus(item, 'Ditolak')} className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}