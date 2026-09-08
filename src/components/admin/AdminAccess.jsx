import React, { useState, useEffect } from 'react'
import { ShieldCheck, UserCheck } from 'lucide-react'
import { fetchSheet } from '../../services/api.js'

export default function AdminAccess() {
  const [karyawan, setKaryawan] = useState([])

  useEffect(() => {
    fetchSheet('Karyawan').then(setKaryawan)
  }, [])

  // Menampilkan karyawan yang memiliki flag isAdmin atau role Admin
  const adminList = karyawan.filter(k => k.isAdmin || k.role === 'Admin' || k.divisi === 'Management')

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-accent-cyan" /> Daftar Akses Admin
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {adminList.map((item) => (
          <div key={item.id} className="glass p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">
              {item.nama?.[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{item.nama}</p>
              <p className="text-xs text-muted">Divisi: {item.divisi} | PIN: {item.pin}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}