const axios = require('axios');

require('dotenv').config();
const API_KEY = process.env.API_KEY;

async function translateText(text, targetLanguage) {
    try {
        const response = await axios.post(
            `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
            {
                q: text,
                target: targetLanguage
            }
        );
        const translation = response.data.data.translations[0].translatedText;
        return translation;
    } catch (err) {
        console.error(`Error translating text "${text}": ${err}`);
        throw err;
    }
}

module.exports = translateText