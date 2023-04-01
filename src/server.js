const express = require('express')
const getLabelsFromPhoto = require("./API/visionApi");
const translateText = require("./API/translationApi");
const listVoices = require("./API/textToSpeechApi");
const synthesize = require('./API/textToSpeechApi');
const app = express()
const cors = require('cors');


app.use(cors());

app.get('/whatIS', async (req, res) => {
    
    // const labels = await getLabelsFromPhoto("./cat.jfif");
    const labels = [
        'Cat',
        'Felidae',
        'Whiskers',
        'Terrestrial animal',
        'Close-up',
        'Fur',
        'Domestic short-haired cat'
    ];
    const language = req.query.lang;
    for (let i = 0; i < labels.length; i++) {
        labels[i] = await translateText(labels[i], language);
    }

    res.send(labels);
});


app.get('/pronunciation', async (req, res) => {
    console.log(req.query);
    const text = req.query.text;
    const language = req.query.lang;
    const audio = await synthesize(text, language);
    res.send(audio);
});


app.listen(8081, 'localhost', ()=>{
    console.log("Server is listening on port 8081");
})