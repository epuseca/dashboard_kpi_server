/**
 * SEED-DATA / KPI-DATA.JS — Dữ liệu KPI Trung tâm 4 (dùng để import lần đầu vào MongoDB)
 * -----------------------------------------------------------
 * File này giữ đúng cấu trúc data.js gốc bạn đang dùng — chỉ khác là export ra
 * bằng module.exports để scripts/seed.js có thể require() và import thẳng vào
 * MongoDB, không cần gõ tay lại số liệu.
 *
 * Muốn import thêm 1 kỳ mới (thay vì dùng trang /admin): copy nguyên 1 object
 * trong mảng bên dưới, sửa "updateDate" + số liệu trong "groups", rồi chạy lại:
 *   node -r dotenv/config scripts/seed.js dotenv_config_path=.env.local
 * (chạy lại không tạo trùng — kỳ đã có sẽ được ghi đè bằng dữ liệu mới nhất ở đây)
 * -----------------------------------------------------------
 */

module.exports = [

  // ================== Cập nhật ngày 11/09/2026 ==================
  {
    updateDate: "2026-09-11",
    excelFile: "excel/KPI_TrungTam4_2026-09-11.xlsx",
    totalScore: 95.01,
    groups: [
      {
        code: "I",
        name: "Viễn cảnh tài chính",
        items: [
          { id: 1, name: "Lợi nhuận Tổng công ty", valueText: "Phụ thuộc SXKD TCT", ratio: 100 },
          { id: 2, name: "Thực hiện chi phí đúng kế hoạch", valueNumber: { actual: 13450, target: 21864, unit: "tr" } },
          { id: 3, name: "Doanh thu đơn vị thực hiện", valueNumber: { actual: 5684, target: 14713, unit: "tr" } },
          { id: 4, name: "KQ thực hiện doanh thu Quý TCT", valueText: "Phụ thuộc SXKD TCT" }
        ]
      },
      {
        code: "III",
        name: "Viễn cảnh nội bộ",
        items: [
          { id: 5, name: "Giải ngân Quỹ PT Khoa học và Công nghệ", valueText: "Không giao chỉ tiêu" },
          { id: 6, name: "Số nhiệm vụ KHCN cấp Bộ được nghiệm thu", valueText: "Hoàn thành" },
          { id: 7, name: "Tiến độ Thanh toán dự án", valueText: "Không giao chỉ tiêu" },
          { id: 8, name: "Số lượng quy trình được đưa lên workflow", valueText: "Hoàn thành" },
          { id: 9, name: "Tiến độ sản xuất thiết bị", valueText: "Không đánh giá (TCT chưa phê duyệt KH đầu tư chuyển tiếp - CV 448/TT4-SXCN, 30/4/2026)" }
        ]
      },
      {
        code: "IV",
        name: "Viễn cảnh học hỏi phát triển",
        items: [
          { id: 10, name: "LĐ chất lượng cao lĩnh vực tăng trưởng mới", valueText: "Hoàn thành" },
          { id: 11, name: "LĐ tinh gọn theo đề án tái cơ cấu", valueText: "Hoàn thành" }
        ]
      }
    ]
  }

  // Thêm kỳ mới ở đây (dạng object, cách nhau bằng dấu phẩy) rồi chạy lại script seed
  // để import, hoặc dùng trang /admin/ — cả 2 cách đều ghi vào cùng 1 nơi (MongoDB).

];
