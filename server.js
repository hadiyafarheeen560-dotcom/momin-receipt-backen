import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// ======= Path setup for Vercel =======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======= In-memory data (for demo) =======
let cloudData = {};
let validKeys = ["MOMIN123", "ADMIN4321", "TEST999"]; // 🔑 Allowed login keys

// ======= API ROUTES =======

// ✅ Server Test
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ API: Check if backend running
app.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "✅ Momin Receipt Backend Running Successfully!",
  });
});

// ✅ API: Validate Key
app.post("/validate-key", (req, res) => {
  const { key } = req.body;
  if (validKeys.includes(key)) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// ✅ API: Save Notes
app.post("/save-data", (req, res) => {
  const { deviceID, notes } = req.body;
  if (!deviceID) return res.status(400).json({ error: "Missing deviceID" });
  cloudData[deviceID] = notes || "";
  res.json({ success: true });
});

// ✅ API: Load Notes
app.get("/load-data", (req, res) => {
  const { deviceID } = req.query;
  if (!deviceID) return res.status(400).json({ error: "Missing deviceID" });
  res.json({ notes: cloudData[deviceID] || "" });
});

// ======= Serve Frontend HTML =======
app.use(express.static(__dirname)); // serve index.html + assets

// ======= Start Server (for local) =======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
