// ✅ Main backend API entry (Vercel auto-detects this file)

import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data.json");

// 🔸 Helper: load local JSON DB (for saving notes)
function loadDB() {
  try {
    if (!fs.existsSync(dbPath)) return {};
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data || "{}");
  } catch (e) {
    return {};
  }
}

// 🔸 Helper: save JSON DB
function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// 🔸 Main handler
export default async function handler(req, res) {
  const { url, method } = req;

  // 🟢 1️⃣ VALIDATE KEY
  if (url === "/validate-key" && method === "POST") {
    const body = await readJSON(req);
    if (body.key === "MOMIN100") {
      return res.status(200).json({ success: true, message: "Login successful" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid key" });
    }
  }

  // 🟢 2️⃣ SAVE DATA
  if (url === "/save-data" && method === "POST") {
    const body = await readJSON(req);
    const db = loadDB();
    db[body.deviceID] = { notes: body.notes, updated: new Date().toISOString() };
    saveDB(db);
    return res.status(200).json({ success: true });
  }

  // 🟢 3️⃣ LOAD DATA
  if (url.startsWith("/load-data") && method === "GET") {
    const deviceID = new URL(req.url, "http://localhost").searchParams.get("deviceID");
    const db = loadDB();
    return res.status(200).json(db[deviceID] || {});
  }

  // 🟢 DEFAULT
  return res.status(200).json({
    success: true,
    message: "✅ Momin Receipt Backend Running Successfully!",
  });
}

// 🔹 Helper to read JSON body
async function readJSON(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}
