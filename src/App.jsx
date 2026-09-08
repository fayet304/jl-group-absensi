import React, { useEffect, useState, useCallback } from 'react'
import Login from './components/Login.jsx'
import Shell from './components/Shell.jsx'
import Dashboard from './components/Dashboard.jsx'
import IzinSementara from './components/IzinSementara.jsx'
import OffMatrix from './components/OffMatrix.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import { fetchSheet } from './services/api.js'

const POLL_MS = 5000

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('active_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const [tab, setTab] = useState('dashboard')

  const [karyawan, setKaryawan] = useState([])
  const [aktivitas, setAktivitas] = useState([])
  const [shift, setShift] = useState([])
  const [durasi, setDurasi] = useState([])
  const [offRequests, setOffRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const reloadAll = useCallback(async () => {
    const [k, a, s, d, o] = await Promise.all([
      fetchSheet('Karyawan'),
      fetchSheet('AktivitasIzin'),
      fetchSheet('JadwalShift'),
      fetchSheet('PengaturanDurasi'),
      fetchSheet('PengajuanOff'),
    ])
    setKaryawan(k)
    setAktivitas(a)
    setShift(s)
    setDurasi(d)
    setOffRequests(o)
    setLoading(false)
  }, [])

  useEffect(() => {
    reloadAll()
    const interval = setInterval(reloadAll, POLL_MS)
    return () => clearInterval(interval)
  }, [reloadAll])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('active_user', JSON.stringify(userData))
    setTab('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('active_user')
  }

  // Menyesuaikan path gambar otomatis untuk Vite & GitHub Pages
  const bgPath = `${import.meta.env.BASE_URL}bg.jpg`

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{ backgroundImage: `url('${bgPath}')` }}
    >
      <div className="min-h-screen bg-slate-950/80 backdrop-blur-xs">
        {!user ? (
          <Login
            karyawan={karyawan}
            loading={loading}
            onLogin={handleLogin}
          />
        ) : (
          <Shell user={user} tab={tab} setTab={setTab} onLogout={handleLogout}>
            {tab === 'dashboard' && (
              <Dashboard karyawan={karyawan} aktivitas={aktivitas} shift={shift} offRequests={offRequests} />
            )}
            {tab === 'izin' && (
              <IzinSementara
                user={user}
                durasi={durasi}
                aktivitas={aktivitas}
                onRefresh={reloadAll}
              />
            )}
            {tab === 'off' && (
              <OffMatrix user={user} karyawan={karyawan} offRequests={offRequests} onRefresh={reloadAll} />
            )}
            {tab === 'admin' && (
              <AdminPanel
                karyawan={karyawan}
                shift={shift}
                durasi={durasi}
                onRefresh={reloadAll}
              />
            )}
          </Shell>
        )}
      </div>
    </div>
  )
}