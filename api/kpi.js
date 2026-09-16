// api/kpi.js
// GET    /api/kpi              -> danh sách tất cả các kỳ cập nhật KPI (công khai, dashboard dùng)
// POST   /api/kpi               -> tạo mới / cập nhật 1 kỳ (yêu cầu đăng nhập admin)
//        body: { updateDate, excelFile, totalScore, groups }
// DELETE /api/kpi?date=YYYY-MM-DD -> xoá 1 kỳ (yêu cầu đăng nhập admin)

const { getDb } = require('../lib/mongodb');
const { requireAdmin } = require('../lib/session');

const COLLECTION = 'kpi_records';

module.exports = async (req, res) => {
  let db;
  try {
    db = await getDb();
  } catch (err) {
    return res.status(500).json({ error: 'Không kết nối được MongoDB: ' + err.message });
  }
  const col = db.collection(COLLECTION);

  if (req.method === 'GET') {
    try {
      const docs = await col
        .find({}, { projection: { _id: 0 } })
        .sort({ updateDate: -1 })
        .toArray();
      return res.status(200).json(docs);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req)) return res.status(401).json({ error: 'Chưa đăng nhập.' });

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body || '{}'); } catch { body = {}; }
    }
    const { updateDate, excelFile, totalScore, groups } = body || {};

    if (!updateDate || !/^\d{4}-\d{2}-\d{2}$/.test(updateDate)) {
      return res.status(400).json({ error: 'updateDate phải theo định dạng YYYY-MM-DD.' });
    }
    if (!Array.isArray(groups) || groups.length === 0) {
      return res.status(400).json({ error: 'Thiếu dữ liệu groups.' });
    }

    try {
      await col.updateOne(
        { updateDate },
        {
          $set: {
            updateDate,
            excelFile: excelFile || null,
            totalScore: typeof totalScore === 'number' ? totalScore : Number(totalScore) || null,
            groups,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req)) return res.status(401).json({ error: 'Chưa đăng nhập.' });
    const date = req.query && req.query.date;
    if (!date) return res.status(400).json({ error: 'Thiếu tham số date.' });
    try {
      await col.deleteOne({ updateDate: date });
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
};
