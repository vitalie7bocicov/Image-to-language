
const projectId = process.env.PROJECT_ID;
const keyFilename = './myapi-json.json';

const {Storage} = require('@google-cloud/storage')
const multer = require("multer");
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
                            const msg = { message: 'Successfully updated' };
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

module.exports = uploadPhoto