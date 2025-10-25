const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ALGO = "aes-256-gcm";
const KEY_NAME = "store.key";
const INDEX_NAME = "index.json";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function keyPath(base) { return path.join(base, KEY_NAME); }
function indexPath(base) { return path.join(base, INDEX_NAME); }

function genKey() {
  return crypto.randomBytes(32);
}

function writeKey(base, key) {
  const kp = keyPath(base);
  fs.writeFileSync(kp, key);
  try { fs.chmodSync(kp, 0o600); } catch {}
}

function readKey(base) {
  const kp = keyPath(base);
  if (!fs.existsSync(kp)) return null;
  return fs.readFileSync(kp);
}

function encryptBuffer(key, buf) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(buf), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]);
}

function decryptBuffer(key, blob) {
  const iv = blob.slice(0, 12);
  const tag = blob.slice(12, 28);
  const enc = blob.slice(28);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]);
}

function loadIndex(base, key) {
  const ip = indexPath(base);
  if (!fs.existsSync(ip)) return {};
  try {
    const raw = fs.readFileSync(ip);
    if (!key) return JSON.parse(raw.toString("utf8"));
    const dec = decryptBuffer(key, raw);
    return JSON.parse(dec.toString("utf8"));
  } catch { return {}; }
}

function saveIndex(base, key, idx) {
  const ip = indexPath(base);
  const data = Buffer.from(JSON.stringify(idx), "utf8");
  if (key) {
    const enc = encryptBuffer(key, data);
    fs.writeFileSync(ip, enc);
  } else {
    fs.writeFileSync(ip, data);
  }
  try { fs.chmodSync(ip, 0o600); } catch {}
}

module.exports = {
  initStore: (baseDir) => {
    ensureDir(baseDir);
    let key = readKey(baseDir);
    if (!key) {
      key = genKey();
      writeKey(baseDir, key);
    }
    const index = loadIndex(baseDir, key);
    return { key, index };
  },

  listSessions: (baseDir) => {
    const key = readKey(baseDir);
    const idx = loadIndex(baseDir, key);
    return Object.keys(idx).map(k => ({ name: k, file: idx[k].file, createdAt: idx[k].createdAt }));
  },

  saveSession: (baseDir, name, sessionString) => {
    ensureDir(baseDir);
    const key = readKey(baseDir) || genKey();
    if (!readKey(baseDir)) writeKey(baseDir, key);
    const idx = loadIndex(baseDir, key);
    const fname = idx[name]?.file || `sess-${crypto.randomBytes(6).toString("hex")}.dat`;
    const payload = Buffer.from(JSON.stringify({ string: sessionString }), "utf8");
    const enc = encryptBuffer(key, payload);
    fs.writeFileSync(path.join(baseDir, fname), enc);
    idx[name] = { file: fname, createdAt: new Date().toISOString() };
    saveIndex(baseDir, key, idx);
    return { name, file: fname };
  },

  loadSession: (baseDir, name) => {
    const key = readKey(baseDir);
    if (!key) return null;
    const idx = loadIndex(baseDir, key);
    const meta = idx[name];
    if (!meta) return null;
    const blob = fs.readFileSync(path.join(baseDir, meta.file));
    const dec = decryptBuffer(key, blob);
    try { return JSON.parse(dec.toString("utf8")).string || null; } catch { return null; }
  },

  deleteSession: (baseDir, name) => {
    const key = readKey(baseDir);
    if (!key) return false;
    const idx = loadIndex(baseDir, key);
    const meta = idx[name];
    if (!meta) return false;
    try { fs.unlinkSync(path.join(baseDir, meta.file)); } catch {}
    delete idx[name];
    saveIndex(baseDir, key, idx);
    return true;
  },

  loadAllSessions: (baseDir) => {
    const key = readKey(baseDir);
    if (!key) return [];
    const idx = loadIndex(baseDir, key);
    const out = [];
    for (const name of Object.keys(idx)) {
      const meta = idx[name];
      try {
        const blob = fs.readFileSync(path.join(baseDir, meta.file));
        const dec = decryptBuffer(key, blob);
        const s = JSON.parse(dec.toString("utf8")).string;
        out.push({ name, session: s, meta });
      } catch {}
    }
    return out;
  }
};