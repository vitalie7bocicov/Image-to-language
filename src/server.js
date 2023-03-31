const express = require('express')
const getLabelsFromPhoto = require("./API/visionApi");
const app = express()


async function post(){

    const language = "ro";
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

    console.log(labels);

}

app.listen(8080, 'localhost', ()=>{
    console.log("Server is listening on port 8080");
    post();
})