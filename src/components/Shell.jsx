import React, { useEffect, useState } from 'react'
import { LayoutDashboard, Timer, CalendarDays, Settings, LogOut, Building2 } from 'lucide-react'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'izin', label: 'Izin Sementara', icon: Timer },
  { id: 'off', label: 'Off & Libur', icon: CalendarDays },
  { id: 'admin', label: 'Admin', icon: Settings },
]

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

export default function Shell({ user, tab, setTab, onLogout, children }) {
  const now = useClock()
  const time = now.toLocaleTimeString('id-ID', { hour12: false })
  const date = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen pb-16">
      {/* Topbar */}
      <div className="glass-strong sticky top-0 z-40 border-b border-slate-700/50">
        <div className="overflow-hidden bg-slate-950/60 border-b border-slate-800/60 py-1.5">
          <p className="whitespace-nowrap text-amber-400 text-xs sm:text-sm font-medium animate-marquee">
            📢 Selamat datang di sistem manajemen karyawan JL GROUP. Jaga kedisiplinan waktu izin agar operasional tetap lancar.
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent-cyan" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">JL GROUP</p>
              <p className="text-muted text-[11px] leading-tight">{date}</p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center">
            <span className="text-2xl font-mono font-semibold text-accent-cyan tabular-nums tracking-wider">{time}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-right">
              <div>
                <p className="text-sm text-white leading-tight">{user.nama}</p>
                <p className="text-xs text-muted leading-tight">{user.divisi}</p>
              </div>
              <img src={user.fotoUrl} alt={user.nama} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg glass hover:border-red-500/50 hover:text-red-400 transition text-muted"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pill Nav */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3">
          <div className="glass rounded-full p-1 flex gap-1 w-fit overflow-x-auto">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
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
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">{children}</div>
    </div>
  )
}
