const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const router = express.Router();

// Save receipt data to JSON file
router.post('/save', async (req, res) => {
    try {
        const data = req.body;
        const dir = path.join(__dirname, '..', 'data');
        await fs.ensureDir(dir);

        const timestamp = Date.now();
        const filePath = path.join(dir, `receipt-${timestamp}.json`);
        await fs.writeJson(filePath, data, { spaces: 2 });

        res.json({ status: 'success', message: 'Receipt saved', file: filePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;
