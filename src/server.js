const express = require('express')
const getLabelsFromPhoto = require("./API/visionApi");
const translateText = require("./API/translationApi");
const synthesize = require('./API/textToSpeechApi');
const postData = require('./API/functionApi')
const app = express()
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();
const upload = multer();
const {Storage} = require('@google-cloud/storage')


app.use(cors());

app.post('/what-is', upload.single('photo'), async (req, res) => {
    const photo = req.file.buffer;
    const language = req.body.language;

    // const labels = await getLabelsFromPhoto(photo);
    // for (let i = 0; i < labels.length; i++) {
    //     labels[i] = await translateText(labels[i], language);
    // }

    const labels = ['cat', 'hello', 'dog'];
    uploadPhoto(req, labels);
    res.send('ok');
});


app.get('/speech', async (req, res) => {
    const text = req.query.text;
    const language = req.query.lang;
    const audio = await synthesize(text, language);
    res.send(audio);
});

const projectId = process.env.PROJECT_ID;
const keyFilename = 'myapi-json.json';

const storage = new Storage({
    projectId,
    keyFilename
});
const bucket = storage.bucket(process.env.BUCKET_NAME);

const uploadPhoto = (req, labels) => {
    try {
        if(req.file !== undefined) {
            const blob = bucket.file(req.file.originalname);
            blob.exists(req.file.originalname).then(r => {
                if(r[0]) {
                    const msg = {message: 'Image already present'};
                    return;
                }

                const blobStream = blob.createWriteStream();

                blobStream.on('finish', () => {
                    const stringLabels = labels.join(',');
                    console.log(stringLabels);

                    const body = {
                        filename: req.file.originalname,
                        labels: stringLabels
                    }
                    
                    fetch('https://us-central1-edik-317621.cloudfunctions.net/sqlFunction', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    })
                        .then(r => {
                            return r.json();
                        })
                        .then(r => {
                            const msg = { message: 'Sucesfully updated' };

                            console.log(msg);
                            //res.status(200).json(msg);
                        });

                });
                blobStream.on('error', () => {
                    const msg = {message: 'Could not insert file on storage'};
                });
                blobStream.end(req.file.buffer);
            });
        }
    }
    catch(err) {
        const msg = {message: 'Could not insert file on storage'};
    }
};


app.listen(8081, 'localhost', ()=>{
    console.log("Server is listening on port 8081");
})