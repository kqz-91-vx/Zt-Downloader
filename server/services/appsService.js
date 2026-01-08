const axios = require('axios');

exports.searchApp = async (query) => {
    try {
        // Log for debugging
        console.log(`[Apps Service] Searching for: ${query}`);

        // 1. External API Call (GET Method)
        // Backend se call karne par CORS error nahi aata
        const response = await axios.get('https://f-droid-search-download-bj.vercel.app/', {
            params: { q: query }
        });

        const data = response.data;

        // 2. Validation
        if (!data || data.ok === false) {
            throw new Error('Application not found or API error.');
        }

        // 3. Data Mapping (External API -> Frontend Format)
        // Hum data ko waisa bana rahe hain jaisa App.jsx expect karta hai
        const result = {
            title: data.name || query,
            // Fallback icon agar API se na mile
            thumbnail: data.icon || 'https://cdn-icons-png.flaticon.com/512/107/107168.png',
            author: data.creator || data.package || 'App Store',
            // APK URL ko 'url' field mein daal rahe hain taaki button kaam kare
            url: data.apkUrl || data.link, 
            description: data.summary || data.description,
            size: 'Latest Version',
            date: data.version || new Date().toISOString().split('T')[0],
            type: 'app',
            // Frontend logic ke liye specific format
            formats: [
                {
                    label: 'DOWNLOAD APK',
                    url: data.apkUrl,
                    ext: 'apk'
                }
            ]
        };

        return result;

    } catch (error) {
        console.error("[Apps Service Error]:", error.message);
        throw new Error(error.response?.data?.message || "App not found.");
    }
};
