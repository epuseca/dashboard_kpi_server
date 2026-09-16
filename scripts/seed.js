// scripts/seed.js
// Import dữ liệu ban đầu vào MongoDB, lấy thẳng từ seed-data/kpi-data.js và
// seed-data/spcncl-data.js (2 file này giữ nguyên nội dung/cấu trúc data.js gốc
// bạn đang dùng — chỉ đổi "const ... = [...]" thành "module.exports = [...]").
//
// Chạy 1 lần sau khi deploy lần đầu, hoặc chạy lại bất cứ khi nào bạn sửa
// 2 file trong seed-data/ và muốn đẩy lại lên MongoDB:
//
//   1) npm install
//   2) Tạo file .env.local (copy từ .env.local.example) và điền MONGODB_URI thật
//   3) node -r dotenv/config scripts/seed.js dotenv_config_path=.env.local
//
// Script tự tạo unique index trên "updateDate" và upsert từng kỳ (không tạo trùng —
// kỳ đã tồn tại sẽ được cập nhật đè bằng dữ liệu mới nhất trong seed-data/).

const { MongoClient } = require('mongodb');
const kpiRecords = require('../seed-data/kpi-data.js');
const spcnclRecords = require('../seed-data/spcncl-data.js');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'dashboard-tt4';

if (!uri) {
  console.error('Thiếu MONGODB_URI. Hãy chạy: node -r dotenv/config scripts/seed.js dotenv_config_path=.env.local');
  process.exit(1);
}

async function upsertAll(col, records, label){
  for (const rec of records) {
    if (!rec.updateDate) {
      console.warn(`  ⚠ Bỏ qua 1 bản ghi ${label} thiếu updateDate.`);
      continue;
    }
    await col.updateOne(
      { updateDate: rec.updateDate },
      { $set: { ...rec, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log(`  ✓ Đã import ${label} kỳ ${rec.updateDate}`);
  }
}

async function main(){
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const kpiCol = db.collection('kpi_records');
  const spcnclCol = db.collection('spcncl_records');

  await kpiCol.createIndex({ updateDate: 1 }, { unique: true });
  await spcnclCol.createIndex({ updateDate: 1 }, { unique: true });
  console.log('Đã tạo unique index trên updateDate cho cả 2 collection.\n');

  console.log(`Import ${kpiRecords.length} kỳ KPI từ seed-data/kpi-data.js...`);
  await upsertAll(kpiCol, kpiRecords, 'KPI');

  console.log(`\nImport ${spcnclRecords.length} kỳ SPCNCL từ seed-data/spcncl-data.js...`);
  await upsertAll(spcnclCol, spcnclRecords, 'SPCNCL');

  await client.close();
  console.log('\nHoàn tất.');
}

main().catch(err => { console.error(err); process.exit(1); });
