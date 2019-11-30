const algorithmia = require('algorithmia');
//const watsonApiKey = require('../credentials/watson')

async function robot(orchestrator) {
    orchestrator.sourceContentOriginal = await fetchContentFromWikipedia(orchestrator);
    orchestrator.sourceContentSanitized = sanitizeContent(orchestrator.sourceContentOriginal);
    // breakContentIntoSentence(orchestrator);

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
}
module.exports = robot;
