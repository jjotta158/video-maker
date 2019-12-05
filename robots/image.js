const state = require('./fileSync.js');
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');
const imageDownloader = require('image-downloader');

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

    async function downloadImages(content)
    {
        content.downloadedImages = [];
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            const images = content.sentences[sentenceIndex].images;

            for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
                const imageUrl = images[imageIndex]

                try {
                    if (content.downloadedImages.includes(imageUrl)) {
                        throw new Error("Image on disk");
                    }

                    await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);
                    content.downloadedImages.push(imageUrl);
                    console.log('baixado com sucesso');
                    break;
                } catch (error) {
                    console.log('Não foi possível baixar');
                }
            }
        }
    }

    async function downloadAndSave(url, fileName)
    {
        return imageDownloader.image({
          url:url,
          dest:`../content/${fileName}`
        });
    }
}
module.exports = robot;
