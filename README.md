# Dashboard Trung tâm 4 — KPI & SPCNCL (MongoDB + Vercel)

Ứng dụng gồm:
- `index.html` — Dashboard KPI (demo 1)
- `spcncl_dashboard/index.html` — Dashboard tiến độ SPCNCL, SP Bộ giao (demo 2)
- `admin/index.html` — Trang quản trị: đăng nhập bằng mật khẩu, thêm/sửa/xóa từng kỳ cập nhật cho cả 2 dashboard
- `api/*.js` — Serverless functions (Node) chạy trên Vercel, đọc/ghi dữ liệu trong MongoDB
- `excel/` — nơi bạn tự đặt các file `.xlsx` gốc (nếu muốn nút "Tải dữ liệu (.xlsx)" tải thẳng file có sẵn thay vì tự sinh)

Dữ liệu không còn nằm trong `data.js` nữa — mọi thứ đọc/ghi từ MongoDB qua các API `/api/kpi` và `/api/spcncl`.

---

## ⚠️ Bảo mật — làm ngay trước khi dùng thật

Chuỗi kết nối MongoDB bạn gửi trong chat (`mongodb+srv://root:...`) chứa **mật khẩu database dạng plaintext**. Vì đã dán vào đây, bạn nên:

1. Vào **MongoDB Atlas → Database Access** → sửa user `root` → **Đổi mật khẩu mới**.
2. Cập nhật lại `MONGODB_URI` với mật khẩu mới ở mọi nơi (Vercel, `.env.local`).
3. Vào **Atlas → Network Access** → **Add IP Address** → chọn **Allow Access from Anywhere (0.0.0.0/0)** — vì Vercel serverless function chạy trên IP động, không thể whitelist IP cố định.
4. Đặt `ADMIN_PASSWORD` (mật khẩu vào trang `/admin`) là một mật khẩu mạnh, không dùng lại mật khẩu khác.

Không commit file `.env.local` lên Git (đã có sẵn trong `.gitignore`).

---

## 1. Cài đặt & seed dữ liệu ban đầu (chạy 1 lần, ở máy local)

```bash
npm install
cp .env.local.example .env.local
# Mở .env.local, điền MONGODB_URI (mật khẩu MỚI sau khi đã đổi), ADMIN_PASSWORD, ADMIN_SESSION_SECRET

node -r dotenv/config scripts/seed.js dotenv_config_path=.env.local
```

Script này tạo unique index trên trường `updateDate` (tránh trùng ngày cập nhật) và nạp sẵn dữ liệu kỳ 11/09/2026 mà bạn đã có, để 2 dashboard có dữ liệu ngay sau khi deploy. Chạy 1 lần là đủ — chạy lại cũng an toàn (không tạo trùng).

---

## 2. Cấu hình biến môi trường trên Vercel

Vào **Project Settings → Environment Variables**, thêm:

| Tên biến | Giá trị |
|---|---|
| `MONGODB_URI` | chuỗi kết nối Atlas (mật khẩu mới) |
| `MONGODB_DB` | `dashboard-tt4` |
| `ADMIN_PASSWORD` | mật khẩu bạn tự đặt cho trang `/admin` |
| `ADMIN_SESSION_SECRET` | 1 chuỗi ngẫu nhiên dài (VD tạo bằng `openssl rand -hex 32`) |

Áp dụng cho cả 3 môi trường Production / Preview / Development.

---

## 3. Deploy lên Vercel

**Cách A — dùng Vercel CLI:**
```bash
npm install -g vercel
vercel        # deploy bản preview, làm theo hướng dẫn để link project
vercel --prod # deploy bản chính thức
```

**Cách B — qua GitHub:** đẩy toàn bộ thư mục này lên 1 repo GitHub, vào vercel.com → **Add New Project** → chọn repo → Deploy. Vercel tự nhận diện `/api/*.js` là serverless functions và phần còn lại là static site, không cần cấu hình build gì thêm.

---

## 4. Sử dụng

- Dashboard KPI: `https://<domain>/`
- Dashboard SPCNCL: `https://<domain>/spcncl_dashboard/`
- Trang quản trị: `https://<domain>/admin/` — đăng nhập bằng `ADMIN_PASSWORD`, chọn tab **KPI** hoặc **SPCNCL / SP Bộ giao**, bấm **+ Thêm kỳ mới** hoặc **Sửa** một kỳ có sẵn, điền số liệu rồi **Lưu kỳ cập nhật** — 2 dashboard sẽ hiển thị dữ liệu mới ngay lần tải trang kế tiếp (không cần deploy lại).
- File Excel: nếu muốn nút "Tải dữ liệu (.xlsx)" tải thẳng 1 file có sẵn, upload file đó vào thư mục `excel/` (đặt tên đúng như bạn gõ ở ô "Tên file Excel" trong trang quản trị) rồi deploy lại. Nếu để trống, hệ thống tự sinh file Excel từ dữ liệu hiện có trên dashboard.

---

## Cấu trúc thư mục

```
/
├── index.html                    Dashboard KPI
├── spcncl_dashboard/index.html   Dashboard SPCNCL
├── admin/index.html              Trang quản trị
├── api/
│   ├── kpi.js                    GET/POST/DELETE dữ liệu KPI
│   ├── spcncl.js                 GET/POST/DELETE dữ liệu SPCNCL
│   └── auth.js                   Đăng nhập/đăng xuất admin
├── lib/
│   ├── mongodb.js                Kết nối MongoDB (cache cho serverless)
│   └── session.js                Cookie phiên đăng nhập admin (HMAC, không cần thư viện ngoài)
├── scripts/seed.js                Script seed dữ liệu ban đầu + tạo index
├── excel/                        Nơi để file .xlsx gốc (tùy chọn)
├── package.json
├── .env.local.example
└── .gitignore
```
