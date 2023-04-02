const express = require('express')
const getLabelsFromPhoto = require("./API/visionApi");
const translateText = require("./API/translationApi");
const synthesize = require('./API/textToSpeechApi');
const app = express()
const cors = require('cors');
const multer = require('multer');
const upload = multer();

app.use(cors());

app.post('/what-is', upload.single('photo'), async (req, res) => {
    const photo = req.file.buffer;
    const language = req.body.language;

    const labels = await getLabelsFromPhoto(photo);
    for (let i = 0; i < labels.length; i++) {
        labels[i] = await translateText(labels[i], language);
    }
    res.send(labels);
});


app.get('/speech', async (req, res) => {
    const text = req.query.text;
    const language = req.query.lang;
    const audio = await synthesize(text, language);
    res.send(audio);
});


app.listen(8081, 'localhost', ()=>{
    console.log("Server is listening on port 8081");
})