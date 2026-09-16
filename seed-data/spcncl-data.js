/**
 * SEED-DATA / SPCNCL-DATA.JS — Tiến độ SPCNCL, SP Bộ giao Trung tâm 4
 * (dùng để import lần đầu vào MongoDB)
 * -----------------------------------------------------------
 * Lưu ý: "excelFile" ở đây dùng tiền tố "../excel/..." (khác với KPI dùng "excel/...")
 * vì trang spcncl_dashboard/index.html nằm trong thư mục con, còn thư mục "excel/"
 * dùng chung lại nằm ở gốc dự án — nút "Tải dữ liệu (.xlsx)" gắn thẳng excelFile
 * làm href nên phải đúng đường dẫn tương đối này thì mới tải đúng file.
 *
 * Muốn import thêm 1 kỳ mới: copy nguyên 1 object trong mảng bên dưới, sửa
 * "updateDate" + số liệu trong "items", rồi chạy lại:
 *   node -r dotenv/config scripts/seed.js dotenv_config_path=.env.local
 * -----------------------------------------------------------
 */

module.exports = [

  // ================== Cập nhật ngày 11/09/2026 ==================
  {
    updateDate: "2026-09-11",
    excelFile: "../excel/SPCNCL_TrungTam4_2026-09-11.xlsx",
    items: [
      {
        id: 1,
        name: "SPCNCL01",
        pctMonth: 40, statusMonth: "on_track",
        pctApproved: 30, statusApproved: "on_track",
        issue: "—"
      },
      {
        id: 2,
        name: "SPCNCL02",
        pctMonth: 50, statusMonth: "on_track",
        pctApproved: 45, statusApproved: "on_track",
        issue: "Thiếu nguồn nhân lực có chuyên môn trong lĩnh vực radar/trinh sát điện tử/siêu cao tần, đặc biệt là kiến trúc sư trưởng dự án.\nQuỹ Phát triển KH&CN năm 2026 (đợt 2) chưa được phê duyệt ảnh hưởng đến mua sắm mô đun vật tư linh kiện chế áp radar."
      },
      {
        id: 3,
        name: "SPCNCL03",
        pctMonth: 50, statusMonth: "on_track",
        pctApproved: 20, statusApproved: "on_track",
        issue: "—"
      },
      {
        id: 4,
        name: "Bộ đàm số",
        pctMonth: 50, statusMonth: "on_track",
        pctApproved: 70, statusApproved: "on_track",
        issue: "—"
      },
      {
        id: 5,
        name: "Smart Pole",
        pctMonth: 50, statusMonth: "on_track",
        pctApproved: 70, statusApproved: "on_track",
        issue: "—"
      },
      {
        id: 6,
        name: "AI Box",
        pctMonth: 50, statusMonth: "on_track",
        pctApproved: 80, statusApproved: "on_track",
        issue: "—"
      },
      {
        id: 7,
        name: "Nghiên cứu làm chủ công nghệ PTM 5G/6G",
        pctMonth: 50, statusMonth: "on_track",
        pctApproved: 20, statusApproved: "on_track",
        issue: "—"
      },
      {
        id: 8,
        name: "Tìm kiếm, tiếp nhận, chuyển giao công nghệ máy chủ, máy chủ lớn",
        pctMonth: 50, statusMonth: "on_track",
        pctApproved: 40, statusApproved: "on_track",
        issue: "—"
      }
    ]
  }

  // Thêm kỳ mới ở đây (dạng object, cách nhau bằng dấu phẩy) rồi chạy lại script seed
  // để import, hoặc dùng trang /admin/ — cả 2 cách đều ghi vào cùng 1 nơi (MongoDB).

];
