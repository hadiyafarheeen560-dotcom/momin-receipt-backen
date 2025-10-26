const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Optional API route to save receipt data
app.post('/api/save', (req, res) => {
    const data = req.body;
    console.log('Received receipt data:', data);
    // Here you can save to DB or file
    res.json({ status: 'success', message: 'Receipt saved' });
});

// Fallback: serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
