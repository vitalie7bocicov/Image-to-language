const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient({
    keyFilename : "./api-key.json"
})

async function getLabelsFromPhoto(photo) {
    try {
        const result = await client.labelDetection(photo);
        const annotations = result[0].labelAnnotations;
        const labels = [];
        annotations.forEach((label) => labels.push(label.description))
        return labels;
    } catch (error) {
        console.log("ERROR IN getLabelsFromPhoto: " + error);
    }
}


module.exports = getLabelsFromPhoto

