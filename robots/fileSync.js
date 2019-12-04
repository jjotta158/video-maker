const fs = require("fs");
const orchestratorFilePath = './orchestrator.json';

function save(orchestrator)
{
    const orchestratorString = JSON.stringify(orchestrator);
    return fs.writeFileSync(orchestratorFilePath, orchestratorString);
}

function load()
{
    const fileBuffer = fs.readFileSync(orchestratorFilePath, 'utf-8');
    const orchestratorJson = JSON.parse(fileBuffer);
    return orchestratorJson;
}

module.exports = {
    save,
    load
}
