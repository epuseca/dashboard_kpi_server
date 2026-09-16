// scripts/seed.js
// Chạy 1 lần để: (1) tạo unique index trên updateDate, (2) nạp sẵn dữ liệu kỳ 11/09/2026
// đã có trong data.js / data_1.js gốc, để dashboard có dữ liệu ngay sau khi deploy.
//
// Cách chạy:
//   1) npm install
//   2) Tạo file .env.local (copy từ .env.local.example) và điền MONGODB_URI thật
//   3) node -r dotenv/config scripts/seed.js dotenv_config_path=.env.local

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'dashboard-tt4';

if (!uri) {
  console.error('Thiếu MONGODB_URI. Hãy chạy: node -r dotenv/config scripts/seed.js dotenv_config_path=.env.local');
  process.exit(1);
}

const kpiSeed = {
  updateDate: '2026-09-11',
  excelFile: 'excel/KPI_TrungTam4_2026-09-11.xlsx',
  totalScore: 95.01,
  groups: [
    {
      code: 'I',
      name: 'Viễn cảnh tài chính',
      items: [
        { id: 1, name: 'Lợi nhuận Tổng công ty', valueText: 'Phụ thuộc SXKD TCT', ratio: 100 },
        { id: 2, name: 'Thực hiện chi phí đúng kế hoạch', valueNumber: { actual: 13450, target: 21864, unit: 'tr' } },
        { id: 3, name: 'Doanh thu đơn vị thực hiện', valueNumber: { actual: 5684, target: 14713, unit: 'tr' } },
        { id: 4, name: 'KQ thực hiện doanh thu Quý TCT', valueText: 'Phụ thuộc SXKD TCT' },
      ],
    },
    {
      code: 'III',
      name: 'Viễn cảnh nội bộ',
      items: [
        { id: 5, name: 'Giải ngân Quỹ PT Khoa học và Công nghệ', valueText: 'Không giao chỉ tiêu' },
        { id: 6, name: 'Số nhiệm vụ KHCN cấp Bộ được nghiệm thu', valueText: 'Hoàn thành' },
        { id: 7, name: 'Tiến độ Thanh toán dự án', valueText: 'Không giao chỉ tiêu' },
        { id: 8, name: 'Số lượng quy trình được đưa lên workflow', valueText: 'Hoàn thành' },
        { id: 9, name: 'Tiến độ sản xuất thiết bị', valueText: 'Không đánh giá (TCT chưa phê duyệt KH đầu tư chuyển tiếp - CV 448/TT4-SXCN, 30/4/2026)' },
      ],
    },
    {
      code: 'IV',
      name: 'Viễn cảnh học hỏi phát triển',
      items: [
        { id: 10, name: 'LĐ chất lượng cao lĩnh vực tăng trưởng mới', valueText: 'Hoàn thành' },
        { id: 11, name: 'LĐ tinh gọn theo đề án tái cơ cấu', valueText: 'Hoàn thành' },
      ],
    },
  ],
};

const spcnclSeed = {
  updateDate: '2026-09-11',
  excelFile: 'excel/SPCNCL_TrungTam4_2026-09-11.xlsx',
  items: [
    { id: 1, name: 'SPCNCL01', pctMonth: 40, statusMonth: 'on_track', pctApproved: 30, statusApproved: 'on_track', issue: '—' },
    { id: 2, name: 'SPCNCL02', pctMonth: 50, statusMonth: 'on_track', pctApproved: 45, statusApproved: 'on_track',
      issue: 'Thiếu nguồn nhân lực có chuyên môn trong lĩnh vực radar/trinh sát điện tử/siêu cao tần, đặc biệt là kiến trúc sư trưởng dự án.\nQuỹ Phát triển KH&CN năm 2026 (đợt 2) chưa được phê duyệt ảnh hưởng đến mua sắm mô đun vật tư linh kiện chế áp radar.' },
    { id: 3, name: 'SPCNCL03', pctMonth: 50, statusMonth: 'on_track', pctApproved: 20, statusApproved: 'on_track', issue: '—' },
    { id: 4, name: 'Bộ đàm số', pctMonth: 50, statusMonth: 'on_track', pctApproved: 70, statusApproved: 'on_track', issue: '—' },
    { id: 5, name: 'Smart Pole', pctMonth: 50, statusMonth: 'on_track', pctApproved: 70, statusApproved: 'on_track', issue: '—' },
    { id: 6, name: 'AI Box', pctMonth: 50, statusMonth: 'on_track', pctApproved: 80, statusApproved: 'on_track', issue: '—' },
    { id: 7, name: 'Nghiên cứu làm chủ công nghệ PTM 5G/6G', pctMonth: 50, statusMonth: 'on_track', pctApproved: 20, statusApproved: 'on_track', issue: '—' },
    { id: 8, name: 'Tìm kiếm, tiếp nhận, chuyển giao công nghệ máy chủ, máy chủ lớn', pctMonth: 50, statusMonth: 'on_track', pctApproved: 40, statusApproved: 'on_track', issue: '—' },
  ],
};

async function main(){
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const kpiCol = db.collection('kpi_records');
  const spcnclCol = db.collection('spcncl_records');

  await kpiCol.createIndex({ updateDate: 1 }, { unique: true });
  await spcnclCol.createIndex({ updateDate: 1 }, { unique: true });
  console.log('Đã tạo unique index trên updateDate cho cả 2 collection.');

  await kpiCol.updateOne(
    { updateDate: kpiSeed.updateDate },
    { $set: { ...kpiSeed, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  console.log('Đã seed dữ liệu KPI kỳ', kpiSeed.updateDate);

  await spcnclCol.updateOne(
    { updateDate: spcnclSeed.updateDate },
    { $set: { ...spcnclSeed, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  console.log('Đã seed dữ liệu SPCNCL kỳ', spcnclSeed.updateDate);

  await client.close();
  console.log('Hoàn tất.');
}

main().catch(err => { console.error(err); process.exit(1); });
