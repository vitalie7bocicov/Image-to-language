const express = require('express')
const getLabelsFromPhoto = require("./API/visionApi");
const translateText = require("./API/translationApi");
const synthesize = require('./API/textToSpeechApi');
const app = express()
const cors = require('cors');
const multer = require('multer');
const upload = multer();
require('dotenv').config();
const uploadPhoto = require("./API/functionApi");


app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.post('/what-is', upload.single('photo'), async (req, res) => {
    const photo = req.file.buffer;
    const language = req.body.language;

    const labels = await getLabelsFromPhoto(photo);
    for (let i = 0; i < labels.length; i++) {
        labels[i] = await translateText(labels[i], language);
    }
    uploadPhoto(req, labels);
    res.send(labels);
});


app.get('/speech', async (req, res) => {
    const text = req.query.text;
    const language = req.query.lang;
    const audio = await synthesize(text, language);
    res.send(audio);
});

app.listen(8081, '0.0.0.0',()=>{
    console.log("Server is listening on port 8081");
})