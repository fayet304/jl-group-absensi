// =============================================================
// Service layer: Google Sheets (via Google Apps Script Web App)
// =============================================================
// Cara kerja:
// 1. Endpoint Apps Script disimpan di localStorage key "jlgroup_endpoint"
//    (diisi lewat Admin Panel > Tab Branding).
// 2. Jika endpoint KOSONG atau fetch GAGAL, semua fungsi di bawah
//    otomatis jatuh ke "mock mode": data disimpan di localStorage
//    browser (seed awal dari src/data/mockData.js), sehingga aplikasi
//    tetap berfungsi penuh tanpa backend saat pertama kali dibuka.
//
// Kontrak endpoint Apps Script yang diharapkan (lihat google-apps-script/Code.gs):
//   GET  {endpoint}?sheet=Karyawan                -> { data: [...] }
//   POST {endpoint}  body: { sheet, action, payload }
//        action = "create" | "update" | "delete"

import {
  mockKaryawan,
  mockAktivitasIzin,
  mockJadwalShift,
  mockPengaturanDurasi,
  mockPengajuanOff,
} from '../data/mockData.js'

const ENDPOINT_KEY = 'jlgroup_endpoint'
const STORAGE_PREFIX = 'jlgroup_sheet_'

const SEED = {
  Karyawan: mockKaryawan,
  AktivitasIzin: mockAktivitasIzin,
  JadwalShift: mockJadwalShift,
  PengaturanDurasi: mockPengaturanDurasi,
  PengajuanOff: mockPengajuanOff,
}

export function getEndpoint() {
  return localStorage.getItem(ENDPOINT_KEY) || ''
}

export function setEndpoint(url) {
  localStorage.setItem(ENDPOINT_KEY, url.trim())
}

function seedIfEmpty(sheet) {
  const key = STORAGE_PREFIX + sheet
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(SEED[sheet] || []))
  }
}

function readLocal(sheet) {
  seedIfEmpty(sheet)
  try {
    return JSON.parse(localStorage.getItem(STORAGE_PREFIX + sheet)) || []
  } catch {
    return []
  }
}

function writeLocal(sheet, rows) {
  localStorage.setItem(STORAGE_PREFIX + sheet, JSON.stringify(rows))
}

function genId(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`
}

const PREFIX_MAP = {
  Karyawan: 'K',
  AktivitasIzin: 'A',
  JadwalShift: 'S',
  PengajuanOff: 'O',
}

// ---------- READ ----------
export async function fetchSheet(sheet) {
  const endpoint = getEndpoint()
  if (!endpoint) {
    return readLocal(sheet)
  }
  try {
    const res = await fetch(`${endpoint}?sheet=${encodeURIComponent(sheet)}`)
    if (!res.ok) throw new Error('Network response was not ok')
    const json = await res.json()
    return json.data || []
  } catch (err) {
    console.warn(`[jlgroup] Gagal fetch sheet "${sheet}" dari Google Sheets, memakai data lokal (mock).`, err)
    return readLocal(sheet)
  }
}

// ---------- WRITE (create / update / delete) ----------
async function mutate(sheet, action, payload) {
  const endpoint = getEndpoint()
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ sheet, action, payload }),
      })
      if (!res.ok) throw new Error('Network response was not ok')
      return await res.json()
    } catch (err) {
      console.warn(`[jlgroup] Gagal POST ke Google Sheets (${sheet}/${action}), fallback ke penyimpanan lokal.`, err)
    }
  }

  // Fallback: simulasikan operasi di localStorage
  let rows = readLocal(sheet)
  if (action === 'create') {
    const id = payload.id || genId(PREFIX_MAP[sheet] || 'X')
    const row = { ...payload, id }
    rows = [...rows, row]
    writeLocal(sheet, rows)
    return { success: true, data: row }
  }
  if (action === 'update') {
    rows = rows.map((r) => (r.id === payload.id ? { ...r, ...payload } : r))
    writeLocal(sheet, rows)
    return { success: true, data: payload }
  }
  if (action === 'delete') {
    rows = rows.filter((r) => r.id !== payload.id)
    writeLocal(sheet, rows)
    return { success: true }
  }
  return { success: false }
}

export const createRow = (sheet, payload) => mutate(sheet, 'create', payload)
export const updateRow = (sheet, payload) => mutate(sheet, 'update', payload)
export const deleteRow = (sheet, payload) => mutate(sheet, 'delete', payload)

export function isUsingMockMode() {
  return !getEndpoint()
}
