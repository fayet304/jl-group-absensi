import React, { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { createRow, updateRow, deleteRow } from '../../services/api.js'

const emptyForm = { divisi: '', namaShift: '', jamMasuk: '', jamPulang: '' }

export default function AdminShift({ shift, onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [busy, setBusy] = useState(false)

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (s) => {
    setEditing(s)
    setForm({ divisi: s.divisi, namaShift: s.namaShift, jamMasuk: s.jamMasuk, jamPulang: s.jamPulang })
    setModalOpen(true)
  }

  const submit = async () => {
    if (!form.divisi.trim() || !form.namaShift.trim() || busy) return
    setBusy(true)
    if (editing) {
      await updateRow('JadwalShift', { id: editing.id, ...form })
    } else {
      await createRow('JadwalShift', form)
    }
    await onRefresh()
    setBusy(false)
    setModalOpen(false)
  }

  const remove = async (s) => {
    if (!confirm(`Hapus jadwal shift "${s.namaShift}" (${s.divisi})?`)) return
    await deleteRow('JadwalShift', { id: s.id })
    await onRefresh()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg btn-glow text-slate-950 font-medium text-sm hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4" /> Tambah Shift
        </button>
      </div>

      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-muted text-xs border-b border-slate-700/50">
              <th className="text-left font-normal px-4 py-3">Divisi</th>
              <th className="text-left font-normal px-4 py-3">Nama Shift</th>
              <th className="text-left font-normal px-4 py-3">Jam Masuk</th>
              <th className="text-left font-normal px-4 py-3">Jam Pulang</th>
              <th className="text-right font-normal px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {shift.map((s) => (
              <tr key={s.id} className="border-b border-slate-800/60">
                <td className="px-4 py-2.5 text-white">{s.divisi}</td>
                <td className="px-4 py-2.5 text-muted">{s.namaShift}</td>
                <td className="px-4 py-2.5 text-accent-cyan font-mono">{s.jamMasuk}</td>
                <td className="px-4 py-2.5 text-accent-cyan font-mono">{s.jamPulang}</td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg glass hover:border-accent-cyan/50 text-accent-cyan">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(s)} className="p-1.5 rounded-lg glass hover:border-red-500/50 text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {shift.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-6">Belum ada jadwal shift.</td>
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
            <h3 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Shift' : 'Tambah Shift'}</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-muted mb-1 block">Divisi</label>
                <input
                  value={form.divisi}
                  onChange={(e) => setForm({ ...form, divisi: e.target.value })}
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-lg py-2 px-3 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Nama Shift</label>
                <input
                  value={form.namaShift}
                  onChange={(e) => setForm({ ...form, namaShift: e.target.value })}
                  placeholder="PAGI / SIANG / MALAM"
                  className="w-full bg-slate-800/60 border border-slate-600 rounded-lg py-2 px-3 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted mb-1 block">Jam Masuk</label>
                  <input
                    type="time"
                    value={form.jamMasuk}
                    onChange={(e) => setForm({ ...form, jamMasuk: e.target.value })}
                    className="w-full bg-slate-800/60 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1 block">Jam Pulang</label>
                  <input
                    type="time"
                    value={form.jamPulang}
                    onChange={(e) => setForm({ ...form, jamPulang: e.target.value })}
                    className="w-full bg-slate-800/60 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  />
                </div>
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
