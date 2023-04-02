const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient({
    keyFilename : "./api-key.json"
});

async function synthesize(text, language) {

  const request = {
    input: {text: text},
    voice: {languageCode: language, ssmlGender: 'NEUTRAL'},
    audioConfig: {audioEncoding: 'MP3'},
  };
  const [response] = await client.synthesizeSpeech(request);

  return response.audioContent;
}

module.exports = synthesize;