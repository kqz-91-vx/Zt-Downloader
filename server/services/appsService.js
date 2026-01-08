const axios = require('axios');

exports.searchApp = async (query) => {
    try {
        console.log(`[APK Store] Searching for: ${query}`);

        // 1. External API Call
        // Limit maine 100 set kiya hai taaki response fast rahe, 
        // agar tumhein 1000 chahiye to limit=1000 kar dena.
        const response = await axios.get('https://bj-aptoide-api.manzoor-coder.workers.dev/', {
            params: { 
                query: query,
                limit: 100 // Tumhari marzi, isko 1000 kar sakte ho
            }
        });

        const data = response.data;

        // 2. Validation
        if (!data || !data.success || !data.results || data.results.length === 0) {
            throw new Error('No apps found with that name.');
        }

        // 3. Data Mapping (Clean Data for Frontend)
        // Hum pura array map kar rahe hain taaki frontend pe slide kar sakein
        const formattedResults = data.results.map(app => ({
            title: app.name,
            package: app.package,
            version: app.version,
            developer: app.developer,
            size: `${app.size_mb} MB`,
            downloads: app.downloads,
            rating: app.rating,
            url: app.download_url, // Main APK Link
            thumbnail: app.icon,
            type: 'apk'
        }));

        return formattedResults; // Array return kar rahe hain

    } catch (error) {
        console.error("[APK Service Error]:", error.message);
        throw new Error("App not found or API Error.");
    }
};
