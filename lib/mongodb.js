// lib/mongodb.js
// Kết nối MongoDB dùng chung cho các API route.
// Cache lại Promise kết nối trên global để các lần "warm start" của serverless
// function không mở kết nối mới liên tục (tránh hết connection pool trên Atlas).

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'dashboard-tt4';

if (!uri) {
  console.warn('[mongodb] Thiếu biến môi trường MONGODB_URI');
}

function getClientPromise() {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    });
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}

module.exports = { getDb };
