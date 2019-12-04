const state = require('./fileSync.js');
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');

const googleCredentials = require('../credentials/googleApi.json');

async function robot()
{
    const content = state.load();
    const response = await customSearch.cse.list({
        auth: googleCredentials.api_key,
        cx:googleCredentials.search_engine,
        q:'Michael Jackson',
        searchType:'image',
        imgSize:'huge',
        num:2
    })
    console.dir(response, { depth:null });
    process.exit(0);
}

module.exports = robot;
