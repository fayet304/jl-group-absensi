import React, { useEffect, useRef, useState } from 'react'
import { Building2, X, Loader2 } from 'lucide-react'

export default function Login({ karyawan, loading, onLogin }) {
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (selected && inputRef.current) inputRef.current.focus()
  }, [selected])

  const openModal = (person) => {
    setSelected(person)
    setPin('')
    setError('')
  }

  const closeModal = () => {
    setSelected(null)
    setPin('')
    setError('')
  }

  const submit = () => {
    if (pin.length !== 4) {
      setError('Masukkan 4 digit PIN')
      return
    }
    if (String(selected.pin) === pin) {
      onLogin(selected)
    } else {
      setError('PIN salah, coba lagi')
      setPin('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 sm:py-16">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center mb-4 shadow-glow">
          <Building2 className="w-8 h-8 text-accent-cyan" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">JL GROUP</h1>
        <p className="text-muted mt-2 text-sm sm:text-base">
          Sistem Manajemen Karyawan &ndash; pilih nama Anda untuk masuk
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted">
          <Loader2 className="w-5 h-5 animate-spin" />
          Memuat data karyawan...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 w-full max-w-4xl">
          {karyawan.map((k) => (
            <button
              key={k.id}
              onClick={() => openModal(k)}
              className="glass rounded-2xl p-4 flex flex-col items-center gap-3 hover:border-accent-cyan/60 hover:shadow-glow transition-all duration-200"
            >
              <img
                src={k.fotoUrl}
                alt={k.nama}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-700"
              />
              <div className="text-center">
                <p className="text-sm font-medium text-white leading-tight">{k.nama}</p>
                <p className="text-xs text-muted mt-0.5">{k.divisi}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-sm relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <img
                src={selected.fotoUrl}
                alt={selected.nama}
                className="w-20 h-20 rounded-full object-cover border-2 border-accent-cyan/60 mb-3"
              />
              <p className="text-lg font-semibold text-white">{selected.nama}</p>
              <p className="text-sm text-muted mb-5">Masukkan PIN untuk melanjutkan</p>

              <div className="flex gap-3 mb-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border ${
                      pin.length > i ? 'bg-accent-cyan border-accent-cyan' : 'border-slate-600'
                    }`}
                  />
                ))}
              </div>

              <input
                ref={inputRef}
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                  setPin(v)
                  setError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                className="w-40 text-center bg-slate-800/60 border border-slate-600 rounded-lg py-2 text-white tracking-[0.6em] mb-1"
                autoFocus
              />
              {error && <p className="text-red-400 text-xs mt-1 mb-2">{error}</p>}

              <div className="flex gap-3 w-full mt-5">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-200 hover:bg-slate-700/70 transition"
                >
                  Batal
                </button>
                <button
                  onClick={submit}
                  className="flex-1 py-2.5 rounded-lg btn-glow text-slate-950 font-medium hover:brightness-110 transition"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
