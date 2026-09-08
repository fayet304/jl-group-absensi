import React, { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { createRow, updateRow, deleteRow } from '../../services/api.js'

const emptyForm = { nama: '', divisi: '', fotoUrl: '', pin: '' }

export default function AdminKaryawan({ karyawan, onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [busy, setBusy] = useState(false)

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (k) => {
    setEditing(k)
    setForm({ nama: k.nama, divisi: k.divisi, fotoUrl: k.fotoUrl, pin: k.pin })
    setModalOpen(true)
  }

  const submit = async () => {
    if (!form.nama.trim() || !form.divisi.trim() || busy) return
    setBusy(true)
    if (editing) {
      await updateRow('Karyawan', { id: editing.id, ...form })
    } else {
      await createRow('Karyawan', { ...form, pin: form.pin || '1234' })
    }
    await onRefresh()
    setBusy(false)
    setModalOpen(false)
  }

  const remove = async (k) => {
    if (!confirm(`Hapus karyawan "${k.nama}"?`)) return
    await deleteRow('Karyawan', { id: k.id })
    await onRefresh()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg btn-glow text-slate-950 font-medium text-sm hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4" /> Tambah Karyawan
        </button>
      </div>

      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-muted text-xs border-b border-slate-700/50">
              <th className="text-left font-normal px-4 py-3">No</th>
              <th className="text-left font-normal px-4 py-3">Foto</th>
              <th className="text-left font-normal px-4 py-3">Nama</th>
              <th className="text-left font-normal px-4 py-3">Divisi</th>
              <th className="text-right font-normal px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {karyawan.map((k, idx) => (
              <tr key={k.id} className="border-b border-slate-800/60">
                <td className="px-4 py-2.5 text-muted">{idx + 1}</td>
                <td className="px-4 py-2.5">
                  <img src={k.fotoUrl} alt={k.nama} className="w-9 h-9 rounded-full object-cover" />
                </td>
                <td className="px-4 py-2.5 text-white">{k.nama}</td>
                <td className="px-4 py-2.5 text-muted">{k.divisi}</td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(k)} className="p-1.5 rounded-lg glass hover:border-accent-cyan/50 text-accent-cyan">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(k)} className="p-1.5 rounded-lg glass hover:border-red-500/50 text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {karyawan.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-6">Belum ada karyawan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-sm relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Karyawan' : 'Tambah Karyawan'}</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-muted mb-1 block">Nama</label>
                <input
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-lg py-2 px-3 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Divisi</label>
                <input
                  value={form.divisi}
                  onChange={(e) => setForm({ ...form, divisi: e.target.value })}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-lg py-2 px-3 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">URL Foto Profil</label>
                <input
                  value={form.fotoUrl}
                  onChange={(e) => setForm({ ...form, fotoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-lg py-2 px-3 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">PIN (4 digit)</label>
                <input
                  value={form.pin}
                  maxLength={4}
                  onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  placeholder="1234"
                />
              </div>
              <button
                onClick={submit}
                disabled={busy}
                className="mt-2 py-2.5 rounded-lg btn-glow text-slate-950 font-medium hover:brightness-110 transition disabled:opacity-50"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
