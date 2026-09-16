// lib/session.js
// Session admin đơn giản: 1 mật khẩu chung (ADMIN_PASSWORD) + cookie HttpOnly
// chứa token ký bằng HMAC-SHA256 (ADMIN_SESSION_SECRET), hết hạn sau 12 giờ.
// Không dùng thư viện ngoài, chỉ dùng module "crypto" có sẵn của Node.

const crypto = require('crypto');

const SECRET = process.env.ADMIN_SESSION_SECRET || 'change-me-please-set-a-real-secret';
const COOKIE_NAME = 'admin_session';
const MAX_AGE_MS = 1000 * 60 * 60 * 12; // 12 giờ

function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

function createSessionToken() {
  const expires = String(Date.now() + MAX_AGE_MS);
  return `${expires}.${sign(expires)}`;
}

function isTokenValid(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = sign(payload);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;
  return Number(payload) > Date.now();
}

function parseCookies(req) {
  const header = req.headers && req.headers.cookie;
  const out = {};
  if (!header) return out;
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  });
  return out;
}

function requireAdmin(req) {
  // Nếu req.cookies đã được Vercel tự parse sẵn thì ưu tiên dùng, không thì tự parse.
  const token = (req.cookies && req.cookies[COOKIE_NAME]) || parseCookies(req)[COOKIE_NAME];
  return isTokenValid(token);
}

function isProd() {
  return Boolean(process.env.VERCEL);
}

function loginCookieHeader(token) {
  const secure = isProd() ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${Math.floor(MAX_AGE_MS / 1000)}; SameSite=Lax${secure}`;
}

function logoutCookieHeader() {
  const secure = isProd() ? '; Secure' : '';
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

module.exports = {
  createSessionToken,
  isTokenValid,
  parseCookies,
  requireAdmin,
  loginCookieHeader,
  logoutCookieHeader,
};
