import React, { useState } from 'react'
import { Users, Clock3, Timer, Palette } from 'lucide-react'
import AdminKaryawan from './admin/AdminKaryawan.jsx'
import AdminShift from './admin/AdminShift.jsx'
import AdminDurasi from './admin/AdminDurasi.jsx'
import AdminBranding from './admin/AdminBranding.jsx'

const SUB_TABS = [
  { id: 'karyawan', label: 'Karyawan', icon: Users },
  { id: 'shift', label: 'Jadwal Shift', icon: Clock3 },
  { id: 'durasi', label: 'Durasi Izin', icon: Timer },
  { id: 'branding', label: 'Branding', icon: Palette },
]

export default function AdminPanel({ karyawan, shift, durasi, onRefresh }) {
  const [sub, setSub] = useState('karyawan')

  return (
    <div className="flex flex-col gap-5">
      <div className="glass rounded-full p-1 flex gap-1 w-fit overflow-x-auto">
        {SUB_TABS.map((t) => {
          const Icon = t.icon
          const active = sub === t.id
          return (
            <button
              key={t.id}
              onClick={() => setSub(t.id)}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition ${
                active ? 'btn-glow text-slate-950 font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {sub === 'karyawan' && <AdminKaryawan karyawan={karyawan} onRefresh={onRefresh} />}
      {sub === 'shift' && <AdminShift shift={shift} onRefresh={onRefresh} />}
      {sub === 'durasi' && <AdminDurasi durasi={durasi} onRefresh={onRefresh} />}
      {sub === 'branding' && <AdminBranding onRefresh={onRefresh} />}
    </div>
  )
}
