const axios = require('axios');

exports.searchApp = async (query) => {
    try {
        console.log(`[Apps Service] Searching for: ${query}`);

        // 1. External API Call
        // Limit 100 rakhi hai taaki performance acchi rahe
        const response = await axios.get('https://bj-aptoide-api.manzoor-coder.workers.dev/', {
            params: { 
                query: query,
                limit: 100 
            }
        });

        const data = response.data;

        // 2. Validation
        if (!data || !data.success || !data.results || data.results.length === 0) {
            throw new Error('No apps found with this name.');
        }

        // 3. Return Raw Results (Array)
        // Hum pura array bhejenge taaki Frontend par Next/Prev kar sakein
        return data.results;

    } catch (error) {
        console.error("[Apps Service Error]:", error.message);
        throw new Error(error.response?.data?.message || "App not found or Server Error.");
    }
};
