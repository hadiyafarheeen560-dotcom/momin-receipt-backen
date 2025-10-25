// Required packages
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Low, JSONFile } = require("lowdb");
const { nanoid } = require("nanoid");

// Create express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database setup (lowdb, JSON file)
const adapter = new JSONFile("db.json");
const db = new Low(adapter);

// Initialize DB
async function initDB() {
  await db.read();
  db.data ||= { keys: [], notes: [] };
  await db.write();
}
initDB();

// ================= Key System =================
// Generate a new key (for admin/testing)
app.get("/generate-key", async (req, res) => {
  await db.read();
  const key = nanoid(12); // 12-character random key
  db.data.keys.push({ key, device: null });
  await db.write();
  res.json({ key });
});

// Validate key
app.post("/validate-key", async (req, res) => {
  const { key } = req.body;
  await db.read();
  const keyEntry = db.data.keys.find((k) => k.key === key);
  if (!keyEntry) return res.json({ success: false });
  res.json({ success: true });
});

// ================= Cloud Notes =================
// Save notes
app.post("/save-data", async (req, res) => {
  const { deviceID, notes } = req.body;
  await db.read();
  db.data.notes.push({ deviceID, notes, time: new Date() });
  await db.write();
  res.json({ success: true });
});

// Load notes
app.get("/load-data", async (req, res) => {
  const { deviceID } = req.query;
  await db.read();
  const note = db.data.notes.filter((n) => n.deviceID === deviceID).pop();
  res.json({ notes: note ? note.notes : "" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
