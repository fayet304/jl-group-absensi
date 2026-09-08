import React, { useState } from 'react'
import { Check, Link2, Building2 } from 'lucide-react'
import { getEndpoint, setEndpoint, isUsingMockMode } from '../../services/api.js'

export default function AdminBranding({ onRefresh }) {
  const [url, setUrl] = useState(getEndpoint())
  const [appName, setAppName] = useState(localStorage.getItem('jlgroup_appname') || 'JL GROUP')
  const [saved, setSaved] = useState(false)

  const simpan = async () => {
    setEndpoint(url)
    localStorage.setItem('jlgroup_appname', appName)
    await onRefresh()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-accent-cyan" />
          <h3 className="text-sm font-semibold text-white">Identitas Aplikasi</h3>
        </div>
        <label className="text-xs text-muted mb-1 block">Nama Perusahaan / Aplikasi</label>
        <input
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          className="w-full bg-slate-800/60 border border-slate-600 rounded-lg py-2 px-3 text-white"
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Link2 className="w-4 h-4 text-accent-cyan" />
          <h3 className="text-sm font-semibold text-white">Koneksi Google Sheets (Apps Script)</h3>
        </div>
        <p className="text-xs text-muted mb-3">
          Tempel URL Web App dari deployment Google Apps Script di sini. Kosongkan untuk memakai mode
          data simulasi (mock) lokal di browser.
        </p>
        <div
          className={`text-xs mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
            isUsingMockMode() ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
          }`}
        >
          {isUsingMockMode() ? 'Mode Simulasi (Mock Data)' : 'Terhubung ke Google Sheets'}
        </div>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://script.google.com/macros/s/AKfycbz6r5dZlmjPFANDwhDyw_CdCuKCZwC-ggs7VfbpWjtfmGIokwYpUpXV11DALknERxSd0w/exec"
          className="w-full bg-slate-800/60 border border-slate-600 rounded-lg py-2 px-3 text-white font-mono text-sm"
        />
      </div>

      <button
        onClick={simpan}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg btn-glow text-slate-950 font-medium text-sm hover:brightness-110 transition w-fit"
      >
        {saved && <Check className="w-4 h-4" />}
        {saved ? 'Tersimpan' : 'Simpan Pengaturan'}
      </button>
    </div>
  )
}
