const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// --- IMPORT SERVICE ---
// Sirf Apps Service active hai ab
const appsService = require('./services/appsService');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- MAIN ROUTE ---
app.post('/api/apps', async (req, res) => {
    const { url } = req.body; // Frontend se 'url' variable mein Search Query aayegi

    if (!url) {
        return res.status(400).json({ error: "Query name is required" });
    }

    console.log(`[SERVER] Searching App: ${url}`);

    try {
        // Service function call karein
        const results = await appsService.searchApp(url);
        
        // Success response
        res.json(results);

    } catch (error) {
        console.error(`[ERROR]`, error.message);
        res.status(500).json({ error: "Failed to fetch apps.", details: error.message });
    }
});

// Cek Status Server
app.get('/', (req, res) => {
    res.send('ZERONAUT APK ENGINE READY 🚀');
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`>> SERVER NYALA DI: http://localhost:${PORT}`);
    });
}

module.exports = app;
