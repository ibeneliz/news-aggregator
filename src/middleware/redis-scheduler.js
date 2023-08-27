const Queue = require('bull');
const cachedKeys = require('../models/cachedKeys.js');
const URLSearchparams = require('url-search-params');
const newsAPIPromise = require('../controller/newsHelper.js');
const redisClient = require("./redis-cache");

let baseUrl = 'https://newsapi.org/v2/top-headlines/';

const cachePeriodically = new Queue('cache-periodically');
const options = { repeat: { every: 1 * 10 * 1000 } };
cachePeriodically.add([], options);
cachePeriodically.process(async (job) => {
    cachedKeys.find(async (err, keyArray) => {
        if (!err) {
            for (let i = 0; i < keyArray.length; i++) {
                const client = redisClient.Client;
                const value = await client.get(keyArray[i].articlekey)
                if (value == null) {
                    const arr = keyArray[i].articlekey.split('-');
                    const searchParams1 = new URLSearchparams({ category: arr[1] });
                    const searchParams2 = new URLSearchparams({ country: arr[0] });
                    const searchParams3 = new URLSearchparams({ apiKey: process.env.API_KEY });
                    newsAPIPromise(`${baseUrl}?${searchParams1}&${searchParams2}&${searchParams3}`).then(resp => {
                        client.set(keyArray[i].articlekey, JSON.stringify(resp));
                        console.log("Inserted to cache:" + keyArray[i].articlekey)
                    }).catch(error => {
                        console.error("Oops we have an error!" + error);
                    });
                } else {
                    console.log("Cache already has:" + keyArray[i].articlekey);
                }
            }
        } else {
            console.log('Failed to retrieve the News List: ' + err);
        }
    });
});

module.exports = cachePeriodically;