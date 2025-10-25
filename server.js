// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ======== 100 hardcoded keys ========
const KEYS = [
  "A1B2C3","D4E5F6","G7H8I9","J1K2L3","M4N5O6","P7Q8R9","S1T2U3","V4W5X6","Y7Z8A9","B1C2D3",
  "E4F5G6","H7I8J9","K1L2M3","N4O5P6","Q7R8S9","T1U2V3","W4X5Y6","Z7A8B9","C1D2E3","F4G5H6",
  "I7J8K9","L1M2N3","O4P5Q6","R7S8T9","U1V2W3","X4Y5Z6","A7B8C9","D1E2F3","G4H5I6","J7K8L9",
  "M1N2O3","P4Q5R6","S7T8U9","V1W2X3","Y4Z5A6","B7C8D9","E1F2G3","H4I5J6","K7L8M9","N1O2P3",
  "Q4R5S6","T7U8V9","W1X2Y3","Z4A5B6","C7D8E9","F1G2H3","I4J5K6","L7M8N9","O1P2Q3","R4S5T6",
  "U7V8W9","X1Y2Z3","A4B5C6","D7E8F9","G1H2I3","J4K5L6","M7N8O9","P1Q2R3","S4T5U6","V7W8X9",
  "Y1Z2A3","B4C5D6","E7F8G9","H1I2J3","K4L5M6","N7O8P9","Q1R2S3","T4U5V6","W7X8Y9","Z1A2B3",
  "C4D5E6","F7G8H9","I1J2K3","L4M5N6","O7P8Q9","R1S2T3","U4V5W6","X7Y8Z9","A1B2C4","D3E4F5",
  "G6H7I8","J9K1L2","M3N4O5","P6Q7R8","S9T1U2","V3W4X5","Y6Z7A8","B9C1D2","E3F4G5","H6I7J8",
  "K9L1M2","N3O4P5","Q6R7S8","T9U1V2","W3X4Y5","Z6A7B8","C9D1E2","F3G4H5","I6J7K8","L9M1N2"
];

// ======== In-memory notes store ========
const notesStore = {}; // deviceID -> { notes: "..." }

// ======== Routes ========

// Validate key
app.post('/validate-key', (req, res) => {
  const { key } = req.body;
  if (!key) return res.json({ success: false, message: 'Key required' });

  if (KEYS.includes(key.toUpperCase())) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false, message: 'Invalid key' });
  }
});

// Save notes
app.post('/save-data', (req, res) => {
  const { deviceID, notes } = req.body;
  if (!deviceID) return res.status(400).json({ success: false, message: 'deviceID required' });

  notesStore[deviceID] = { notes };
  return res.json({ success: true });
});

// Load notes
app.get('/load-data', (req, res) => {
  const { deviceID } = req.query;
  if (!deviceID) return res.status(400).json({ success: false, message: 'deviceID required' });

  const data = notesStore[deviceID] || { notes: "" };
  return res.json(data);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Hard keys:', KEYS);
});
