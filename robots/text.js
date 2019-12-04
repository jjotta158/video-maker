const algorithmia = require('algorithmia');
const watsonApiKey = require('../watson.json');
const sbd = require('sbd');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const state = require('./fileSync.js');

const nlu  = new NaturalLanguageUnderstandingV1({
  iam_apikey:watsonApiKey.apikey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})

async function robot() {
    const orchestrator = state.load();
    console.log(orchestrator);
    orchestrator.sourceContentOriginal = await fetchContentFromWikipedia(orchestrator);
    orchestrator.sourceContentSanitized = sanitizeContent(orchestrator.sourceContentOriginal);
    breakContentIntoSentence(orchestrator);
    limitMaximunSentences(orchestrator);
    await fetchKeywordsOfAllSentences(orchestrator);
    state.save(orchestrator);


    async function fetchContentFromWikipedia (orchestrator)
    {
        const algorithmiaAuthenticated = algorithmia("simtREUOwBGuXpvtpXm2Sklz5B61");
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo("web/WikipediaParser/0.1.2?timeout=300");
        const wikipediaResponse = await wikipediaAlgorithm.pipe( orchestrator.searchTerm);
        const wikipediaContent = wikipediaResponse.get();
        return wikipediaContent.content;
    }

    function sanitizeContent(text)
    {
        const withoutBlankLines = removeBlankLines(text);
        const withoutMarkdowns = removeMarkdown(withoutBlankLines);

        function removeBlankLines(text)
        {
            const allLines = text.split('\n');
            const withoutBlankLines = allLines.filter((line) => {
                if (line.trim().length === 0) {
                  return false;
                }
                return true;
            })
            return withoutBlankLines;
        }

        function removeMarkdown(lines)
        {
            const withoutMarkDowns = lines.filter((line) => {
                if (line.trim().startsWith('=')) {
                    return false;
                }
                return true;
            })
            return withoutMarkDowns;
        }
        return withoutMarkdowns.join(" ");
    }

    function breakContentIntoSentence(orchestrator)
    {
        orchestrator.sentences = [];
        const sentences = sbd.sentences(orchestrator.sourceContentSanitized);
        sentences.forEach((sentence) => {
            orchestrator.sentences.push({
              text:sentence,
              keywords: [],
              images: [],
            })
        })

    }

    async function fetchWatsonAndReturnKeywords(sentence)
    {
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text: sentence,
                features: {
                    keywords: {}
                }
            }, (error, response) => {
                if (error) {
                    throw error
                }

                const keywords = response.keywords.map((keywords) => {
                  return keywords.text
                })
                resolve(keywords);
            })
        })
    }

    function limitMaximunSentences(orchestrator)
    {
        orchestrator.sentences = orchestrator.sentences.slice(0, orchestrator.maximumSentences);
    }
    async function fetchKeywordsOfAllSentences(orchestrator)
    {
        for (const sentence of orchestrator.sentences) {
          sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text);
        }
    }
}


module.exports = robot;
