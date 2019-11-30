const readLine = require("readline-sync");

module.exports = (orchestrator) => {
    orchestrator.searchTerm = askSearchTerm()
    orchestrator.prefix = askPrefix();

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
    return orchestrator;
}
