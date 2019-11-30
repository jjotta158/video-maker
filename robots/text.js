const algorithmia = require('algorithmia');
const watsonApiKey = require('../watson.json').apiKey;
const sbd = require('sbd');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var nlu  = new NaturalLanguageUnderstandingV1({
  ian_apikey:watsonApiKey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})


async function fetchWatsonLangua
async function robot(orchestrator) {
    orchestrator.sourceContentOriginal = await fetchContentFromWikipedia(orchestrator);
    orchestrator.sourceContentSanitized = sanitizeContent(orchestrator.sourceContentOriginal);
    breakContentIntoSentence(orchestrator);


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
        const setences = sbd.sentences(orchestrator.sourceContentSanitized);
        sentences.forEach((sentence) => {
            content.sentences.push({
              text:sentence,
              keywords: [],
              images: [],
            })
        })

    }
}
module.exports = robot;
