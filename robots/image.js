const state = require('./fileSync.js');
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');

const googleCredentials = require('../credentials/googleApi.json');

async function robot()
{
    const content = state.load();

    await fetchImageOfAllSentences(content)

    state.save(content);
    console.log(content.sentences);
    async function fetchImageOfAllSentences(content)
    {
        for (const sentence of content.sentences) {
            var i = 0;
            while(sentence.keywords.length > i) {
                const query = `${content.searchTerm} ${sentence.keywords[i]}`
                sentence.images = await fetchImages(query);
                sentence.googleSeachQuery = query;
                if (sentence.images != false) {
                    i = sentence.keywords.length;
                }
                i++;
            }

        }
    }

    async function fetchImages(query)
    {
        const response = await customSearch.cse.list({
            auth: googleCredentials.api_key,
            cx:googleCredentials.search_engine,
            q:query,
            searchType:'image',
            num:2
        });
        if (response.data.items) {
          const imagesUrl = response.data.items.map((item) => {
              return item.link;
          })

          return imagesUrl;
        } else {
          return false;
        }

    }
}
module.exports = robot;
