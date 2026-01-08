const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// --- IMPORT SERVICE ---
// Sirf APK Service rakha hai, baaki sab remove kar diye
const services = {
    apps: require('./services/appsService'),
};

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- ROUTE HANDLER ---
app.post('/api/apps', async (req, res) => {
    const { url } = req.body; // Frontend se 'url' key mein hi App Name aayega

    console.log(`[SERVER] Requesting APK Search for: ${url}`);

    try {
        const appsService = services.apps;
        
        // Function call
        const data = await appsService.searchApp(url);
        
        // Data bhejo (Array of Apps)
        res.json(data);

    } catch (error) {
        console.error(`[ERROR]`, error.message);
        res.status(500).json({ error: "Search failed.", details: error.message });
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
