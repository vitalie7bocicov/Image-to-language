const axios = require('axios')

function postData(body) {
    return axios.post('https://us-central1-cloud-project-382306.cloudfunctions.net/sqlFunction', body, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        })
}

module.exports = postData