const readLine = require("readline-sync");

module.exports = (orchestrator) => {
    orchestrator.searchTerm = askSearchTerm()
    orchestrator.prefix = askPrefix();
    orchestrator.maximumSentences = maxSentences();

    function askSearchTerm ()
    {
        return readLine.question("Type a Wikipedia seach term: ");
    }

    function askPrefix()
    {
        const prefixes = ['Who is', 'what is', 'The History of'];
        const selectedPrefixIndex = readLine.keyInSelect(prefixes);
        const selectedPrefixText = prefixes[selectedPrefixIndex];
        return selectedPrefixText;
    }

    function maxSentences()
    {
        return readLine.question("Type the max of sentences that you want ");
    }
    return orchestrator;
}
