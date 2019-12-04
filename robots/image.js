const state = require('./fileSync.js');
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');

const googleCredentials = require('../credentials/googleApi.json');

async function robot()
{
    const content = state.load();

    await fetchImageOfAllSentences(content)
    state.save(content);
    async function fetchImageOfAllSentences(content)
    {
        for (const sentence of content.sentences) {
            const query = `${content.searchTerm} ${sentence.keywords[0]}`
            sentence.images = await fetchImages(query);

            sentence.googleSeachQuery = query;
        }
    }

    async function fetchImages(query)
    {
        const response = await customSearch.cse.list({
            auth: googleCredentials.api_key,
            cx:googleCredentials.search_engine,
            q:query,
            searchType:'image',
            imgSize:'huge',
            num:2
        });

        const imagesUrl = response.data.items.map((item) => {
            return item.link;
        })

        return imagesUrl;
    }
}

module.exports = robot;
