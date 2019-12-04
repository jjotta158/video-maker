const robots = {
    userInput:require("./userInput"),
    text:require("./text"),
    state: require('./fileSync'),
    image: require('./image')
}

async function start()
{
    const orchestrator = {}; // Object that is the orchestrator
    robots.userInput(orchestrator); //robot to catch a user input.
    await robots.text();
    await robots.image();
}

start();
