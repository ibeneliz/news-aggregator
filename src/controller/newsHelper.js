const { default: axios } = require('axios');

function newsAPIPromise(url) {
    return new Promise((resolve, reject) => {
        axios.get(url).then(res => {
            return resolve(res.data);
        }).catch((error) => {
            return reject(error);
        });
    });
}

module.exports = newsAPIPromise;