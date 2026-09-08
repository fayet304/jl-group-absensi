/**
 * JL GROUP - Sistem Absensi & Manajemen Karyawan
 * Backend Google Apps Script (Web App) untuk membaca & menulis data
 * ke Google Sheets, dipakai sebagai REST API sederhana oleh aplikasi React.
 *
 * ==================== CARA PASANG ====================
 * 1. Buka Google Sheets baru, buat 5 sheet (tab) dengan nama & kolom PERSIS berikut
 *    (baris pertama = header):
 *
 *    Sheet "Karyawan"        : id | nama | divisi | fotoUrl | pin
 *    Sheet "AktivitasIzin"   : id | nama | jenisIzin | waktuMulai | waktuSelesai | durasi | status
 *    Sheet "JadwalShift"     : id | divisi | namaShift | jamMasuk | jamPulang
 *    Sheet "PengaturanDurasi": id | kategoriIzin | durasiMenit | limitKuota
 *    Sheet "PengajuanOff"    : id | nama | tanggal | alasan | status
 *
 * 2. Buka menu Extensions > Apps Script pada Google Sheets tersebut.
 * 3. Hapus isi default Code.gs, lalu salin-tempel seluruh isi file ini.
 * 4. Klik Deploy > New deployment.
 *    - Pilih tipe: "Web app".
 *    - Execute as: "Me".
 *    - Who has access: "Anyone" (agar bisa diakses dari GitHub Pages).
 * 5. Salin URL Web App yang dihasilkan (diakhiri "/exec").
 * 6. Tempel URL tersebut ke Admin Panel > Tab Branding di aplikasi React.
 *
 * Catatan: setiap kali mengubah kode ini, buat "New deployment" baru
 * (atau gunakan "Manage deployments" > Edit > versi baru) agar perubahan aktif.
 * ======================================================
 */

function doGet(e) {
  var sheetName = e.parameter.sheet;
  var sheet = getSheet_(sheetName);
  var data = sheetToObjects_(sheet);
  return jsonResponse_({ data: data });
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var sheetName = body.sheet;
  var action = body.action;
  var payload = body.payload;
  var sheet = getSheet_(sheetName);

  if (action === 'create') {
    var row = createRow_(sheet, payload);
    return jsonResponse_({ success: true, data: row });
  }
  if (action === 'update') {
    updateRow_(sheet, payload);
    return jsonResponse_({ success: true, data: payload });
  }
  if (action === 'delete') {
    deleteRow_(sheet, payload.id);
    return jsonResponse_({ success: true });
  }
  return jsonResponse_({ success: false, error: 'Unknown action' });
}

// ---------- Helpers ----------

function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error('Sheet tidak ditemukan: ' + name);
  return sheet;
}

function sheetToObjects_(sheet) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 1) return [];
  var headers = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (row.join('') === '') continue; // skip baris kosong
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    rows.push(obj);
  }
  return rows;
}

function createRow_(sheet, payload) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (!payload.id) {
    payload.id = Utilities.getUuid().slice(0, 8);
  }
  var row = headers.map(function (h) {
    return payload[h] !== undefined ? payload[h] : '';
  });
  sheet.appendRow(row);
  return payload;
}

function updateRow_(sheet, payload) {
  var range = sheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var idCol = headers.indexOf('id');
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][idCol]) === String(payload.id)) {
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j];
        if (payload[key] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(payload[key]);
        }
      }
      break;
    }
  }
}

function deleteRow_(sheet, id) {
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var idCol = headers.indexOf('id');
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][idCol]) === String(id)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
