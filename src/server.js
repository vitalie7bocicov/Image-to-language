const express = require('express')
const getLabelsFromPhoto = require("./API/visionApi");
const app = express()


async function post(){

    const language = "ro";
    const labels = await getLabelsFromPhoto("./cat.jfif");
    console.log(labels);

}

app.listen(8080, 'localhost', ()=>{
    console.log("Server is listening on port 8080");
    post();
})