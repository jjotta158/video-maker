const robots = {
    userInput:require("./userInput"),
    text:require("./text")
}

async function start()
{
    const orchestrator = {}; // Object that is the orchestrator
    robots.userInput(orchestrator); //robot to catch a user input.
    await robots.text(orchestrator);
    console.log(orchestrator.sourceContentSanitized);
}

start();
