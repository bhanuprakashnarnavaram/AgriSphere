const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// GNews API Key
const NEWS_API_KEY = "e4a4af9e13e80b2085027e6fb48d0f0e";

// Supported languages
const SUPPORTED_LANGUAGES = {
    en: 'English',
    hi: 'Hindi',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    mr: 'Marathi',
    gu: 'Gujarati',
    kn: 'Kannada',
    ml: 'Malayalam',
    pa: 'Punjabi'
};

// Function to fetch news
async function getAgriNews(query = "agriculture", language = "en") {
    const url = `https://gnews.io/api/v4/search?q=${query}&token=${NEWS_API_KEY}`;
    const params = {
        lang: language,
        country: 'in',
        max: 10
    };
    try {
        const response = await axios.get(url, { params });
        const articles = response.data.articles || [];
        return articles.map(article => ({
            title: article.title,
            source: article.source?.name || 'Unknown',
            url: article.url,
            description: article.description || '',
            image: article.image || ''
        }));
    } catch (error) {
        console.error("Error fetching news:", error.message);
        return [];
    }
}

// Routes
app.get('/', async (req, res) => {
    const query = "agriculture";
    const language = "en";
    const news_articles = await getAgriNews(query, language);
    res.render('index', {
        news_articles,
        query,
        current_language: language,
        languages: SUPPORTED_LANGUAGES
    });
});

app.post('/', async (req, res) => {
    const query = req.body.search_query || "agriculture";
    const language = req.body.language || "en";
    const news_articles = await getAgriNews(query, language);
    res.render('index', {
        news_articles,
        query,
        current_language: language,
        languages: SUPPORTED_LANGUAGES
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
