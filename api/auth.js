// api/auth.js
// GET  -> { authenticated: true|false }
// POST { password }        -> đăng nhập, set cookie phiên admin
// POST { action: 'logout' } -> đăng xuất, xoá cookie

const {
  createSessionToken,
  requireAdmin,
  loginCookieHeader,
  logoutCookieHeader,
} = require('../lib/session');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json({ authenticated: requireAdmin(req) });
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body || '{}'); } catch { body = {}; }
    }
    body = body || {};

    if (body.action === 'logout') {
      res.setHeader('Set-Cookie', logoutCookieHeader());
      return res.status(200).json({ ok: true });
    }

    if (!process.env.ADMIN_PASSWORD) {
      return res.status(500).json({ error: 'Server chưa cấu hình ADMIN_PASSWORD.' });
    }
    if (!body.password || body.password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Sai mật khẩu.' });
    }

    const token = createSessionToken();
    res.setHeader('Set-Cookie', loginCookieHeader(token));
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
};
