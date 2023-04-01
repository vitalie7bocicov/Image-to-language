const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient({
    keyFilename : "./api-key.json"
});

async function synthesize(text, language) {
  // const fs = require('fs');
  // const util = require('util');

  const request = {
    input: {text: text},
    voice: {languageCode: language, ssmlGender: 'NEUTRAL'},
    audioConfig: {audioEncoding: 'MP3'},
  };

  const [response] = await client.synthesizeSpeech(request);

  // const writeFile = util.promisify(fs.writeFile);
  // await writeFile('output.mp3', response.audioContent, 'binary');

  return response.audioContent;
}

module.exports = synthesize;