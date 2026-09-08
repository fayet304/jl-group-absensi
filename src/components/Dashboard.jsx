import React, { useEffect, useMemo, useState } from 'react'
import { Users, UserCheck, Timer, CalendarOff, Activity, Trophy, Clock3 } from 'lucide-react'

function useTick(ms = 1000) {
  const [, setT] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), ms)
    return () => clearInterval(id)
  }, [ms])
}

function formatDuration(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const m = String(Math.floor(totalSec / 60)).padStart(2, '0')
  const s = String(totalSec % 60).padStart(2, '0')
  return `${m}:${s} min`
}

function SummaryCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col items-center text-center gap-2">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tint}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  )
}

export default function Dashboard({ karyawan, aktivitas, shift, offRequests }) {
  useTick(1000)
  const today = new Date().toISOString().slice(0, 10)

  const sedangIzin = aktivitas.filter((a) => a.status === 'Sedang Izin')
  const offToday = offRequests.filter((o) => o.tanggal === today && o.status !== 'Ditolak')
  const hadir = Math.max(0, karyawan.length - sedangIzin.length - offToday.length)

  const last24h = useMemo(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000
    return aktivitas.filter((a) => a.waktuMulai >= cutoff)
  }, [aktivitas])

  const frekuensi = useMemo(() => {
    const map = {}
    last24h.forEach((a) => {
      map[a.nama] = (map[a.nama] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [last24h])

  const leaderboard = useMemo(() => {
    return karyawan
      .map((k) => {
        const izinList = aktivitas.filter((a) => a.nama === k.nama)
        const totalDurasi = izinList.reduce((sum, a) => sum + (a.durasi || 0), 0)
        const score = Math.max(0, Math.min(100, 100 - izinList.length * 4 - totalDurasi * 0.4))
        return { ...k, score: Math.round(score) }
      })
      .sort((a, b) => b.score - a.score)
  }, [karyawan, aktivitas])

  const recentActivity = [...aktivitas].sort((a, b) => b.waktuMulai - a.waktuMulai).slice(0, 12)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard icon={Users} label="Total Karyawan" value={karyawan.length} tint="bg-slate-700/50 text-slate-200" />
        <SummaryCard icon={UserCheck} label="Hadir Hari Ini" value={hadir} tint="bg-emerald-500/15 text-emerald-400" />
        <SummaryCard icon={Timer} label="Sedang Izin" value={sedangIzin.length} tint="bg-accent-cyan/15 text-accent-cyan" />
        <SummaryCard icon={CalendarOff} label="Off Day" value={offToday.length} tint="bg-amber-500/15 text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activity log */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-accent-cyan" />
            <h2 className="text-sm font-semibold text-white">Activity Log Hari Ini</h2>
          </div>
          <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
            {recentActivity.length === 0 && <p className="text-muted text-sm">Belum ada aktivitas izin.</p>}
            {recentActivity.map((a) => {
              const live = a.status === 'Sedang Izin'
              return (
                <div key={a.id} className="flex items-center justify-between bg-slate-800/40 border border-slate-700/40 rounded-xl px-3.5 py-2.5">
                  <div>
                    <p className="text-sm text-white">{a.nama}</p>
                    <p className="text-xs text-muted">{a.jenisIzin}</p>
                  </div>
                  <div className="text-right">
                    {live ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-cyan/15 text-accent-cyan text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulseRing" />
                        {formatDuration(Date.now() - a.waktuMulai)}
                      </span>
                    ) : (
                      <div>
                        <span className="inline-block px-2.5 py-1 rounded-full bg-slate-600/40 text-slate-300 text-xs font-medium">
                          Selesai
                        </span>
                        <p className="text-[11px] text-muted mt-1">{a.durasi} menit</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Frekuensi */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock3 className="w-4 h-4 text-accent-cyan" />
            <h2 className="text-sm font-semibold text-white">Frekuensi Izin Harian (24 jam)</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs border-b border-slate-700/50">
                <th className="text-left font-normal pb-2">Nama</th>
                <th className="text-right font-normal pb-2">Jumlah Izin</th>
              </tr>
            </thead>
            <tbody>
              {frekuensi.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-muted py-3">Belum ada data.</td>
                </tr>
              )}
              {frekuensi.map(([nama, count]) => (
                <tr key={nama} className="border-b border-slate-800/60">
                  <td className="py-2 text-white">{nama}</td>
                  <td className="py-2 text-right text-accent-cyan font-medium">{count}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Leaderboard */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-accent-cyan" />
            <h2 className="text-sm font-semibold text-white">Leaderboard Kedisiplinan</h2>
          </div>
          <div className="flex flex-col gap-3">
            {leaderboard.map((k, idx) => (
              <div key={k.id} className="flex items-center gap-3">
                <span className="text-xs text-muted w-4">{idx + 1}</span>
                <img src={k.fotoUrl} className="w-8 h-8 rounded-full object-cover" alt={k.nama} />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white">{k.nama}</span>
                    <span className="text-accent-cyan">{k.score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-cyan to-accent-teal rounded-full"
                      style={{ width: `${k.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jadwal Shift */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock3 className="w-4 h-4 text-accent-cyan" />
            <h2 className="text-sm font-semibold text-white">Jadwal Shift</h2>
          </div>
          <div className="flex flex-col gap-2">
            {shift.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-slate-800/40 border border-slate-700/40 rounded-xl px-3.5 py-2.5">
                <div>
                  <p className="text-sm text-white">{s.divisi}</p>
                  <p className="text-xs text-muted">Shift {s.namaShift}</p>
                </div>
                <p className="text-sm text-accent-cyan font-mono">{s.jamMasuk} - {s.jamPulang}</p>
              </div>
            ))}
            {shift.length === 0 && <p className="text-muted text-sm">Belum ada jadwal shift.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
